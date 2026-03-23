import React from "react";
import { Table, Button, Space, Tag, Popconfirm, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../../styles/global.css";
// --- Import constant ---
import { TABLE_SCROLL_HEIGHT } from "../../../constants/assetServiceConstants";

const AssetServiceDetailsTable = ({
  paginatedServices,
  loading,
  onEdit,
  onDelete,
  formatDate,
  statusOptions,
  serviceStatusOptions,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "green";
      case "In_Progress":
        return "blue";
      case "Open":
        return "orange";
      default:
        return "default";
    }
  };

  const getServiceStatusColor = (serviceStatus) => {
    switch (serviceStatus) {
      case "Completed":
        return "green";
      case "Unrepairable":
        return "red";
      case "Under_Repair":
      case "Parts_Ordered":
        return "blue";
      case "Pending":
        return "orange";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Asset ID",
      dataIndex: "asset_link_id",
      key: "asset_link_id",
      sorter: (a, b) =>
        (a.asset_link_id || "").localeCompare(b.asset_link_id || ""),
      render: (text) => <span className="asset-id-text">{text || "N/A"}</span>,
    },
    {
      title: "Issue Description",
      dataIndex: "issue_description",
      key: "issue_description",
      render: (text) => (
        <span className="remark-text" title={text}>
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.replace("_", " ") || "N/A"}
        </Tag>
      ),
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Service Status",
      dataIndex: "service_status",
      key: "service_status",
      render: (service_status) => (
        <Tag color={getServiceStatusColor(service_status)}>
          {service_status?.replace("_", " ") || "N/A"}
        </Tag>
      ),
      filters: serviceStatusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.service_status === value,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => (
        <span className="remark-text" title={text}>
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.created_on || 0) - new Date(b.created_on || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label={`Edit service for Asset ID ${record.asset_link_id}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this service detail?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm service detail deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete service for Asset ID ${record.asset_link_id}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="table-container"
      role="region"
      aria-live="polite"
      aria-label="Service details table container"
      tabIndex="0"
    >
      <Table
        columns={columns}
        dataSource={paginatedServices}
        rowKey="id"
        pagination={false}
        loading={loading}
        bordered
        scroll={{ y: TABLE_SCROLL_HEIGHT }}
        locale={{
          emptyText: (
            <div className="table-empty-text">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No service details found"
              />
            </div>
          ),
        }}
        rowClassName={(record, index) => {
          if (record.status === "Closed") return "closed-service-row";
          if (record.status === "Open") return "open-service-row";
          return index % 2 === 0 ? "even-row" : "odd-row";
        }}
        aria-label="Service Details List Table"
        role="table"
      />
    </div>
  );
};

export default AssetServiceDetailsTable;
