import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api"; // Assuming this path is correct
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  PAGINATION_PAGE_SIZE,
  DATE_DISPLAY_FORMAT,
  DONOR_STATUS_OPTIONS,
} from "../constants/assetWVFDonorConstants";
import { showErrorToast } from "../utils/notification";

const useWVFDonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState({}); // State for toggling password visibility
  const [filteredDonors, setFilteredDonors] = useState([]); // Filtered data for search

  // Memoized options from constants
  const statusOptions = DONOR_STATUS_OPTIONS;

  // Helper for displaying success toast notifications
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  // Helper for displaying error toast notifications and logging
  const showError = useCallback((message, error) => {
    console.error(message, error);
    const errorMsg = error.response?.data?.message || error.message || message;
    toast.error(errorMsg);
  }, []);

  // Fetches donor details and all assets concurrently
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [donorsResponse, assetsResponse] = await Promise.all([
        api.get("/wvf-donor-api/get"),
        api.get("/asset-api/get"),
      ]);
      // Sort by created_on descending as per original code
      const sortedData = donorsResponse.data.sort(
        (a, b) => new Date(b.created_on) - new Date(a.created_on)
      );
      setDonors(sortedData);
      setFilteredDonors(sortedData); // Initialize filtered data
      setAssets(assetsResponse.data);
    } catch (err) {
      showError("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Effect to fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect to filter data whenever searchText or raw donors data changes
  useEffect(() => {
    const searchValue = searchText.trim().toLowerCase();
    if (!searchValue) {
      setFilteredDonors(donors);
      setCurrentPage(1); // Reset to first page on clear search
      return;
    }

    const filtered = donors.filter((donor) =>
      [
        "asset_link_id",
        "receiver_name",
        "new_user_id",
        "status",
        "remark",
      ].some((key) =>
        String(donor[key] || "")
          .toLowerCase()
          .includes(searchValue)
      )
    );

    setFilteredDonors(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchText, donors]);

  // Effect to adjust current page if filtered data changes
  useEffect(() => {
    const totalPages = Math.ceil(filteredDonors.length / PAGINATION_PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredDonors, currentPage]);

  // --- CRUD Operations ---

  // Handles adding a new donor
  const addDonor = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await api.post("/wvf-donor-api/post", values);
        showSuccess("Donor added successfully!");
        await fetchData(); // Refresh data
        return true; // Indicate success
      } catch (error) {
        showError("Failed to add donor.", error);
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchData, showSuccess, showError]
  );

  // Handles updating an existing donor
  const updateDonor = useCallback(
    async (id, values) => {
      setLoading(true);
      try {
        await api.put(`/wvf-donor-api/put/${id}`, values);
        showSuccess("Donor updated successfully!");
        await fetchData(); // Refresh data
        return true; // Indicate success
      } catch (error) {
        showError("Failed to update donor.", error);
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchData, showSuccess, showError]
  );

  // Handles deletion of a donor
  const deleteDonor = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.delete(`/wvf-donor-api/delete/${id}`);
        showSuccess("Donor deleted successfully!");
        await fetchData(); // Refresh data
        return true; // Indicate success
      } catch (error) {
        console.error("Failed to delete:", error);
        showErrorToast("Failed to delete");
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchData, showSuccess, showError]
  );

  // Toggles password visibility for a specific donor
  const togglePasswordVisibility = useCallback((id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Memoized data for the current table page
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_PAGE_SIZE;
    return filteredDonors.slice(start, start + PAGINATION_PAGE_SIZE);
  }, [filteredDonors, currentPage]);

  // Memoized list of available assets for the form dropdown
  const getAvailableAssets = useMemo(
    () =>
      assets.filter(
        (asset) =>
          !donors.some((donor) => donor.asset_link_id === asset.assetID)
      ),
    [assets, donors]
  );

  // Formats a date string for display
  const formatDate = useCallback((date) => {
    return dayjs(date).format(DATE_DISPLAY_FORMAT);
  }, []);

  return {
    donors, // All donors (for form validation if needed)
    assets, // All assets (for form/table display)
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    showPassword,
    filteredDonors, // For pagination total
    paginatedDonors, // Data for current table page
    getAvailableAssets, // Assets available for selection in form
    addDonor,
    updateDonor,
    deleteDonor,
    togglePasswordVisibility,
    formatDate,
    statusOptions, // Directly using the constant
    PAGE_SIZE: PAGINATION_PAGE_SIZE,
    fetchDonorData: fetchData,
  };
};

export default useWVFDonorManagement;
