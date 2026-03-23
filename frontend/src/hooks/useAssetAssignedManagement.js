// src/hooks/useAssetAssignedManagement.js
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api"; // Adjust path as per your actual file structure
import { showSuccessToast, showErrorToast } from "../utils/notification";
// import dayjs from "dayjs";
import { PAGE_SIZE, ROLE_CONFIG } from "../constants/assetAssignedConstants";

const useAssetAssignedManagement = () => {
  const [data, setData] = useState([]); // Raw data from API
  const [assets, setAssets] = useState([]); // List of available assets (from /asset-api/get)
  const [filteredData, setFilteredData] = useState([]); // Data after search filtering
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [editingRecord, setEditingRecord] = useState(null); // Record being edited (null for new)
  const [searchText, setSearchText] = useState(""); // Search input value
  const [role, setRole] = useState(""); // Stores the currently selected role in the form (lowercase for consistent logic)
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // --- Data Fetching & Filtering ---

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [assignedResponse, assetsResponse] = await Promise.all([
        api.get("/assigned-api/get"),
        api.get("/asset-api/get"),
      ]);

      const reversedAssignedData = [...assignedResponse.data].reverse();
      setData(reversedAssignedData);
      setFilteredData(reversedAssignedData); // Initialize filtered data

      setAssets(assetsResponse.data);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      showErrorToast("Failed to load initial data!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Filter data whenever searchText or `data` changes
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(data); // If search is empty, show all data
      return;
    }

    const lowerSearch = searchText.trim().toLowerCase();
    const filtered = data.filter(
      (item) =>
        Object.values(item).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(lowerSearch)
        ) ||
        (item.asset_link_id &&
          assets.some(
            (asset) =>
              asset.assetID === item.asset_link_id &&
              asset.oldID &&
              String(asset.oldID).toLowerCase().includes(lowerSearch)
          ))
    );
    setFilteredData(filtered);
  }, [searchText, data, assets]); // Include 'assets' in dependency array for asset.oldID search

  // Adjusts current page if filtered data changes
  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredData, currentPage]);

  // --- Pagination Logic ---
  const getPaginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  // --- Modal Management ---

  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    // Role will be set by the form's initial values or handleRoleChange
    if (record) {
      setRole(record.role?.toLowerCase() || "");
    } else {
      setRole(""); // Reset role for new entry
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setRole(""); // Reset role state when closing modal
  };

  // --- Form Handlers & CRUD ---

  const handleRoleChange = useCallback((value, formInstance) => {
    const newRole = value.toLowerCase();
    setRole(newRole); // Update the role state immediately

    // Clear ALL conditional fields unconditionally.
    formInstance.setFieldsValue({
      assigned_to: undefined,
      student_name: undefined,
      batch_name: undefined,
      dateRange: null, // For RangePicker, null clears it
    });

    // Force validation on all potentially conditional fields.
    formInstance
      .validateFields(
        ["assigned_to", "student_name", "batch_name", "dateRange"],
        { force: true }
      )
      .catch(() => {});
  }, []);

  const handleSubmit = useCallback(
    async (values, formInstance) => {
      try {
        // Validate all fields based on their Ant Design rules
        await formInstance.validateFields();

        // Perform custom validation checks (e.g., unique asset)
        const validationError = validateAssignment(values);
        if (validationError) {
          showErrorToast(validationError);
          return false; // Indicate failure
        }

        setLoading(true);
        const payload = preparePayload(values); // Prepare data for API

        if (editingRecord) {
          // Update existing record
          await api.put(`/assigned-api/put/${editingRecord.id}`, payload);
          showSuccessToast("Asset updated successfully");
        } else {
          // Create new record
          await api.post("/assigned-api/post", payload);
          showSuccessToast("Asset assigned successfully");
        }

        closeModal(); // Close modal on success
        await fetchInitialData(); // Refresh data in table
        return true; // Indicate success
      } catch (error) {
        if (error.errorFields) {
          console.log("Form validation failed:", error.errorFields);
          showErrorToast("Please fill in all required fields correctly.");
        } else {
          console.error("Form submission failed:", error);
          showErrorToast(
            error.response?.data?.message ||
              error.message ||
              "Form submission failed."
          );
        }
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [editingRecord, data, fetchInitialData] // Added 'data' to dependencies for validateAssignment
  );

  const validateAssignment = useCallback(
    (values) => {
      // Check for asset link ID conflict (assuming asset_link_id should be unique across assignments)
      const isConflict = data.some(
        (item) =>
          item.asset_link_id === values.asset_link_id &&
          (!editingRecord || item.id !== editingRecord.id) // Exclude the current record if editing
      );

      if (isConflict) {
        return "This asset is already assigned to someone else.";
      }
      return null; // No custom validation errors
    },
    [data, editingRecord]
  );

  const preparePayload = useCallback((values) => {
    const { dateRange, role: formRole, ...restOfValues } = values;

    const [startDate, endDate] = dateRange || [];
    const currentRoleConfig = ROLE_CONFIG[formRole.toLowerCase()] || {};

    return {
      ...restOfValues,
      role: formRole, // Keep the original capitalized role for backend
      assigned_to: currentRoleConfig.showAssignedTo ? values.assigned_to : null,
      student_name: currentRoleConfig.showStudentName
        ? values.student_name
        : null,
      batch_name: currentRoleConfig.showBatchName ? values.batch_name : null,
      batch_start_date:
        currentRoleConfig.showBatchDates && startDate
          ? startDate.format("YYYY-MM-DD")
          : null,
      batch_end_date:
        currentRoleConfig.showBatchDates && endDate
          ? endDate.format("YYYY-MM-DD")
          : null,
    };
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await api.delete(`/assigned-api/delete/${id}`);
        showSuccessToast("Deleted successfully");
        await fetchInitialData(); // Refresh data
      } catch (error) {
        console.error("Failed to delete:", error);
        showErrorToast("Failed to delete");
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData]
  );

  const getAvailableAssets = useCallback(() => {
    return assets.filter((asset) => {
      if (editingRecord && editingRecord.asset_link_id === asset.assetID) {
        return true;
      }
      return !data.some((assigned) => assigned.asset_link_id === asset.assetID);
    });
  }, [assets, data, editingRecord]);

  return {
    data: getPaginatedData,
    totalCount: filteredData.length,
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    isModalOpen,
    editingRecord,
    role,
    setRole, // Expose setRole for initial form setup
    openModal,
    closeModal,
    handleRoleChange,
    handleSubmit,
    handleDelete,
    getAvailableAssets,
    assets, // Also expose full assets list if needed for column rendering
    fetchAssignedAssets: fetchInitialData,
  };
};

export default useAssetAssignedManagement;
