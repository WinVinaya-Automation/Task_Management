import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api"; // Assuming this path is correct for your API service
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { showErrorToast } from "../utils/notification";
const PAGE_SIZE = 10;
const DATE_FORMAT = "DD-MMM-YYYY";

const useAssetLaptopConfigManagement = () => {
  const [laptops, setLaptops] = useState([]); // Raw data from API
  const [assets, setAssets] = useState([]); // List of available assets
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [searchText, setSearchText] = useState(""); // Search input value
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filteredLaptops, setFilteredLaptops] = useState([]); // Data after search filtering

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

  // Fetches laptop configurations and all available assets concurrently
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [laptopsResponse, assetsResponse] = await Promise.all([
        api.get("/laptop-api/get"),
        api.get("/asset-api/get"),
      ]);

      // Reverse data for most recent first, and set filtered data initially
      const reversedData = [...laptopsResponse.data].reverse();
      setLaptops(reversedData);
      setFilteredLaptops(reversedData); // Initialize filtered data with all laptops
      setAssets(assetsResponse.data);
    } catch (error) {
      showError("Failed to load laptop configurations", error);
    } finally {
      setLoading(false);
    }
  }, [showError]); // Re-create if showError changes (unlikely, but good practice)

  // Effect to fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]); // Dependency array includes fetchInitialData

  // Effect to filter data whenever searchText or raw laptops data changes
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredLaptops(laptops); // If search is empty, show all data
      return;
    }

    const lowerSearch = searchText.trim().toLowerCase();
    const filtered = laptops.filter(
      (laptop) =>
        // Check all string values in the item for a match
        Object.values(laptop).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(lowerSearch)
        ) ||
        // Also search by asset oldID if it exists for the linked asset
        (laptop.asset_link_id &&
          assets.some(
            (asset) =>
              asset.assetID === laptop.asset_link_id &&
              asset.oldID &&
              String(asset.oldID).toLowerCase().includes(lowerSearch)
          ))
    );
    setFilteredLaptops(filtered);
  }, [searchText, laptops, assets]); // Dependencies: searchText, laptops, assets

  // Effect to adjust current page if filtered data changes (e.g., search reduces total items)
  useEffect(() => {
    const totalPages = Math.ceil(filteredLaptops.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredLaptops, currentPage]); // Dependencies: filteredLaptops, currentPage

  // --- CRUD Operations ---

  // Handles adding a new laptop configuration
  const addLaptop = useCallback(
    async (values) => {
      setLoading(true);
      try {
        // Perform custom validation for asset_link_id uniqueness for new entry
        const isConflict = laptops.some(
          (item) => item.asset_link_id === values.asset_link_id
        );
        if (isConflict) {
          toast.error(
            "This asset is already linked to a laptop configuration."
          );
          setLoading(false);
          return false; // Indicate failure
        }
        await api.post("/laptop-api/post", values);
        showSuccess("Laptop configuration created successfully!");
        await fetchInitialData(); // Refresh data in table
        return true; // Indicate success
      } catch (error) {
        if (error.errorFields) {
          // Ant Design form validation errors
          toast.error("Please fill in all required fields correctly.");
        } else {
          showError("Failed to add configuration", error);
        }
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [laptops, fetchInitialData, showSuccess, showError]
  );

  // Handles updating an existing laptop configuration
  const updateLaptop = useCallback(
    async (id, values) => {
      setLoading(true);
      try {
        await api.put(`/laptop-api/put/${id}`, values);
        showSuccess("Laptop configuration updated successfully!");
        await fetchInitialData(); // Refresh data in table
        return true; // Indicate success
      } catch (error) {
        if (error.errorFields) {
          // Ant Design form validation errors
          toast.error("Please fill in all required fields correctly.");
        } else {
          showError("Failed to update configuration", error);
        }
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData, showSuccess, showError]
  );

  // Handles deletion of a laptop configuration
  const deleteLaptop = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.delete(`/laptop-api/delete/${id}`);
        showSuccess("Laptop configuration deleted successfully!");
        await fetchInitialData(); // Refresh data
        return true; // Indicate success
      } catch (error) {
        console.error("Failed to delete:", error);
        showErrorToast("Failed to delete");
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData, showSuccess, showError]
  );

  // Memoized function to get data for the current page
  const paginatedLaptops = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLaptops.slice(start, start + PAGE_SIZE);
  }, [filteredLaptops, currentPage]);

  // Memoized list of available assets for the form dropdown
  const getAvailableAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Only include 'Laptop' or 'Desktop' assets
      if (!["Laptop", "Desktop"].includes(asset.name)) {
        return false;
      }
      // Otherwise, only show assets that are not currently linked to any laptop config
      return !laptops.some((laptop) => laptop.asset_link_id === asset.assetID);
    });
  }, [assets, laptops]);

  // Formats a date string for display
  const formatDate = useCallback((date) => {
    return date ? dayjs(date).format(DATE_FORMAT) : "-";
  }, []);

  return {
    laptops, // Raw data (used for form validation in LaptopDescriptionForm)
    assets, // All assets (used for displaying asset details in table)
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    filteredLaptops, // Filtered data (for pagination total)
    paginatedLaptops, // Data for current table page
    getAvailableAssets, // Assets available for selection in form (filtered)
    addLaptop,
    updateLaptop,
    deleteLaptop,
    formatDate,
    PAGE_SIZE,
    fetchLaptopConfigs: fetchInitialData,
  };
};

export default useAssetLaptopConfigManagement;
