import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Pagination,
  Empty,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../services/api";
import "../../styles/global.css";

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 6;
  const total = "";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-api/get");
      setUsers(res.data.reverse());
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user-api/delete/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setEditingUser(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // Update existing user role only
        await api.patch(`/user-api/update-role/${editingUser.id}`, {
          role: values.role,
        });
        toast.success("Role updated successfully");
      } else {
        // Create new user with all details
        await api.post("/user-api/post", {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        toast.success("User created successfully");
      }

      fetchUsers();
      handleModalCancel();
    } catch (error) {
      toast.error("Failed to save user");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const startIdx = (currentPage - 1) * pageSize;
  const currentData = filteredUsers.slice(startIdx, startIdx + pageSize);

  const columns = [
    {
      title: "Sl. No",
      render: (_, __, index) => startIdx + index + 1,
      width: 30,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 80,
      render: (role) => (
        <span style={{ textTransform: "capitalize" }}>{role}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            aria-label={`Edit ${record.username}`}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete ${record.username}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
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
    <div className="page-container">
      <main className="page-content-wrapper">
        {/* Header with Add User button and Search */}
        <div className="header-section">
          <h1 className="header-title">All Users</h1>
          <div className="header-controls">
            <Search
              placeholder="Search username"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
              enterButton
              aria-label="Search users"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              aria-label="Add new user"
            >
              Add User
            </Button>
          </div>
        </div>

        {/* User Table */}
        <div className="table-container" role="region" aria-label="User table">
          <Table
            rowKey="id"
            dataSource={currentData}
            columns={columns}
            loading={loading}
            pagination={false}
            bordered
            scroll={{ y: 320 }}
            locale={{
              emptyText: (
                <div className="table-empty-text">
                  <Empty description="No users found" />
                </div>
              ),
            }}
          />
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="pagination-container">
            {/* <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} users`
              }
            /> */}
            <Pagination
              aria-label="User Details Table Pagination"
              current={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
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

        {/* Modal for Add/Edit User */}
        <Modal
          title={editingUser ? "Edit User Role" : "Add User"}
          open={isModalVisible}
          onCancel={handleModalCancel}
          onOk={handleSaveUser}
          okText={editingUser ? "Update" : "Create"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter username" },
                { min: 3, message: "Username must be at least 3 characters" },
              ]}
            >
              <Input disabled={!!editingUser} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input disabled={!!editingUser} />
            </Form.Item>
            {!editingUser && (
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="employee">Employee</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
};

export default UserManagement;
