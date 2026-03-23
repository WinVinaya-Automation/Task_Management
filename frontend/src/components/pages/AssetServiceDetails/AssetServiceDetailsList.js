import React, { useState } from "react";
import { Button, Pagination, Input, Space, message } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import useAssetServiceDetailsData from "../../../hooks/useAssetServiceManagement";
import AssetServiceDetailsTable from "./AssetServiceDetailsTable";
import AssetServiceDetailsForm from "./AssetServiceDetailsForm";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/global.css";
import AssetServiceImportModal from "./AssetServiceImportModal";

const { Search } = Input;

const AssetServiceDetailsList = () => {
  const [showImportModal, setShowImportModal] = useState(false); // ✅ FIXED default value
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const {
    total,
    loading,
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
    statusOptions,
    serviceStatusOptions,
    PAGE_SIZE,
    fetchServiceData, // ✅ Make sure this is defined in your hook
  } = useAssetServiceDetailsData();

  const openModal = (service = null) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingService(null);
  };

  const handleSubmitForm = async (values) => {
    const success = editingService
      ? await updateService(editingService.id, values)
      : await addService(values);

    if (success) closeModal();
  };

  // ===== Export CSV =====
  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/service-api/export-service-assets`
      );

      if (!response.ok) {
        const result = await response.json();
        message.error(result.error || "Export failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "service_assets.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      message.error("Network error during export");
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
          <h1 className="header-title">Service Details</h1>
          <div className="header-controls">
            <Search
              placeholder="Search by Value"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search Service Details"
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                aria-label="Add Service Detail"
              >
                Add Service
              </Button>
              <Button onClick={() => setShowImportModal(true)}>
                Import CSV
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={filteredServices.length === 0}
              >
                Export
              </Button>
            </Space>
          </div>
        </div>

        <AssetServiceDetailsTable
          paginatedServices={paginatedServices}
          loading={loading}
          onEdit={openModal}
          onDelete={deleteService}
          formatDate={formatDate}
          statusOptions={statusOptions}
          serviceStatusOptions={serviceStatusOptions}
        />

        {filteredServices.length > 0 && (
          <div className="pagination-container">
            {/* <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredServices.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              aria-label="Service Details Table Pagination"
            /> */}
            <Pagination
              aria-label="Service Details Table Pagination"
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredServices.length}
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

        <AssetServiceDetailsForm
          isModalOpen={isModalVisible}
          editingService={editingService}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          loading={loading}
          getAvailableAssets={getAvailableAssets}
          statusOptions={statusOptions}
          serviceStatusOptions={serviceStatusOptions}
        />

        <AssetServiceImportModal
          visible={showImportModal}
          onClose={(refresh) => {
            setShowImportModal(false);
            if (refresh) fetchServiceData(); // ✅ Refresh on successful import
          }}
        />
      </main>
    </div>
  );
};

export default AssetServiceDetailsList;
