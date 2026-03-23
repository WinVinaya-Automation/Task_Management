import React from "react";
import { Table, Button, Space, Popconfirm, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../../styles/global.css"; // Import the global CSS file for styles
import { TABLE_SCROLL_Y } from "../../../constants/assetLoptopConfigConstants";

const AssetLaptopConfigTable = ({
  paginatedLaptops,
  loading,
  assets, // Need all assets to render asset details in table columns
  onEdit,
  onDelete,
  formatDate,
}) => {
  const columns = [
    {
      title: "Asset ID",
      dataIndex: "asset_link_id",
      key: "asset_link_id",
      width: 150,
      sorter: (a, b) =>
        (a.asset_link_id || "").localeCompare(b.asset_link_id || ""),
      render: (id) => {
        const asset = assets.find((a) => a.assetID === id);
        return (
          <span className="asset-id-text">
            {asset ? asset.assetID : id}{" "}
            {asset?.oldID && (
              <span className="old-id-text"> (Old ID: {asset.oldID}) </span>
            )}
          </span>
        );
      },
    },
    {
      title: "Model Name",
      dataIndex: "model_name",
      key: "model_name",
      width: 150,
      sorter: (a, b) => (a.model_name || "").localeCompare(b.model_name || ""),
      render: (text) => <span className="model-name-text">{text || "-"}</span>,
    },
    {
      title: "Processor Gen",
      dataIndex: "processor_generation",
      key: "processor_generation",
      width: 150,
      render: (text) => (
        <span className="processor-gen-text">{text || "-"}</span>
      ),
    },
    {
      title: "CPU Speed & Bandwidth",
      dataIndex: "bandwidth",
      key: "bandwidth",
      width: 120,
      render: (text) => <span className="bandwidth-text">{text || "-"}</span>,
    },
    {
      title: "Graphics Card",
      dataIndex: "graphics_card",
      key: "graphics_card",
      width: 120,
      render: (text) => (
        <span className="graphics-card-text">{text || "-"}</span>
      ),
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
      width: 100,
      render: (text) => <span className="ram-text">{text || "-"}</span>,
    },
    {
      title: "RAM Type",
      dataIndex: "ram_type",
      key: "ram_type",
      width: 100,
      render: (text) => <span className="ram-type-text">{text || "-"}</span>,
    },
    {
      title: "ROM",
      dataIndex: "rom",
      key: "rom",
      width: 100,
      render: (text) => <span className="rom-text">{text || "-"}</span>,
    },
    {
      title: "ROM Type",
      dataIndex: "rom_type",
      key: "rom_type",
      width: 100,
      render: (text) => <span className="rom-type-text">{text || "-"}</span>,
    },
    {
      title: "OS Details",
      dataIndex: "os_details",
      key: "os_details",
      width: 150,
      render: (text) => <span className="os-details-text">{text || "-"}</span>,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      width: 180,
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
      width: 120,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.created_on || 0) - new Date(b.created_on || 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label={`Edit ${record.model_name || "laptop"} configuration`}
          />
          <Popconfirm
            title="Are you sure you want to delete this configuration?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm configuration deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete ${
                record.model_name || "laptop"
              } configuration`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="table-container" // Applying the CSS class
      role="region"
      aria-live="polite"
      aria-label="Laptop configurations table container"
      tabIndex="0"
    >
      <Table
        columns={columns}
        dataSource={paginatedLaptops}
        rowKey="id"
        pagination={false} // Custom pagination below the table
        scroll={{ y: TABLE_SCROLL_Y }}
        loading={loading}
        bordered
        locale={{
          emptyText: (
            <div className="table-empty-text">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No configurations found"
              />
            </div>
          ),
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
        aria-label="Laptop Configuration List Table"
        role="table"
      />
    </div>
  );
};

export default AssetLaptopConfigTable;
