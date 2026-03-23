// src/hooks/useAssetDonorManagement.js
import { useState, useEffect, useRef, useMemo } from "react";
import { Form } from "antd"; // Ant Design Form instance needs to come from here
import dayjs from "dayjs";
import api from "../services/api"; // Ensure this path is correct for your API service
import { showSuccessToast, showErrorToast } from "../utils/notification"; // Use your consolidated notification utility
import { PAGE_SIZE, DATE_FORMAT } from "../constants/assetDonorConstants"; // Import constants

const useAssetDonorManagement = () => {
  // State variables
  const [donors, setDonors] = useState([]); // Raw data from API
  const [assets, setAssets] = useState([]); // List of all assets
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [editingDonor, setEditingDonor] = useState(null); // Donor being edited (null for new)
  const [searchText, setSearchText] = useState(""); // Search input value
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filteredData, setFilteredData] = useState([]); // Data after search filtering

  // Ant Design Form instance
  const [form] = Form.useForm();
  // Ref for modal focus (accessibility)
  const modalRef = useRef(null);

  // --- Effects ---

  // Fetches initial data (donors and all assets) on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filters data whenever searchText or donors changes
  useEffect(() => {
    filterData();
  }, [searchText, donors]);

  // Adjusts current page if filtered data changes (e.g., search reduces total items)
  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredData, currentPage]);

  // Focuses the modal when it opens for accessibility
  useEffect(() => {
    // This effect should ideally be managed within the Modal component itself,
    // but if the ref is passed down, this is how you'd use it here.
    // For now, we'll keep it as is, but consider moving it to DonorDetailsFormModal.js if possible.
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  // --- Data Fetching & Filtering ---

  // Fetches donor details and all assets concurrently
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [donorsResponse, assetsResponse] = await Promise.all([
        api.get("/donor-api/get"),
        api.get("/asset-api/get"),
      ]);

      // Reverse data for most recent first, and set filtered data initially
      const reversedDonors = [...donorsResponse.data].reverse();
      setDonors(reversedDonors);
      setFilteredData(reversedDonors); // Initialize filtered data with all donors
      setAssets(assetsResponse.data);
    } catch (error) {
      showErrorToast("Failed to load initial data"); // Use utility function
      console.error("Failed to load initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filters the `donors` data based on the `searchText`
  const filterData = () => {
    if (!searchText.trim()) {
      setFilteredData(donors); // If search is empty, show all data
      return;
    }

    const lowerSearch = searchText.trim().toLowerCase();
    const filtered = donors.filter(
      (donor) =>
        // Check all string values in the donor for a match
        Object.values(donor).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(lowerSearch)
        ) ||
        // Also search by asset oldID if it exists for the linked asset
        (donor.asset_link_id &&
          assets.some(
            (asset) =>
              asset.assetID === donor.asset_link_id &&
              asset.oldID &&
              String(asset.oldID).toLowerCase().includes(lowerSearch)
          ))
    );
    setFilteredData(filtered);
  };

  // --- Pagination Logic ---

  // Memoized function to get data for the current page
  const getPaginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  // --- Modal Management ---

  // Opens the modal, sets the editing donor, and initializes the form
  const openModal = (donor = null) => {
    setEditingDonor(donor);
    initializeForm(donor);
    setIsModalOpen(true);
  };

  // Initializes the form fields based on the record or resets them
  const initializeForm = (donor) => {
    if (donor) {
      form.setFieldsValue(donor);
    } else {
      form.resetFields(); // Clear all fields for new donor
    }
  };

  // Closes the modal and resets states
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDonor(null);
    form.resetFields();
  };

  // --- Form Handlers ---

  // Handles the submission of the form (add/edit)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingDonor) {
        await api.put(`/donor-api/put/${editingDonor.id}`, values);
        showSuccessToast("Donor updated successfully!"); // Use utility function
      } else {
        // Check for asset_link_id uniqueness on add
        const isConflict = donors.some(
          (d) => d.asset_link_id === values.asset_link_id
        );
        if (isConflict) {
          showErrorToast("This asset is already linked to another donor."); // Use utility function
          setLoading(false);
          return;
        }
        await api.post("/donor-api/post", values);
        showSuccessToast("Donor added successfully!"); // Use utility function
      }

      closeModal(); // Close modal on success
      await fetchInitialData(); // Refresh data in table
    } catch (error) {
      if (error.errorFields) {
        console.log("Form validation failed:", error.errorFields);
        showErrorToast("Please fill in all required fields correctly."); // Use utility function
      } else {
        showErrorToast("Form submission failed"); // Use utility function
        console.error("Form submission failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Operations ---

  // Handles deletion of a donor
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/donor-api/delete/${id}`);
      showSuccessToast("Donor deleted successfully"); // Use utility function
      await fetchInitialData(); // Refresh data
    } catch (error) {
      console.error("Failed to delete:", error);
      showErrorToast("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  // Formats a date string for display
  const formatDate = (date) => {
    return date ? dayjs(date).format(DATE_FORMAT) : "-";
  };

  // Filters assets to show only those that are not currently linked to a donor
  // (or the one currently being edited)
  const getAvailableAssets = () => {
    return assets.filter((asset) => {
      // If we are editing a record, its currently linked asset should be available for selection
      if (editingDonor && editingDonor.asset_link_id === asset.assetID) {
        return true;
      }
      // Otherwise, only show assets that are not currently linked to any donor
      return !donors.some((donor) => donor.asset_link_id === asset.assetID);
    });
  };

  return {
    donors,
    assets,
    loading,
    isModalOpen,
    editingDonor,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    filteredData,
    form,
    modalRef, // Expose ref
    getPaginatedData,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    formatDate,
    getAvailableAssets,
    fetchDonorDetails: fetchInitialData,
  };
};

export default useAssetDonorManagement;
