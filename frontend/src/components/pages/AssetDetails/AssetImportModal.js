import React, { useState } from "react";
import { Modal, Upload, Button, Space, Typography } from "antd";
import {
  DownloadOutlined,
  InboxOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { showErrorToast, showSuccessToast } from "../../../utils/notification";

const { Dragger } = Upload;
const { Text } = Typography;

const AssetImportModal = ({ visible, onClose }) => {
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
        `${window.location.protocol}//${window.location.hostname}:5000/asset-api/import-assets`,
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType = res.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!res.ok) {
        // Handle error response and show notification
        if (isJson) {
          const result = await res.json();
          showErrorToast(result.error || "Import failed");
        } else {
          showErrorToast("Import failed: Unexpected server response");
        }
      } else {
        const result = await res.json();
        showSuccessToast(result.message || "Import successful");
        onClose(true); // Refresh list
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
    const sample = `oldID,name,brandname,status,location,remark
A001,Asset1,LG,In_Use,Chennai,good laptop`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_assets.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Modal
      title="Import Assets from CSV"
      open={visible}
      onCancel={() => {
        setFile(null);
        onClose(false);
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setFile(null);
            onClose(false);
          }}
        >
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
      aria-modal="true"
      aria-labelledby="import-assets-modal-title"
    >
      {!file ? (
        <Dragger
          beforeUpload={(file) => {
            setFile(file);
            return false; // prevent auto upload
          }}
          maxCount={1}
          accept=".csv"
          multiple={false}
          aria-label="Drag and drop CSV file area"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Drag and drop your CSV file here or click to select a file
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
          align="center"
        >
          <Text strong>Selected file: {file.name}</Text>
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={handleRemoveFile}
            aria-label="Remove selected file"
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

export default AssetImportModal;
