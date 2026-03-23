import React, { useState } from "react";
import { Button, Input } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import useAssetManagement from "../../../hooks/useAssetManagement";
import AssetTable from "./AssetsTable";
import AssetForm from "./AssetForm";
import AssetImportModal from "./AssetImportModal";

import { showSuccessToast, showErrorToast } from "../../../utils/notification";

const { Search } = Input;

const AssetList = () => {
  const {
    assets,
    totalAssets,
    loading,
    setSearchAsset,
    currentPage,
    setCurrentPage,
    pageSize,
    handleDelete,
    handleSaveAsset,
    fetchAssets,
  } = useAssetManagement();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/asset-api/export-assets`
      );
      if (!response.ok) {
        throw new Error("Export failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assets_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSuccessToast("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      showErrorToast("Export failed");
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingAsset(null);
  };

  const handleFormSubmit = async (values, assetToEdit) => {
    const success = await handleSaveAsset(values, assetToEdit);
    if (success) {
      handleModalCancel();
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      role="main"
    >
      <main
        style={{
          marginTop: 5,
          flex: 1,
          paddingBottom: 5,
          width: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 20px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "35px", fontWeight: 600 }}>
            All Assets
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <Search
              placeholder="Search by Value"
              allowClear
              onChange={(e) => setSearchAsset(e.target.value)}
              style={{ width: 250 }}
              aria-label="Search Assets"
              enterButton
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingAsset(null);
                setIsModalVisible(true);
              }}
              aria-label="Add Asset"
            >
              Add Asset
            </Button>

            <Button
              icon={<UploadOutlined />}
              onClick={() => setShowImportModal(true)}
              aria-label="Import CSV"
            >
              Import{" "}
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={assets.length === 0}
              aria-label="Export CSV"
            >
              Export
            </Button>
          </div>
        </div>

        <AssetTable
          data={assets}
          total={totalAssets}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AssetForm
          isVisible={isModalVisible}
          editingAsset={editingAsset}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          loading={loading}
        />

        <AssetImportModal
          visible={showImportModal}
          onClose={(shouldRefresh) => {
            setShowImportModal(false);
            if (shouldRefresh) {
              setCurrentPage(1);
              fetchAssets();
              // showSuccessToast("Successfully Imported");
            }
          }}
        />
      </main>
    </div>
  );
};

export default AssetList;
