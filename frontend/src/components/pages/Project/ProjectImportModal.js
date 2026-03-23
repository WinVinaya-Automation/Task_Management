import React, { useState } from "react";
import { Modal, Upload, Button, Typography, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import api from "../../../services/api";

const { Dragger } = Upload;
const { Text } = Typography;

const ProjectImportModal = ({ visible, onClose }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning("Please select a CSV file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0]);
        setUploading(true);

        try {
            await api.post("/project-api/import-projects", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            message.success("Projects imported successfully!");
            setFileList([]);
            onClose(true);
        } catch (error) {
            console.error("Import error:", error);
            message.error(
                error.response?.data?.message ||
                "Failed to import projects. Please check your file."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFileList([]);
        onClose(false);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isCSV =
                file.type === "text/csv" || file.name.endsWith(".csv");
            if (!isCSV) {
                message.error("Only CSV files are allowed.");
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        onRemove: () => setFileList([]),
        fileList,
        accept: ".csv",
        maxCount: 1,
    };

    return (
        <Modal
            title="Import Projects"
            open={visible}
            onCancel={handleCancel}
            width={500}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                >
                    {uploading ? "Importing..." : "Import"}
                </Button>,
            ]}
        >
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                    Upload a CSV file to import projects. Make sure your file includes
                    the required columns:{" "}
                    <Text code>type</Text>,{" "}
                    <Text code>title</Text>,{" "}
                    <Text code>status</Text>,{" "}
                    <Text code>priority</Text>,{" "}
                    <Text code>tags</Text>,{" "}
                    <Text code>due_date</Text>,{" "}
                    <Text code>owner_name</Text>.
                </Text>
            </div>

            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag a CSV file to this area
                </p>
                <p className="ant-upload-hint">
                    Only <strong>.csv</strong> files are supported. Max 1 file.
                </p>
            </Dragger>
        </Modal>
    );
};

export default ProjectImportModal;