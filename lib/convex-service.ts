\import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export class ConvexService {
  constructor(private client: ConvexHttpClient = convex) {}

  // Auth methods
  async login(email: string, password: string) {
    try {
      return await this.client.action(api.actions.login, { email, password });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  async registerCompany(data: {
    email: string;
    password: string;
    name: string;
    website?: string;
    location: string;
    industry?: string;
    size?: string;
    description?: string;
  }) {
    try {
      return await this.client.action(api.actions.registerCompany, data);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }

  async getCurrentUser(userId: Id<"users">) {
    try {
      return await this.client.query(api.queries.getCurrentUser, { userId });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to get user");
    }
  }

  // Admin methods
  async getStudents(params: {
    q?: string;
    department?: string;
    year?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    return await this.client.query(api.queries.getStudents, params);
  }

  async getCompanies(params: {
    status?: string;
    q?: string;
    skip?: number;
    take?: number;
  }) {
    return await this.client.query(api.queries.getCompanies, params);
  }

  async getFaculty(params: {
    q?: string;
    department?: string;
    skip?: number;
    take?: number;
  }) {
    return await this.client.query(api.queries.getFaculty, params);
  }

  async getOpportunities(params: {
    status?: string;
    type?: string;
    q?: string;
    skip?: number;
    take?: number;
  }) {
    return await this.client.query(api.queries.getOpportunities, params);
  }

  async getApplications(params: {
    status?: string;
    studentId?: Id<"students">;
    opportunityId?: Id<"opportunities">;
    skip?: number;
    take?: number;
  }) {
    return await this.client.query(api.queries.getApplications, params);
  }

  async getAdminAnalytics() {
    return await this.client.query(api.queries.getAdminAnalytics, {});
  }

  // Mutation methods
  async updateStudentStatus(studentId: Id<"students">, isActive: boolean) {
    return await this.client.mutation(api.mutations.updateStudentStatus, {
      studentId,
      isActive,
    });
  }

  async assignMentor(studentId: Id<"students">, mentorId: Id<"faculty">) {
    return await this.client.mutation(api.mutations.assignMentor, {
      studentId,
      mentorId,
    });
  }

  async verifyCompany(companyId: Id<"companies">, isVerified: boolean) {
    return await this.client.mutation(api.mutations.verifyCompany, {
      companyId,
      isVerified,
    });
  }

  async updateCompanyStatus(companyId: Id<"companies">, isActive: boolean) {
    return await this.client.mutation(api.mutations.updateCompanyStatus, {
      companyId,
      isActive,
    });
  }

  async createFaculty(data: {
    email: string;
    password: string;
    name: string;
    department: string;
    designation?: string;
    phone?: string;
    canMentor: boolean;
    collegeId: Id<"colleges">;
  }) {
    return await this.client.mutation(api.actions.createFaculty, data);
  }

  async updateFaculty(data: {
    facultyId: Id<"faculty">;
    name?: string;
    department?: string;
    designation?: string;
    phone?: string;
    canMentor?: boolean;
  }) {
    return await this.client.mutation(api.mutations.updateFaculty, data);
  }

  async createOpportunity(data: {
    title: string;
    description: string;
    location: string;
    type: string;
    duration?: string;
    stipend?: string;
    salary?: string;
    requirements?: string;
    skills?: string[];
    deadline: number;
    companyId: Id<"companies">;
  }) {
    return await this.client.mutation(api.mutations.createOpportunity, data);
  }

  async updateOpportunityStatus(opportunityId: Id<"opportunities">, status: string) {
    return await this.client.mutation(api.mutations.updateOpportunityStatus, {
      opportunityId,
      status,
    });
  }

  async createApplication(studentId: Id<"students">, opportunityId: Id<"opportunities">) {
    return await this.client.mutation(api.mutations.createApplication, {
      studentId,
      opportunityId,
    });
  }

  async updateApplicationStatus(data: {
    applicationId: Id<"applications">;
    status: string;
    mentorApproved?: boolean;
    adminApproved?: boolean;
    adminRemarks?: string;
    mentorRemarks?: string;
  }) {
    return await this.client.mutation(api.mutations.updateApplicationStatus, data);
  }

  async createInterview(data: {
    type: string;
    mode: string;
    scheduledAt: number;
    durationMin?: number;
    round: number;
    interviewerName?: string;
    interviewerEmail?: string;
    meetingLink?: string;
    location?: string;
    studentId: Id<"students">;
    companyId: Id<"companies">;
    applicationId: Id<"applications">;
  }) {
    return await this.client.mutation(api.mutations.createInterview, data);
  }

  async updateInterviewStatus(data: {
    interviewId: Id<"interviews">;
    status: string;
    feedback?: string;
    result?: string;
  }) {
    return await this.client.mutation(api.mutations.updateInterviewStatus, data);
  }

  async createInternship(data: {
    title: string;
    startDate: number;
    endDate: number;
    stipend?: string;
    mentorName?: string;
    mentorEmail?: string;
    mentorPhone?: string;
    workLocation?: string;
    workMode: string;
    description?: string;
    learningGoals?: string;
    studentId: Id<"students">;
    companyId: Id<"companies">;
    applicationId: Id<"applications">;
  }) {
    return await this.client.mutation(api.mutations.createInternship, data);
  }

  async createPlacement(data: {
    title: string;
    joiningDate?: number;
    salary: string;
    location: string;
    workMode: string;
    department?: string;
    reportingManager?: string;
    hrContact?: string;
    bond?: string;
    bondDurationMonths?: number;
    studentId: Id<"students">;
    companyId: Id<"companies">;
    applicationId: Id<"applications">;
  }) {
    return await this.client.mutation(api.mutations.createPlacement, data);
  }
}

export const convexService = new ConvexService();
