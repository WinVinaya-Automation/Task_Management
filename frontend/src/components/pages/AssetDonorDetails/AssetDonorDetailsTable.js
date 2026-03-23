// src/components/pages/AssetDonorDetails/AssetDonorDetailsTable.js
import React from "react";
import { Table, Space, Button, Tag, Popconfirm, Pagination, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  PAGE_SIZE,
  TABLE_SCROLL_Y,
  DATE_FORMAT,
  STATUS_OPTIONS,
  STATUS_TAG_COLORS,
} from "../../../constants/assetDonorConstants";
import "../../../styles/global.css";

const AssetDonorDetailsTable = ({
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
      title: "Asset ID",
      dataIndex: "asset_link_id",
      key: "asset_link_id",
      width: 100,
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
      title: "Donor Name",
      dataIndex: "donor_name",
      key: "donor_name",
      sorter: (a, b) => (a.donor_name || "").localeCompare(b.donor_name || ""),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={STATUS_TAG_COLORS[status] || "default"}
          style={{ fontWeight: 600 }}
        >
          {status?.toUpperCase() || "N/A"}
        </Tag>
      ),
      filters: STATUS_OPTIONS.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "-"}</span>,
      width: 200,
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.created_on || 0) - new Date(b.created_on || 0),
      width: 150,
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
            aria-label={`Edit Donor ${record.donor_name || ""}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this donor?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm donor deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete Donor ${record.donor_name || ""}`}
            />
          </Popconfirm>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <>
      <div
        className="table-container"
        role="region"
        aria-live="polite"
        aria-label="Donors table container"
        tabIndex="0"
        style={{
          height: 380,
          marginTop: 10,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 8,
          backgroundColor: "#fafafa",
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          loading={loading}
          bordered
          scroll={{ y: TABLE_SCROLL_Y }}
          locale={{
            emptyText: (
              <div style={{ padding: "75px 0" }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No donors found"
                />
              </div>
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          aria-label="Donors List Table"
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
            aria-label="Donors Table Pagination"
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

export default AssetDonorDetailsTable;
