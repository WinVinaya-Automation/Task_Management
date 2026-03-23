// src/components/AssetLaptopConfig/AssetLaptopConfigImportModal.js
import React, { useState } from "react";
import { Modal, Upload, Button, Space, Typography } from "antd";
import {
  InboxOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { showSuccessToast, showErrorToast } from "../../../utils/notification";

const { Dragger } = Upload;
const { Text } = Typography;

const AssetDonorImportModal = ({ visible, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      showErrorToast("Please select a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/donor-api/import-donors`,
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType = res.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!res.ok) {
        if (isJson) {
          const result = await res.json();
          showErrorToast(result.error || "Import failed");
        } else {
          showErrorToast("Import failed: Unexpected server response");
        }
      } else {
        const result = await res.json();
        showSuccessToast(result.message || "Import successful");
        onClose(true); // Trigger refresh
      }
    } catch (error) {
      console.error("Import error:", error);
      showErrorToast("Import failed: Network error");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleDownloadSample = () => {
    const sample = `asset_link_id,donor_name,status,remark
asset-link-ID,John Doe,New,Sample remark
asset-link-ID,Jane Smith,Old,Another remark`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_donors.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Modal
      title="Import Doners from CSV"
      open={visible}
      onCancel={() => {
        setFile(null);
        onClose(false);
      }}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          loading={uploading}
        >
          Import
        </Button>,
      ]}
    >
      {!file ? (
        <Dragger
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          maxCount={1}
          accept=".csv"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Drag and drop your CSV file here or click to select
          </p>
          <p className="ant-upload-hint">Only .csv files are supported.</p>
        </Dragger>
      ) : (
        <Space
          style={{
            marginTop: 16,
            marginBottom: 16,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text strong>Selected file: {file.name}</Text>
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={handleRemoveFile}
          >
            Remove
          </Button>
        </Space>
      )}

      <Button
        icon={<DownloadOutlined />}
        style={{ marginTop: 10 }}
        onClick={handleDownloadSample}
      >
        Download Sample CSV
      </Button>
    </Modal>
  );
};

export default AssetDonorImportModal;
