import React, { useState } from "react";
import { Button, Input, Pagination } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";

import useMSOfficeDetailsManagement from "../../../hooks/useAssetMSOfficeManagement";
import MSOfficeDetailsTable from "./MSOfficeDetailsTable";
import MSOfficeDetailsForm from "./MSOfficeDetailsForm";
import MSOfficeDetailsImport from "./MSOfficeDetailsImportModel"; // Make sure you create this component
import { showSuccessToast, showErrorToast } from "../../../utils/notification";
import { PAGE_SIZE } from "../../../constants/assetMSOfficeConstants";
import "../../../styles/global.css";

const { Search } = Input;

const MSOfficeDetailsList = () => {
  const {
    assets,
    total,
    loading,
    isModalOpen,
    onPageChange,
    editingDetail,
    currentPage,
    filteredDetails,
    form,
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
    fetchMSOfficeDetails, // optional: if needed after import
  } = useMSOfficeDetailsManagement();

  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/office-api/export-ms-office`
      );
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ms_office_details_export.csv");
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
    <div className="before-main" role="main">
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
            MS Office Details
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <Search
              placeholder="Search details"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search MS Office Details"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              aria-label="Add MS Office Detail"
            >
              Add MS Office Detail
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
              disabled={filteredDetails.length === 0}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <MSOfficeDetailsTable
          dataSource={getPaginatedData}
          loading={loading}
          openModal={openModal}
          handleDelete={handleDelete}
          formatDate={formatDate}
          assets={assets}
        />

        {/* Pagination */}
        {filteredDetails.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              maxWidth: 1200,
              margin: "10px auto 0",
            }}
          >
            {/* <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredDetails.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              aria-label="MS Office Details Table Pagination"
            /> */}
            <Pagination
              aria-label="MS Office Details Table Pagination"
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredDetails.length}
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

        {/* Form Modal */}
        <MSOfficeDetailsForm
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          loading={loading}
          editingDetail={editingDetail}
          form={form}
          getAvailableAssetsForMainLink={getAvailableAssetsForMainLink}
          getAvailableAssetsForUserLink={getAvailableAssetsForUserLink}
        />

        {/* Import Modal */}
        <MSOfficeDetailsImport
          visible={showImportModal}
          onClose={(shouldRefresh) => {
            setShowImportModal(false);
            if (shouldRefresh) fetchMSOfficeDetails?.(); // Optional
          }}
        />
      </main>
    </div>
  );
};

export default MSOfficeDetailsList;
