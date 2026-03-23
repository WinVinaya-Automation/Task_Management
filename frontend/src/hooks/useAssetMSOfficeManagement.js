import { useState, useEffect, useMemo } from "react";
import { Form } from "antd"; // Import Form for useForm
import dayjs from "dayjs";
import api from "../services/api";
import { showErrorToast, showSuccessToast } from "../utils/notification"; // Corrected import
import {
  PAGE_SIZE,
  DATE_FORMAT,
  ALLOWED_ASSET_NAMES_FOR_MSOFFICE,
} from "../constants/assetMSOfficeConstants";

const useMSOfficeDetailsManagement = () => {
  const [officeDetails, setOfficeDetails] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDetails, setFilteredDetails] = useState([]);

  const [form] = Form.useForm(); // Get form instance here

  // --- Effects ---

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchText, officeDetails, assets]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredDetails.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredDetails.length, currentPage]);

  // --- Data Fetching & Filtering ---

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [officeResponse, assetsResponse] = await Promise.all([
        api.get("/office-api/get"),
        api.get("/asset-api/get"),
      ]);

      const reversedOfficeData = [...officeResponse.data].reverse();
      setOfficeDetails(reversedOfficeData);
      setAssets(assetsResponse.data);
      setFilteredDetails(reversedOfficeData);
    } catch (error) {
      showErrorToast(error, "Failed to load MS Office details or assets."); // Corrected call
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const lowerSearch = searchText.trim().toLowerCase();
    if (!lowerSearch) {
      setFilteredDetails(officeDetails);
      return;
    }

    const filtered = officeDetails.filter(
      (detail) =>
        String(detail.asset_link_id || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        (assets.find((a) => a.assetID === detail.asset_link_id)?.oldID || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        String(detail.ms_office_version || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        String(detail.licence_key || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        String(detail.main_user_name || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        String(detail.remark || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        detail.users_group?.some(
          (user) =>
            String(user?.user_asset_link_id || "")
              .toLowerCase()
              .includes(lowerSearch) ||
            String(user?.name || "")
              .toLowerCase()
              .includes(lowerSearch)
        )
    );
    setFilteredDetails(filtered);
  };

  // --- Pagination Logic ---

  const getPaginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDetails.slice(start, start + PAGE_SIZE);
  }, [filteredDetails, currentPage]);

  // --- Modal Management ---

  const openModal = (detail = null) => {
    setEditingDetail(detail);
    if (detail) {
      form.setFieldsValue({
        ...detail,
        users_group: detail.users_group || [],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        users_group: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDetail(null);
    form.resetFields();
  };

  // --- Form Handlers ---

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const cleanedUsersGroup = values.users_group?.filter(
        (user) => user?.user_asset_link_id && user?.name?.trim()
      );

      const cleanedValues = {
        ...values,
        users_group: cleanedUsersGroup || [],
      };

      const selectedMainAssetId = cleanedValues.asset_link_id;
      const usersGroupAssetIdsInCurrentForm = new Set(
        cleanedValues.users_group
          .map((u) => u?.user_asset_link_id)
          .filter(Boolean)
      );

      // --- Pre-submission Validation: Global Uniqueness ---
      const globallyUsedAssetIdsExcludingCurrentEdit = new Set();
      officeDetails.forEach((detail) => {
        if (!editingDetail || detail.id !== editingDetail.id) {
          if (detail.asset_link_id) {
            globallyUsedAssetIdsExcludingCurrentEdit.add(detail.asset_link_id);
          }
          detail.users_group?.forEach((user) => {
            if (user?.user_asset_link_id) {
              globallyUsedAssetIdsExcludingCurrentEdit.add(
                user.user_asset_link_id
              );
            }
          });
        }
      });

      if (globallyUsedAssetIdsExcludingCurrentEdit.has(selectedMainAssetId)) {
        showErrorToast(
          // Corrected call
          null,
          "The selected Main Asset Link ID is already in use by another MS Office detail (either as a Main Asset or linked to a user in a User Group). Please choose a unique Asset Link ID."
        );
        setLoading(false);
        return;
      }

      for (const userAssetId of usersGroupAssetIdsInCurrentForm) {
        if (userAssetId === selectedMainAssetId) {
          showErrorToast(
            // Corrected call
            null,
            "A User's Asset Link ID cannot be the same as the Main Asset Link ID for the current MS Office detail. Please ensure uniqueness within this detail."
          );
          setLoading(false);
          return;
        }
        if (globallyUsedAssetIdsExcludingCurrentEdit.has(userAssetId)) {
          showErrorToast(
            // Corrected call
            null,
            `User Asset Link ID '${userAssetId}' is already in use by another MS Office detail. Please choose a unique Asset Link ID for users.`
          );
          setLoading(false);
          return;
        }
      }

      if (
        usersGroupAssetIdsInCurrentForm.size !==
        cleanedValues.users_group.length
      ) {
        showErrorToast(
          // Corrected call
          null,
          "Duplicate Asset Link IDs found within the User Group. Each user must have a unique Asset Link ID."
        );
        setLoading(false);
        return;
      }

      // --- End Pre-submission Validation ---

      if (editingDetail) {
        await api.put(`/office-api/put/${editingDetail.id}`, cleanedValues);
        showSuccessToast("MS Office detail updated successfully!"); // Corrected call
      } else {
        await api.post("/office-api/post", cleanedValues);
        showSuccessToast("MS Office detail created successfully!"); // Corrected call
      }

      closeModal();
      await fetchInitialData();
    } catch (error) {
      if (error.errorFields) {
        console.log("Form validation failed:", error.errorFields);
        showErrorToast(null, "Please fill in all required fields correctly."); // Corrected call
      } else {
        showErrorToast(error, "Form submission failed."); // Corrected call
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Operations ---

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/office-api/delete/${id}`);
      showSuccessToast("MS Office detail deleted successfully!"); // Corrected call
      await fetchInitialData();
    } catch (error) {
      console.error("Failed to delete:", error);
      showErrorToast("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  const formatDate = (date) => {
    return date ? dayjs(date).format(DATE_FORMAT) : "-";
  };

  // Memoized list of allowed asset types (Laptop/Desktop)
  const filteredAssetsByType = useMemo(() => {
    return assets.filter(
      (asset) =>
        asset.name &&
        ALLOWED_ASSET_NAMES_FOR_MSOFFICE.includes(asset.name.toLowerCase())
    );
  }, [assets]);

  const getGloballyReservedAssetIds = useMemo(() => {
    const reservedIds = new Set();
    officeDetails.forEach((detail) => {
      if (editingDetail && detail.id === editingDetail.id) {
        return;
      }

      if (detail.asset_link_id) {
        reservedIds.add(detail.asset_link_id);
      }
      detail.users_group?.forEach((user) => {
        if (user?.user_asset_link_id) {
          reservedIds.add(user.user_asset_link_id);
        }
      });
    });
    return reservedIds;
  }, [officeDetails, editingDetail]);

  const getAvailableAssetsForMainLink = useMemo(() => {
    // Read current form values using `form.getFieldValue` within useMemo for reactivity
    const currentFormUsersGroup = form.getFieldValue("users_group") || [];
    const currentFormUserAssetIds = new Set(
      currentFormUsersGroup
        .map((user) => user?.user_asset_link_id)
        .filter(Boolean)
    );

    const filteredOptions = filteredAssetsByType.filter((asset) => {
      if (getGloballyReservedAssetIds.has(asset.assetID)) {
        return false;
      }
      if (currentFormUserAssetIds.has(asset.assetID)) {
        return false;
      }
      return true;
    });

    if (editingDetail && editingDetail.asset_link_id) {
      const currentMainAssetId = editingDetail.asset_link_id;
      const isCurrentMainAssetAvailable = filteredOptions.some(
        (a) => a.assetID === currentMainAssetId
      );
      if (!isCurrentMainAssetAvailable) {
        const asset = filteredAssetsByType.find(
          (a) => a.assetID === currentMainAssetId
        );
        if (asset) {
          filteredOptions.push(asset);
        }
      }
    }
    return filteredOptions.sort((a, b) =>
      (a.assetID || "").localeCompare(b.assetID || "")
    );
  }, [
    filteredAssetsByType,
    getGloballyReservedAssetIds,
    form, // Depend on form instance to re-evaluate when form values change
    editingDetail,
  ]);

  const getAvailableAssetsForUserLink = useMemo(() => {
    return (indexBeingEdited) => {
      // Read current form values using `form.getFieldValue` within useMemo for reactivity
      const currentMainAssetId = form.getFieldValue("asset_link_id");
      const currentFormAllUsers = form.getFieldValue("users_group") || [];

      const otherUsersInFormAssetIds = new Set();
      currentFormAllUsers.forEach((user, i) => {
        if (i !== indexBeingEdited && user?.user_asset_link_id) {
          otherUsersInFormAssetIds.add(user.user_asset_link_id);
        }
      });

      const options = filteredAssetsByType.filter((asset) => {
        if (getGloballyReservedAssetIds.has(asset.assetID)) {
          return false;
        }
        if (asset.assetID === currentMainAssetId) {
          return false;
        }
        if (otherUsersInFormAssetIds.has(asset.assetID)) {
          return false;
        }

        const currentUserAssetId = form.getFieldValue([
          "users_group",
          indexBeingEdited,
          "user_asset_link_id",
        ]);
        if (asset.assetID === currentUserAssetId) {
          return true;
        }
        return true;
      });

      return options.sort((a, b) =>
        (a.assetID || "").localeCompare(b.assetID || "")
      );
    };
  }, [
    filteredAssetsByType,
    getGloballyReservedAssetIds,
    form, // Depend on form instance to re-evaluate when form values change
  ]);

  return {
    officeDetails,
    assets,
    loading,
    isModalOpen,
    editingDetail,
    searchText,
    currentPage,
    filteredDetails,
    form, // Expose form instance
    setSearchText,
    setCurrentPage,
    getPaginatedData,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    formatDate,
    getAvailableAssetsForMainLink,
    getAvailableAssetsForUserLink,
    fetchMSOfficeDetails: fetchInitialData,
  };
};

export default useMSOfficeDetailsManagement;
