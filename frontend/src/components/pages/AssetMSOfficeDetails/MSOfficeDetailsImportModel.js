// src/components/MSOfficeDetailsImport/MSOfficeDetailsImportModal.jsx
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

const MSOfficeDetailsImportModal = ({ visible, onClose }) => {
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
        `${window.location.protocol}//${window.location.hostname}:5000/office-api/import-ms-office`,
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
        onClose(true); // trigger refresh on parent
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
    const sample = `asset_link_id,ms_office_version,licence_key,main_user_name,users_group,remark
A001,Office 365,XXXX-XXXX-XXXX-XXXX,John Doe,"ID101:Alice;ID102:Bob","Sample remark"
A002,Office 2019,YYYY-YYYY-YYYY-YYYY,Jane Smith,"ID201:Charlie;ID202:David","Another remark"
`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_ms_office_details.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Modal
      title="Import MS Office Details from CSV"
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
      destroyOnClose
    >
      {!file ? (
        <Dragger
          beforeUpload={(file) => {
            setFile(file);
            return false; // prevent auto upload
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
        block
      >
        Download Sample CSV
      </Button>
    </Modal>
  );
};

export default MSOfficeDetailsImportModal;
