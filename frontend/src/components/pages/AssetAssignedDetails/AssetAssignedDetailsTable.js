// src/components/pages/AssetAssign/AssetAssignedDetailsTable.js
import React from "react";
import { Table, Space, Button, Popconfirm, Tag, Pagination, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  TABLE_SCROLL_Y,
  PAGE_SIZE,
  DATE_FORMAT,
  ROLE_CONFIG,
} from "../../../constants/assetAssignedConstants";
import "../../../styles/global.css";

const AssetAssignedDetailsTable = ({
  data,
  totalCount,
  loading,
  currentPage,
  setCurrentPage,
  onEdit,
  onDelete,
  allAssets,
}) => {
  const formatDate = (date) => {
    return date ? dayjs(date).format(DATE_FORMAT) : "-";
  };

  // Custom pagination item renderer for sliding page numbers
  const itemRender = (current, type, originalElement) => {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    if (type === "page") {
      // Show current page and adjacent pages (sliding window)
      const shouldShow =
        current === currentPage ||
        current === currentPage - 1 ||
        current === currentPage + 1;

      return shouldShow ? originalElement : null;
    }

    // Always show prev/next buttons
    if (type === "prev" || type === "next") {
      return originalElement;
    }

    // Show ellipsis only when needed
    if (
      (type === "jump-prev" && currentPage > 2) ||
      (type === "jump-next" && currentPage < totalPages - 1)
    ) {
      return <span className="ant-pagination-item-ellipsis">•••</span>;
    }

    return originalElement;
  };

  const columns = [
    {
      title: "Asset Link ID",
      dataIndex: "asset_link_id",
      key: "asset_link_id",
      width: 150,
      sorter: (a, b) =>
        (a.asset_link_id || "").localeCompare(b.asset_link_id || ""),
      render: (id) => {
        const asset = allAssets.find((a) => a.assetID === id);
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
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
      width: 150,
      sorter: (a, b) =>
        (a.assigned_to || "").localeCompare(b.assigned_to || ""),
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => (
        <Tag
          color={ROLE_CONFIG[role?.toLowerCase()]?.tagColor || "default"}
          style={{ fontWeight: 600 }}
        >
          {role?.toUpperCase() || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Batch",
      dataIndex: "batch_name",
      key: "batch_name",
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "Student",
      dataIndex: "student_name",
      key: "student_name",
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "batch_start_date",
      key: "batch_start_date",
      width: 120,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.batch_start_date || 0) - new Date(b.batch_start_date || 0),
    },
    {
      title: "End Date",
      dataIndex: "batch_end_date",
      key: "batch_end_date",
      width: 120,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.batch_end_date || 0) - new Date(b.batch_end_date || 0),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      width: 150,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.created_on || 0) - new Date(b.created_on || 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label={`Edit Assignment for Asset ${
              record.asset_link_id || ""
            }`}
          />
          <Popconfirm
            title="Are you sure you want to delete this assignment?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete Assignment ${record.asset_link_id || ""}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
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
        aria-label="Assigned assets table container"
        tabIndex="0"
      >
        <Table
          columns={columns}
          dataSource={[...data].sort(
            (a, b) => new Date(b.created_on) - new Date(a.created_on)
          )}
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
                  description="No assigned assets found"
                />
              </div>
            ),
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          aria-label="Assigned Assets List Table"
        />
      </div>

      {totalCount > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            maxWidth: 1200,
            margin: "10px auto 0",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={totalCount}
            onChange={setCurrentPage}
            showSizeChanger={false}
            size="small"
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            itemRender={itemRender}
            showQuickJumper={false}
          />
        </div>
      )}
    </>
  );
};

export default AssetAssignedDetailsTable;
