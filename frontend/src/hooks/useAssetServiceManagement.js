import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { showErrorToast } from "../utils/notification";
// --- Import constants ---
import {
  PAGINATION_PAGE_SIZE,
  DATE_DISPLAY_FORMAT,
  SERVICE_STATUS_OPTIONS,
  SERVICE_DETAIL_STATUS_OPTIONS,
} from "../constants/assetServiceConstants";

const useAssetServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredServices, setFilteredServices] = useState([]);

  // Use constants directly, no need for useMemo wrappers anymore for these arrays
  // const statusOptions = useMemo(
  //   () => [ ... ], []
  // );
  // const serviceStatusOptions = useMemo(
  //   () => [ ... ], []
  // );

  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message, error) => {
    console.error(message, error);
    const errorMsg = error.response?.data?.message || error.message || message;
    toast.error(errorMsg);
  }, []);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesResponse, assetsResponse] = await Promise.all([
        api.get("/service-api/get"),
        api.get("/asset-api/get"),
      ]);

      const reversedServices = [...servicesResponse.data].reverse();
      setServices(reversedServices);
      setFilteredServices(reversedServices);
      setAssets(assetsResponse.data);
    } catch (error) {
      showError("Failed to load data.", error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const searchValue = searchText.trim().toLowerCase();
    if (!searchValue) {
      setFilteredServices(services);
      setCurrentPage(1);
      return;
    }

    const filtered = services.filter((service) =>
      [
        "asset_link_id",
        "issue_description",
        "status",
        "service_status",
        "remark",
      ].some((key) =>
        String(service[key] || "")
          .toLowerCase()
          .includes(searchValue)
      )
    );

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchText, services]);

  useEffect(() => {
    const totalPages = Math.ceil(
      filteredServices.length / PAGINATION_PAGE_SIZE
    ); // Use constant
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredServices, currentPage]);

  const addService = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await api.post("/service-api/post", values);
        showSuccess(
          <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
            Service detail has been added successfully.
          </div>
        );
        await fetchInitialData();
        return true;
      } catch (error) {
        showError("Failed to add service detail.", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData, showSuccess, showError]
  );

  const updateService = useCallback(
    async (id, values) => {
      setLoading(true);
      try {
        await api.put(`/service-api/put/${id}`, values);
        showSuccess("Service detail updated successfully!");
        await fetchInitialData();
        return true;
      } catch (error) {
        showError("Failed to update service detail.", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData, showSuccess, showError]
  );

  const deleteService = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.delete(`/service-api/delete/${id}`);
        showSuccess("Service detail deleted successfully!");
        await fetchInitialData();
        return true;
      } catch (error) {
        console.error("Failed to delete:", error);
        showErrorToast("Failed to delete");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInitialData, showSuccess, showError]
  );

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_PAGE_SIZE; // Use constant
    return filteredServices.slice(start, start + PAGINATION_PAGE_SIZE); // Use constant
  }, [filteredServices, currentPage]);

  const getAvailableAssets = useMemo(() => {
    return assets.filter(
      (asset) =>
        !services.some((service) => service.asset_link_id === asset.assetID)
    );
  }, [assets, services]);

  const formatDate = useCallback((date) => {
    return date ? dayjs(date).format(DATE_DISPLAY_FORMAT) : "N/A"; // Use constant
  }, []);

  return {
    services,
    assets,
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    filteredServices,
    paginatedServices,
    getAvailableAssets,
    addService,
    updateService,
    deleteService,
    formatDate,
    statusOptions: SERVICE_STATUS_OPTIONS, // Pass constant directly
    serviceStatusOptions: SERVICE_DETAIL_STATUS_OPTIONS, // Pass constant directly
    PAGE_SIZE: PAGINATION_PAGE_SIZE, // Pass constant
    fetchServiceData: fetchInitialData,
  };
};

export default useAssetServiceManagement;
