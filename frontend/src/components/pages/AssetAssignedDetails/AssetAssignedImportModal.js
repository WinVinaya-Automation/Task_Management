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

const AssetAssignedImportModal = ({ visible, onClose }) => {
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
        `${window.location.protocol}//${window.location.hostname}:5000/assigned-api/import-assigned-assets`,
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
        onClose(true); // Trigger data refresh in parent
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
    const sample = `asset_link_id,assigned_to,role,batch_name,student_name,batch_start_date,batch_end_date,remark
WVF-LA-LG-03,,Student,NISH-HI-24,Ravi Kumar,10-02-2024,30-06-2024,Initial assignment
WVF-MO-DE-02,Ravi,Employee,,,,,
WVF-AS-IN-04,Ravi,Intern,,,10-02-2024,30-06-2024,
WVF-AS-LG-03,Ravi,Other,,,,,`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_assigned_assets.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Modal
      title="Import Assigned Asset Details from CSV"
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
            Drag & drop your CSV file here or click to select
          </p>
          <p className="ant-upload-hint">Only .csv files are supported</p>
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

export default AssetAssignedImportModal;
