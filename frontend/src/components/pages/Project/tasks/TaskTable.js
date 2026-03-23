import React from "react";
import { Table, Space, Button, Tag, Popconfirm, Tooltip, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const TaskTable = ({ data, loading, onEdit, onDelete }) => {
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
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const colorMap = {
                    todo: "blue",
                    in_progress: "orange",
                    done: "green",
                    overdue: "red",
                    hold: "default",
                };
                return (
                    <Tag color={colorMap[status] || "default"}>
                        {status?.replace(/_/g, " ").toUpperCase() || "N/A"}
                    </Tag>
                );
            },
            filters: [
                { text: "Todo", value: "todo" },
                { text: "In Progress", value: "in_progress" },
                { text: "Done", value: "done" },
                { text: "Overdue", value: "overdue" },
                { text: "Hold", value: "hold" },
            ],
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
            filters: [
                { text: "Low", value: "low" },
                { text: "Medium", value: "medium" },
                { text: "High", value: "high" },
            ],
            onFilter: (value, record) => record.priority === value,
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags) =>
                tags && tags.length > 0
                    ? tags.map((tag) => (
                        <Tag key={tag} color="purple">{tag}</Tag>
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
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) =>
                text ? (
                    <Tooltip title={text} placement="topLeft">
                        <span style={{
                            display: "block",
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {text}
                        </span>
                    </Tooltip>
                ) : "N/A",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "N/A"),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
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
                        onClick={() => onEdit(record)}
                        aria-label={`Edit Task ${record.title || record.id}`}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this task?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            aria-label={`Delete Task ${record.title || record.id}`}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            loading={loading}
            bordered
            scroll={{ x: 1200 }}
            locale={{
                emptyText: (
                    <div style={{ padding: "75px 0" }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No tasks found"
                        />
                    </div>
                ),
            }}
            rowClassName={(record) => {
                if (record.status === "overdue") return "overdue-row";
                if (record.status === "done") return "done-row";
                return "";
            }}
        />
    );
};

export default TaskTable;