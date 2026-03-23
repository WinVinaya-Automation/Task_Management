import React from "react";
import { Table, Space, Button, Tag, Popconfirm, Pagination, Empty, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
    STATUS_OPTIONS,
    PRIORITY_OPTIONS,
} from "../../../constants/projectConstants";
import "../../../styles/global.css";
import { useNavigate } from "react-router-dom";

const ProjectTable = ({
    data,
    total,
    loading,
    currentPage,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
}) => {
    const navigate = useNavigate();

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title?.localeCompare(b.title),
            render: (title, record) => (
                <span
                    style={{ color: "#1677ff", cursor: "pointer" }}
                    onClick={() => navigate(`/projects/${record.id}`)}
                >
                    {title}
                </span>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusText = status?.replace(/_/g, " ") || "N/A";
                const colorMap = {
                    todo: "blue",
                    in_progress: "orange",
                    done: "green",
                    overdue: "red",
                    hold: "default",
                };
                return (
                    <Tag color={colorMap[status] || "default"}>
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
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            render: (priority) => {
                const colorMap = {
                    low: "green",
                    medium: "orange",
                    high: "red",
                };
                return (
                    <Tag color={colorMap[priority] || "default"}>
                        {priority?.toUpperCase() || "N/A"}
                    </Tag>
                );
            },
            filters: PRIORITY_OPTIONS.map((opt) => ({
                text: opt.label,
                value: opt.value,
            })),
            onFilter: (value, record) => record.priority === value,
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags) =>
                tags && tags.length > 0
                    ? tags.map((tag) => (
                        <Tag key={tag} color="purple">
                            {tag}
                        </Tag>
                    ))
                    : "N/A",
        },
        {
            title: "Due Date",
            dataIndex: "due_date",
            key: "due_date",
            render: (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "N/A"),
            sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date),
        },
        {
            title: "Owner",
            dataIndex: "owner_name",
            key: "owner_name",
            render: (owner_name) => owner_name ?? "N/A",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "N/A"),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) =>
                text ? (
                    <Tooltip title={text} placement="topLeft">
                        <span
                            style={{
                                display: "block",
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {text}
                        </span>
                    </Tooltip>
                ) : (
                    "N/A"
                ),
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(record);
                        }}
                        aria-label={`Edit Project ${record.title || record.id}`}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this project?"
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            onDelete(record.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Delete Project ${record.title || record.id}`}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const itemRender = (current, type, originalElement) => {
        return originalElement;
    };

    return (
        <>
            <div
                style={{
                    height: 420,
                    marginTop: 10,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    backgroundColor: "#fafafa",
                }}
                role="region"
                aria-live="polite"
                aria-label="Projects table container"
                tabIndex="0"
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.id}
                    pagination={false}
                    loading={loading}
                    bordered
                    scroll={{ x: 1200, y: 336 }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: "75px 0" }}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No projects found"
                                />
                            </div>
                        ),
                    }}
                    rowClassName={(record) => {
                        if (record.status === "overdue") return "overdue-row";
                        if (record.status === "done") return "done-row";
                        return "";
                    }}
                    aria-label="Projects List Table"
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
                        aria-label="Projects Table Pagination"
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

export default ProjectTable;