import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function useCompanies(queryparam: any) {
  const companies = useQuery(api.queries.getCompanies, queryparam) || [];
  return companies;
}

// ✅ Updated to accept collegeId
export function useStudents(params: any) {
  const student = useQuery(api.queries.getStudents, {
    ...params,
    collegeId: params.collegeId // ✅ Pass collegeId
  });
  const createStudentAction = useAction(api.actions.createStudent);
  const updateStudentStatusAction = useAction(api.actions.updateStudentStatus);
  
  return {
    student,
    createStudentAction,
    updateStudentStatusAction,
  };
}

// ✅ Faculty Hook
export function useFaculty(queryparam: any) {
  // If facultyId is provided, get single faculty with mentees
  if (queryparam.facultyId) {
    const faculty = useQuery(api.queries.getFacultyById, { facultyId: queryparam.facultyId });
    return faculty;
  }
  
  // Otherwise get faculty list
  const faculty = useQuery(api.queries.getFaculty, {
    ...queryparam,
    collegeId: queryparam.collegeId // ✅ Pass collegeId to query
  }) || [];
  return faculty;
}

// ✅ Faculty Management Hook
export function useFacultyManagement() {
  const createFacultyAction = useAction(api.actions.createFaculty);
  const updateFaculty = useMutation(api.mutations.updateFaculty);
  const toggleFacultyStatus = useMutation(api.mutations.updateFacultyUserStatus);
  
  return {
    createFacultyAction,
    updateFaculty,
    toggleFacultyStatus,
  };
}

// ✅ New hook for mentor assignment operations
export function useMentorAssignment(queryparam: { facultyId?: string; collegeId?: string }) {
  const assignMentor = useMutation(api.mutations.assignMentor);

  // Only fetch faculty when we have an id; don't fetch unassigned students here
  const getFacultyById = useQuery(
    api.queries.getFacultyById,
    queryparam.facultyId ? { facultyId: queryparam.facultyId as any } : "skip"
  );

  return {
    assignMentor,
    getFacultyById,
  };
}

// ✅ Enhanced Admin Hook
export function useAdmin() {
  const updateStudentStatusAction = useAction(api.actions.updateStudentStatus);
  const updateFacultyStatusAction = useAction(api.actions.updateFacultyStatus);
  const assignMentor = useMutation(api.mutations.assignMentor);
  const verifyCompany = useMutation(api.mutations.verifyCompany);
  const updateCompanyStatus = useMutation(api.mutations.updateCompanyStatus);

  return {
    updateStudentStatusAction,
    updateFacultyStatusAction, // ✅ Add faculty status update
    assignMentor,
    verifyCompany,
    updateCompanyStatus,
  };
}

