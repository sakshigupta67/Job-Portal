import { createContext, useCallback, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

// Single source of truth for the API base URL — set VITE_BACKEND_URL in client/.env
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AppContextProvider = (props) => {
  // ─── Search / filter state ───────────────────────────────────────────────
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);

  // ─── Public jobs list ────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);

  // ─── Recruiter (company) auth state ─────────────────────────────────────
  const [companyToken, setCompanyToken] = useState(
    () => localStorage.getItem("companyToken") || null
  );
  const [companyData, setCompanyData] = useState(null);

  // ─── Recruiter login modal ───────────────────────────────────────────────
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // ─── Fetch public jobs list ──────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs`);
      const data = await response.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setJobs(data.jobs);
        return;
      }
    } catch (error) {
      console.error("Failed to load jobs from API, falling back to sample data", error);
    }
    setJobs(jobsData);
  }, []);

  // ─── Fetch logged-in company profile ────────────────────────────────────
  const fetchCompanyData = useCallback(async () => {
    if (!companyToken) {
      setCompanyData(null);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/company/me`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });
      const data = await response.json();
      if (data.success) {
        setCompanyData(data.company);
      } else {
        // Token is invalid / expired — clear it
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch company data", error);
    }
  }, [companyToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Login helper (called from RecruiterLogin after successful auth) ─────
  const loginCompany = (token, company) => {
    localStorage.setItem("companyToken", token);
    setCompanyToken(token);
    setCompanyData(company);
  };

  // ─── Logout helper ───────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("companyToken");
    setCompanyToken(null);
    setCompanyData(null);
  };

  // ─── Refresh jobs (used after posting a new job) ─────────────────────────
  const refreshJobs = async () => {
    await fetchJobs();
  };

  // ─── Bootstrap ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const value = {
    // search
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    // jobs
    jobs,
    setJobs,
    refreshJobs,
    // recruiter modal
    showRecruiterLogin,
    setShowRecruiterLogin,
    // company auth
    companyToken,
    companyData,
    loginCompany,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
