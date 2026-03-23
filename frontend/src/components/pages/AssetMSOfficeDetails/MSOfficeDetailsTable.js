import React from "react";
import { Table, Button, Space, Popconfirm, Empty, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TABLE_SCROLL_Y } from "../../../constants/assetMSOfficeConstants";
import "../../../styles/global.css";

const MSOfficeDetailsTable = ({
  dataSource,
  loading,
  openModal,
  handleDelete,
  formatDate,
  assets, // Pass assets for rendering oldID
}) => {
  const columns = [
    {
      title: "Asset Link ID",
      dataIndex: "asset_link_id",
      key: "asset_link_id",
      width: 150,
      sorter: (a, b) =>
        (a.asset_link_id || "").localeCompare(b.asset_link_id || ""),
      showSorterTooltip: false,
      render: (id) => {
        const asset = assets.find((a) => a.assetID === id);
        return (
          <span style={{ fontWeight: 500 }}>
            {asset ? asset.assetID : id}{" "}
            {asset?.oldID && (
              <span style={{ color: "#888", fontSize: "0.8em" }}>
                (Old ID: {asset.oldID})
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: "MS Office Version",
      dataIndex: "ms_office_version",
      key: "ms_office_version",
      width: 180,
      sorter: (a, b) =>
        (a.ms_office_version || "").localeCompare(b.ms_office_version || ""),
      showSorterTooltip: false,
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "License Key",
      dataIndex: "licence_key",
      key: "licence_key",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontWeight: 500 }}>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Main User",
      dataIndex: "main_user_name",
      key: "main_user_name",
      width: 150,
      sorter: (a, b) =>
        (a.main_user_name || "").localeCompare(b.main_user_name || ""),
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "User Group Members",
      dataIndex: "users_group",
      key: "users_group",
      width: 280,
      render: (users_group) => {
        if (!users_group || users_group.length === 0) {
          return "-";
        }
        return (
          <Space direction="vertical" size={2}>
            {users_group.map((user, index) => (
              <div key={index} style={{ lineHeight: 1.3 }}>
                <span style={{ fontWeight: 500 }}>
                  {user?.user_asset_link_id || "N/A"}:{" "}
                </span>{" "}
                <Tooltip title={user?.name}>
                  <span style={{ color: "#555" }}>
                    {user?.name && user.name.length > 30
                      ? `${user.name.substring(0, 27)}...`
                      : user?.name || "N/A"}
                  </span>
                </Tooltip>
              </div>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontWeight: 500 }}>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      width: 140,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.created_on || 0) - new Date(b.created_on || 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            aria-label={`Edit MS Office detail for ${record.asset_link_id}`}
          />
          <Popconfirm
            title="Are you sure to delete this MS Office detail?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm deletion of MS Office detail"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete MS Office detail for ${record.asset_link_id}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        height: 380,
        marginTop: 10,
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#fafafa",
      }}
      role="region"
      aria-live="polite"
      aria-label="MS Office details table container"
      tabIndex="0"
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
        scroll={{ y: TABLE_SCROLL_Y }}
        loading={loading}
        bordered
        locale={{
          emptyText: (
            <div style={{ padding: "68px 0" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No MS Office details found"
              />
            </div>
          ),
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
        aria-label="MS Office Details List Table"
        role="table"
      />
    </div>
  );
};

export default MSOfficeDetailsTable;
