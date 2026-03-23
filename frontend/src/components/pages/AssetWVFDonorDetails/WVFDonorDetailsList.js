import React, { useState } from "react";
import { Button, Pagination, Input, Space, message } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import useWVFDonorManagement from "../../../hooks/useAssetWVFDonorManagement";
import DonorDetailsTable from "./WVFDonorDetailsTable";
import DonorDetailsForm from "./WVFDonorDetailsForm";
import WVFDonorImportModal from "./WVFDonorImportModal";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/global.css";

const { Search } = Input;

const DonorDetailsList = () => {
  const {
    total,
    loading,
    setSearchText,
    currentPage,
    setCurrentPage,
    showPassword,
    filteredDonors,
    paginatedDonors,
    getAvailableAssets,
    addDonor,
    updateDonor,
    deleteDonor,
    togglePasswordVisibility,
    formatDate,
    statusOptions,
    PAGE_SIZE,
    fetchDonorData,
  } = useWVFDonorManagement();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const openModal = (donor = null) => {
    setEditingDonor(donor);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingDonor(null);
  };

  const handleSubmitForm = async (values) => {
    const success = editingDonor
      ? await updateDonor(editingDonor.id, values)
      : await addDonor(values);

    if (success) closeModal();
  };

  const handleExport = async () => {
    if (filteredDonors.length === 0) {
      message.warning("No data to export.");
      return;
    }

    const url = `${window.location.protocol}//${window.location.hostname}:5000/wvf-api/export-donors`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "WVF_Donors.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      message.error("Export failed");
    }
  };
  const itemRender = (current, type, originalElement) => {
    const totalPages = Math.ceil(total / PAGE_SIZE);

    if (type === "page") {
      // Show current page and adjacent pages (sliding window)
      const shouldShow =
        current === currentPage ||
        current === currentPage - 1 ||
        current === currentPage + 1;

      return shouldShow ? originalElement : null;
    }

    // Always show prev/next buttons
    if (type === "prev" || type === "next") {
      return originalElement;
    }

    // Show ellipsis only when needed
    if (
      (type === "jump-prev" && currentPage > 2) ||
      (type === "jump-next" && currentPage < totalPages - 1)
    ) {
      return <span className="ant-pagination-item-ellipsis">•••</span>;
    }

    return originalElement;
  };
  return (
    <div className="page-container" role="main">
      <main className="page-content-wrapper">
        <div className="header-section">
          <h1 className="header-title">WVF Donor Management</h1>
          <div className="header-controls">
            <Search
              placeholder="Search donors..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search Donor Records"
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                aria-label="Add New Donor"
              >
                Add Donor
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setShowImportModal(true)}
              >
                Import CSV
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={filteredDonors.length === 0}
              >
                Export CSV
              </Button>
            </Space>
          </div>
        </div>

        <DonorDetailsTable
          paginatedDonors={paginatedDonors}
          loading={loading}
          onEdit={openModal}
          onDelete={deleteDonor}
          formatDate={formatDate}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          statusOptions={statusOptions}
        />

        {filteredDonors.length > 0 && (
          <div className="pagination-container">
            {/* <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredDonors.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} donors`
              }
              aria-label="Donor Details Table Pagination"
            /> */}
            <Pagination
              aria-label="Donor Details Table Pagination"
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredDonors.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              itemRender={itemRender}
              showQuickJumper={false}
            />
          </div>
        )}

        <DonorDetailsForm
          isModalOpen={isModalVisible}
          editingDonor={editingDonor}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          loading={loading}
          getAvailableAssets={getAvailableAssets}
          statusOptions={statusOptions}
        />

        <WVFDonorImportModal
          visible={showImportModal}
          onClose={(refresh) => {
            setShowImportModal(false);
            if (refresh) fetchDonorData();
          }}
        />
      </main>
    </div>
  );
};

export default DonorDetailsList;
