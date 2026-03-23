// src/components/AssetList/AssetTable.js
import React from "react";
import { Table, Space, Button, Tag, Popconfirm, Pagination, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { STATUS_OPTIONS } from "../../../constants/assetConstants";
import "../../../styles/global.css";

const AssetTable = ({
  data,
  total,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Asset ID",
      dataIndex: "assetID",
      key: "assetID",
      sorter: (a, b) => a.assetID?.localeCompare(b.assetID),
    },
    {
      title: "Old ID",
      dataIndex: "oldID",
      key: "oldID",
      render: (oldID) => (oldID ? ` ${oldID}` : "N/A"),
    },
    {
      title: "Asset Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Asset Brand Name",
      dataIndex: "brandname",
      key: "brandname",
      sorter: (a, b) => a.brandname?.localeCompare(b.brandname),
    },
    {
      title: "Asset Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusText = status?.replace(/_/g, " ") || "N/A";
        return (
          <Tag
            color={
              status === "In_Use"
                ? "green"
                : status === "Not_Using"
                ? "orange"
                : "red"
            }
          >
            {statusText.toUpperCase()}
          </Tag>
        );
      },
      filters: STATUS_OPTIONS.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Asset Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Remarks",
      dataIndex: "description",
      key: "description",
      render: (text) => <span title={text}>{text || "N/A"}</span>,
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      render: (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "N/A"),
      sorter: (a, b) => new Date(a.created_on) - new Date(b.created_on),
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
            aria-label={`Edit Asset ${record.assetID || record.name || ""}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this asset?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm asset deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete Asset ${record.assetID || record.name || ""}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Custom pagination item renderer
  const itemRender = (current, type, originalElement) => {
    const totalPages = Math.ceil(total / pageSize);

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
        aria-label="Assets table container"
        tabIndex="0"
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          loading={loading}
          bordered
          scroll={{ y: 296 }}
          locale={{
            emptyText: (
              <div style={{ padding: "75px 0" }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No assets found"
                />
              </div>
            ),
          }}
          rowClassName={(record) => {
            if (record.status === "Broken") return "broken-row";
            if (record.status === "Missing") return "missing-row";
            return "";
          }}
          aria-label="Assets List Table"
          role="table"
        />
      </div>

      {total > 0 && (
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
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false}
            size="small"
            aria-label="Assets Table Pagination"
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

export default AssetTable;
