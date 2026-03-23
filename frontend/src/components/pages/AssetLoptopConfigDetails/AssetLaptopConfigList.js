import React, { useState } from "react";
import { Button, Pagination, Input } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import useAssetLaptopConfigManagement from "../../../hooks/useAssetLaptopConfigManagement"; // The custom hook
import AssetLaptopConfigTable from "./AssetLaptopConfigTable"; // Table sub-component
import AssetLaptopConfigForm from "./AssetLaptopConfigForm"; // Form sub-component
import AssetLaptopConfigImportModal from "./AssetLaptopConfigImportModal.js";
import { showErrorToast, showSuccessToast } from "../../../utils/notification";
import "react-toastify/dist/ReactToastify.css"; // Ensure toastify CSS is imported once in your app
import "../../../styles/global.css"; // Import the global CSS file for general layout/styles

const { Search } = Input;

const AssetLaptopConfigList = () => {
  const {
    total,
    laptops,
    assets,
    loading,
    setSearchText,
    currentPage,
    setCurrentPage,
    filteredLaptops,
    paginatedLaptops,
    getAvailableAssets,
    addLaptop,
    updateLaptop,
    deleteLaptop,
    formatDate,
    PAGE_SIZE,
    fetchLaptopConfigs,
  } = useAssetLaptopConfigManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const openModal = (laptop = null) => {
    setEditingLaptop(laptop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLaptop(null);
  };

  const handleSubmitForm = async (values) => {
    let success = false;
    if (editingLaptop) {
      success = await updateLaptop(editingLaptop.id, values);
    } else {
      success = await addLaptop(values);
    }
    if (success) closeModal();
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/laptop-api/export-laptop-config`
      );
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "laptop_configs_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSuccessToast("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      showErrorToast("Export failed");
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
          <h1 className="header-title">Laptop Configurations</h1>
          <div className="header-controls">
            <Search
              placeholder="Search configurations"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search Laptop Configurations"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              aria-label="Add Laptop Configuration"
            >
              Add Configuration
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
              disabled={filteredLaptops.length === 0}
            >
              Export
            </Button>
          </div>
        </div>

        <AssetLaptopConfigTable
          paginatedLaptops={paginatedLaptops}
          loading={loading}
          assets={assets}
          onEdit={openModal}
          onDelete={deleteLaptop}
          formatDate={formatDate}
        />

        {filteredLaptops.length > 0 && (
          <div className="pagination-container">
            {/* <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredLaptops.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              aria-label="Laptop Configuration Table Pagination"
            /> */}
            <Pagination
              aria-label="Laptop Configuration Table Pagination"
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredLaptops.length}
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

        <AssetLaptopConfigForm
          isModalOpen={isModalOpen}
          editingLaptop={editingLaptop}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          loading={loading}
          getAvailableAssets={getAvailableAssets}
          allLaptops={laptops}
        />

        <AssetLaptopConfigImportModal
          visible={showImportModal}
          onClose={(shouldRefresh) => {
            setShowImportModal(false);
            if (shouldRefresh) fetchLaptopConfigs();
          }}
        />
      </main>
    </div>
  );
};

export default AssetLaptopConfigList;
