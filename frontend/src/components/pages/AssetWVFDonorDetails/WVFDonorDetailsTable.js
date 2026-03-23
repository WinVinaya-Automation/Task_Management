import React from "react";
import { Table, Button, Space, Tag, Popconfirm, Empty } from "antd"; //Input
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { TABLE_SCROLL_HEIGHT } from "../../../constants/assetWVFDonorConstants";
import "../../../styles/global.css"; // Import global CSS for general styles

const WVFDonorDetailsTable = ({
  paginatedDonors,
  loading,
  onEdit,
  onDelete,
  formatDate,
  showPassword,
  togglePasswordVisibility,
  statusOptions,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "green";
      case "inprogress":
        return "orange";
      case "ytd":
        return "red";
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
      // Assumes asset_link_id is already the display value, if you need to resolve
      // it to another asset property, you'd need the 'assets' prop here.
      // For now, it's just displaying the ID.
      render: (id) => <span className="asset-id-text">{id || "N/A"}</span>,
    },
    {
      title: "Receiver",
      dataIndex: "receiver_name",
      key: "receiver_name",
      sorter: (a, b) =>
        (a.receiver_name || "").localeCompare(b.receiver_name || ""),
    },
    {
      title: "User ID",
      dataIndex: "new_user_id",
      key: "new_user_id",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <Space>
          {showPassword[record.id] ? text : "••••••••"}
          <Button
            type="text"
            icon={
              showPassword[record.id] ? (
                <EyeInvisibleOutlined />
              ) : (
                <EyeOutlined />
              )
            }
            onClick={() => togglePasswordVisibility(record.id)}
            aria-label={
              showPassword[record.id] ? "Hide password" : "Show password"
            }
          />
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase() || "N/A"}
        </Tag>
      ),
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => (
        <span className="remark-text" title={text}>
          {text || "-"}
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
            aria-label={`Edit donor ${record.receiver_name}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this donor record?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm donor record deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete donor ${record.receiver_name}`}
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
      aria-label="Donor details table container"
      tabIndex="0"
    >
      <Table
        columns={columns}
        dataSource={paginatedDonors}
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
                description="No donor records found"
              />
            </div>
          ),
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
        aria-label="Donor Details List Table"
        role="table"
      />
    </div>
  );
};

export default WVFDonorDetailsTable;
