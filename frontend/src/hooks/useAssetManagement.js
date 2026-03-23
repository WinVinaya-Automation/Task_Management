// src/hooks/useAssetManagement.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Adjust path if needed
import { showSuccessToast, showErrorToast } from "../utils/notification";
import dayjs from "dayjs";
import { DEFAULT_PAGE_SIZE } from "../constants/assetConstants"; // Or commonConstants

const useAssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAsset, setSearchAsset] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE; // Using constant

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/asset-api/get");
      const reversedAssets = [...response.data].reverse();
      setAssets(reversedAssets);
      setFilteredAssets(reversedAssets);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      showErrorToast("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const searchText = searchAsset.trim().toLowerCase();
    if (!searchText) {
      setFilteredAssets(assets);
      setCurrentPage(1);
      return;
    }

    const filtered = assets.filter((asset) =>
      [
        "assetID",
        "oldID",
        "name",
        "brandname",
        "status",
        "location",
        "description",
      ].some((key) => asset[key]?.toLowerCase().includes(searchText))
    );

    setFilteredAssets(filtered);
    setCurrentPage(1);
  }, [searchAsset, assets]);

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/asset-api/delete/${id}`);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      showSuccessToast("Asset deleted successfully!");
    } catch (error) {
      console.error("Failed to delete asset:", error);
      showErrorToast("Failed to delete asset");
    }
  }, []);

  const handleSaveAsset = useCallback(
    async (values, editingAsset) => {
      setLoading(true);
      try {
        const formatted = {
          ...values,
          purchase_date: values.purchase_date
            ? dayjs(values.purchase_date).format("YYYY-MM-DD")
            : null,
        };

        if (editingAsset) {
          await api.put(`/asset-api/put/${editingAsset.assetID}`, formatted);
          showSuccessToast("Asset updated successfully!");
        } else {
          const response = await api.post("/asset-api/post", formatted);
          const newAssetID = response.data?.assetID || "Unknown";
          showSuccessToast(
            <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
              Asset has been added successfully. The Asset ID is{" "}
              <b>{newAssetID}</b>
            </div>,
            {
              style: {
                minWidth: "300px",
                maxWidth: "600px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              },
            }
          );
        }
        await fetchAssets(); // Refresh data after save
        return true; // Indicate success
      } catch (err) {
        console.error("Error saving asset:", err);
        showErrorToast(
          err.response?.data?.message || "Please fill all required fields."
        );
        return false; // Indicate failure
      } finally {
        setLoading(false);
      }
    },
    [fetchAssets]
  );

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    assets: paginatedAssets,
    totalAssets: filteredAssets.length,
    loading,
    searchAsset,
    setSearchAsset,
    currentPage,
    setCurrentPage,
    pageSize,
    handleDelete,
    handleSaveAsset,
    fetchAssets, // Expose fetchAssets if needed elsewhere for manual refresh
  };
};

export default useAssetManagement;
