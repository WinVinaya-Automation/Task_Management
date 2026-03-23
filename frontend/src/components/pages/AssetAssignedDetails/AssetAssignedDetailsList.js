import React, { useState } from "react";
import { Button, Input } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import useAssetAssignedManagement from "../../../hooks/useAssetAssignedManagement";
import AssetAssignedDetailsTable from "./AssetAssignedDetailsTable";
import AssetAssignedDetailsForm from "./AssetAssignedDetailsForm";
import AssetAssignedImportModal from "./AssetAssignedImportModal"; // New component for import modal
import "../../../styles/global.css";

const { Search } = Input;

const AssetAssignedDetailsList = () => {
  const {
    data,
    totalCount,
    loading,
    setSearchText,
    currentPage,
    setCurrentPage,
    isModalOpen,
    editingRecord,
    role,
    openModal,
    closeModal,
    handleRoleChange,
    handleSubmit,
    handleDelete,
    getAvailableAssets,
    assets,
    fetchAssignedAssets, // To refresh after import
  } = useAssetAssignedManagement();

  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/assigned-api/export-assigned-assets`
      );
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assigned_assets_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
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
        {/* Header Section */}
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
            Asset Assigned Details
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <Search
              placeholder="Search by value"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search Assets"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              aria-label="Assign Asset"
            >
              Assign Asset
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => setShowImportModal(true)}
            >
              Import
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={data.length === 0}
              aria-label="Export CSV"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <AssetAssignedDetailsTable
          data={data}
          totalCount={totalCount}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onEdit={openModal}
          onDelete={handleDelete}
          allAssets={assets}
        />

        {/* Form Modal */}
        <AssetAssignedDetailsForm
          isModalOpen={isModalOpen}
          editingRecord={editingRecord}
          loading={loading}
          closeModal={closeModal}
          handleFormSubmit={handleSubmit}
          handleRoleChange={handleRoleChange}
          getAvailableAssets={getAvailableAssets}
          role={role}
        />

        {/* Import Modal */}
        <AssetAssignedImportModal
          visible={showImportModal}
          onClose={(shouldRefresh) => {
            setShowImportModal(false);
            if (shouldRefresh) fetchAssignedAssets?.();
          }}
        />
      </main>
    </div>
  );
};

export default AssetAssignedDetailsList;
