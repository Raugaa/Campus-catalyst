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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  registerCompany: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>; // ✅ Add refresh function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use Convex hooks
  const loginAction = useAction(api.actions.login);
  const registerCompanyMutation = useAction(api.actions.registerCompany);
  const getUserProfileAction = useAction(api.actions.getUserProfile);

  // ✅ Function to refresh profile data
  const refreshProfile = async () => {
    const token = localStorage.getItem('convex-token');
    if (!token) return;

    try {
      const profileResult = await getUserProfileAction({ token });
      if (profileResult?.valid) {
        setUser({
          id: profileResult.userId,
          email: profileResult.email,
          role: profileResult.role,
          profile: profileResult.profile
        });
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth...");
      const token = localStorage.getItem('convex-token');
      
      if (!token) {
        console.log("No token found");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Calling getUserProfile with token");
        const profileResult = await getUserProfileAction({ token });
        console.log("Profile result:", profileResult);
        
        if (profileResult?.valid) {
          setUser({
            id: profileResult.userId,
            email: profileResult.email,
            role: profileResult.role,
            profile: profileResult.profile
          });
        } else {
          console.log("Invalid token");
          setUser(null);
          localStorage.removeItem('convex-token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
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
      setLoading(true); // ✅ Set loading during login
      const result = await loginAction({ email, password });
      console.log("Login result:", result);
      
      if (result?.token) {
        localStorage.setItem('convex-token', result.token);
        
        // ✅ Immediately fetch profile after login
        setTimeout(async () => {
          await refreshProfile();
        }, 100); // Small delay to ensure token is saved
        
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
    setUser(null);
    localStorage.removeItem("convex-token");
    router.push("/auth/login");
  };

  const registerCompany = async (data: any) => {
    try {
      await registerCompanyMutation(data);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
