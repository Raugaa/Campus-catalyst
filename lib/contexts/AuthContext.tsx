"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  profile?: any;
  collegeId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  registerCompany: (data: any) => Promise<any>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loginAction = useAction(api.actions.login);
  const registerCompanyAction = useAction(api.actions.registerCompany);
  const getUserProfileAction = useAction(api.actions.getUserProfile);

  // ✅ Check authentication on mount and handle reloads
  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔍 Checking auth...");
      const token = localStorage.getItem('convex-token');
      
      if (!token) {
        console.log("❌ No token found");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("📞 Calling getUserProfile with token");
        const profileResult = await getUserProfileAction({ token });
        console.log("📋 Full Profile result:", JSON.stringify(profileResult, null, 2));
        
        if (profileResult?.valid) {
          // ✅ Normalize role to handle global admin
          const normalizedRole = profileResult.role.toLowerCase().replace('_', '-');
          
          // ✅ Deep inspect the profile structure
          console.log("🔍 Profile structure analysis:");
          console.log("- profileResult.profile:", profileResult.profile);
          console.log("- profileResult.user:", profileResult.user);
          console.log("- profileResult.collegeId:", profileResult.collegeId);
          
          // Extract collegeId with comprehensive checks
          let collegeId = null;
          
          // For ADMIN role, collegeId is in the profile object
          if (profileResult.role === "ADMIN" && profileResult.profile?.collegeId) {
            collegeId = profileResult.profile.collegeId;
            console.log("✅ Admin collegeId found in profile:", collegeId);
          }
          // For STUDENT/FACULTY, collegeId is also in profile
          else if (profileResult.profile?.collegeId) {
            collegeId = profileResult.profile.collegeId;
            console.log("✅ CollegeId found in profile:", collegeId);
          }
          // For COMPANY, collegeId might be optional
          else if (profileResult.role === "COMPANY" && profileResult.profile?.collegeId) {
            collegeId = profileResult.profile.collegeId;
            console.log("✅ Company collegeId found in profile:", collegeId);
          }
          // Direct collegeId (fallback)
          else if (profileResult.collegeId) {
            collegeId = profileResult.collegeId;
            console.log("✅ CollegeId found at root level:", collegeId);
          }
          // From user object (fallback)
          else if (profileResult.user?.collegeId) {
            collegeId = profileResult.user.collegeId;
            console.log("✅ CollegeId found in user:", collegeId);
          }
          else {
            console.log("⚠️ CollegeId not found in any expected location");
            console.log("🔍 Available keys in profileResult:", Object.keys(profileResult));
            if (profileResult.profile) {
              console.log("🔍 Available keys in profile:", Object.keys(profileResult.profile));
            }
            if (profileResult.user) {
              console.log("🔍 Available keys in user:", Object.keys(profileResult.user));
            }
            
            // For GLOBAL_ADMIN, collegeId is not required
            if (profileResult.role !== "GLOBAL_ADMIN") {
              console.warn("⚠️ No collegeId found for role:", profileResult.role);
            }
          }
          
          const userData = {
            id: profileResult.userId,
            email: profileResult.email,
            role: normalizedRole,
            collegeId: collegeId,
            profile: profileResult.profile
          };
          
          console.log("👤 Final user data:", userData);
          setUser(userData);
        } else {
          console.log("❌ Invalid token, clearing storage");
          setUser(null);
          localStorage.removeItem('convex-token');
        }
      } catch (error) {
        console.error('💥 Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('convex-token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [getUserProfileAction]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await loginAction({ email, password });
      console.log("Login result:", result);
      
      if (result?.token) {
        localStorage.setItem('convex-token', result.token);
        
        // ✅ Get profile immediately after login
        const profileResult = await getUserProfileAction({ token: result.token });
        console.log("Profile result after login:", profileResult);
        
        if (profileResult?.valid) {
          const normalizedRole = profileResult.role.toLowerCase().replace('_', '-');
          
          // Extract collegeId with comprehensive checks
          let collegeId = null;
          
          // For ADMIN role, collegeId is in the profile object
          if (profileResult.role === "ADMIN" && profileResult.profile?.collegeId) {
            collegeId = profileResult.profile.collegeId;
          }
          // For other roles
          else if (profileResult.profile?.collegeId) {
            collegeId = profileResult.profile.collegeId;
          }
          else if (profileResult.collegeId) {
            collegeId = profileResult.collegeId;
          }
          else if (profileResult.user?.collegeId) {
            collegeId = profileResult.user.collegeId;
          }
          
          const userData = {
            id: profileResult.userId,
            email: profileResult.email,
            role: normalizedRole,
            collegeId: collegeId,
            profile: profileResult.profile
          };
          
          setUser(userData);
        }
        
        return result;
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('convex-token');
    setUser(null);
    router.push('/auth/login');
  };

  const registerCompany = async (data: any) => {
    try {
      setLoading(true);
      return await registerCompanyAction(data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('convex-token');
    if (!token) return;

    try {
      const profileResult = await getUserProfileAction({ token });
      if (profileResult?.valid) {
        const normalizedRole = profileResult.role.toLowerCase().replace('_', '-');
        
        // Extract collegeId with comprehensive checks
        let collegeId = null;
        
        // For ADMIN role, collegeId is in the profile object
        if (profileResult.role === "ADMIN" && profileResult.profile?.collegeId) {
          collegeId = profileResult.profile.collegeId;
        }
        // For other roles
        else if (profileResult.profile?.collegeId) {
          collegeId = profileResult.profile.collegeId;
        }
        else if (profileResult.collegeId) {
          collegeId = profileResult.collegeId;
        }
        else if (profileResult.user?.collegeId) {
          collegeId = profileResult.user.collegeId;
        }
        
        const userData = {
          id: profileResult.userId,
          email: profileResult.email,
          role: normalizedRole,
          collegeId: collegeId,
          profile: profileResult.profile
        };
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      registerCompany,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
