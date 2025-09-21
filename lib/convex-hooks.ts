import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";



// Admin hooks
export function useAdminAnalytics() {
  const getStudentStats = useQuery(api.queries.getStudentStats);
  const getCompanyStats = useQuery(api.queries.getCompanyStats);
  const getPlacementStats = useQuery(api.queries.getPlacementStats);

  return {
    getStudentStats,
    getCompanyStats,
    getPlacementStats,
  };
}
export function useAdmin() {
  const updateStudentStatus = useMutation(api.mutations.updateStudentStatus);
  const assignMentor = useMutation(api.mutations.assignMentor);
  const verifyCompany = useMutation(api.mutations.verifyCompany);
  const updateCompanyStatus = useMutation(api.mutations.updateCompanyStatus);
  const createFaculty = useAction(api.actions.createFaculty);
  const updateFaculty = useMutation(api.mutations.updateFaculty);

  return {
    updateStudentStatus,
    assignMentor,
    verifyCompany,
    updateCompanyStatus,
    createFaculty,
    updateFaculty,
  };
}

