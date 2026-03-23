import React, { useState } from "react";
import { Button, Input } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

// Import custom hook & components
import useAssetDonorManagement from "../../../hooks/useAssetDonorManagement";
import DonorDetailsTable from "./AssetDonorDetailsTable";
import DonorDetailsForm from "./AssetDonorDetailsForm";
import AssetDonorImportModal from "./AssetDonorImportModal"; // 🆕 Create this

import { showErrorToast, showSuccessToast } from "../../../utils/notification";
import "../../../styles/global.css";

const { Search } = Input;

const AssetDonorDetailsList = () => {
  const {
    loading,
    setSearchText,
    currentPage,
    setCurrentPage,
    isModalOpen,
    editingDonor,
    form,
    modalRef,
    getPaginatedData,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    getAvailableAssets,
    filteredData,
    assets,
    fetchDonorDetails, // 🆕 Add this to hook and expose it
  } = useAssetDonorManagement();

  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/donor-api/export-donors`
      );
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "donors_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSuccessToast("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      showErrorToast("Export failed");
    }
  };

  return (
    <div className="page-container" role="main">
      <div className="page-content-wrapper">
        <div className="header-section">
          <h1 className="header-title">Donor Details</h1>
          <div className="header-controls">
            <Search
              placeholder="Search by Value"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search Donors"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              aria-label="Add Donor"
            >
              Add Donor
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => setShowImportModal(true)}
              aria-label="Import Donor Data"
            >
              Import
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={filteredData.length === 0}
              aria-label="Export Donor Data"
            >
              Export
            </Button>
          </div>
        </div>

        <DonorDetailsTable
          data={getPaginatedData}
          totalCount={filteredData.length}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onEdit={openModal}
          onDelete={handleDelete}
          allAssets={assets}
        />

        <DonorDetailsForm
          isModalOpen={isModalOpen}
          editingDonor={editingDonor}
          loading={loading}
          closeModal={closeModal}
          handleFormSubmit={handleSubmit}
          form={form}
          modalRef={modalRef}
          getAvailableAssets={getAvailableAssets}
        />

        <AssetDonorImportModal
          visible={showImportModal}
          onClose={(shouldRefresh) => {
            setShowImportModal(false);
            if (shouldRefresh) fetchDonorDetails(); // refresh after import
          }}
        />
      </div>
    </div>
  );
};

export default AssetDonorDetailsList;
