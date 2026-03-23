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

const AssetServiceImportModal = ({ visible, onClose }) => {
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
      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:5000/service-api/import-service-assets`,
        {
          method: "POST",
          body: formData,
        }
      );

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const result = isJson ? await response.json() : {};

      if (!response.ok) {
        showErrorToast(result.error || "Import failed");
      } else {
        showSuccessToast(result.message || "Import successful");
        onClose(true); // refresh parent list
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
    const sample = `asset_link_id,issue_description,status,service_status,remark
WVF-LA-LG-03,Keyboard not working,Open,Pending,Waiting for part
WVF-MO-DE-02,Display crack,Closed,Completed,Replaced screen
WVF-AS-IN-04,No power,In_Progress,Under_Repair,Sent to technician
WVF-AS-LG-03,Mouse issue,Resolved,Completed,`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_service_assets.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Modal
      title="Import Service Details from CSV"
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
            return false; // Prevent auto-upload
          }}
          maxCount={1}
          accept=".csv"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Drag & drop CSV file here or click to select
          </p>
          <p className="ant-upload-hint">Only .csv files are allowed</p>
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
          <Text strong>Selected file: {file?.name || "No file selected"}</Text>
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

export default AssetServiceImportModal;
