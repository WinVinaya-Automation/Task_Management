import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  // Tag,
  Popconfirm,
  Modal,
  Form,
  Input,
  // Select,
  Row,
  Col,
  Pagination,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  // SearchOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const { Option } = Select;
const { Search } = Input;

const InfoDetails = () => {
  const [infoList, setInfoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const total = "";

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const response = await api.get("/info-api/get");
      const reversedData = [...response.data].reverse();
      setInfoList(reversedData);
      setFilteredList(reversedData);
    } catch (error) {
      toast.error("Failed to load info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    const searchValue = searchText.trim().toLowerCase();
    if (!searchValue) {
      setFilteredList(infoList);
      setCurrentPage(1);
      return;
    }

    const filtered = infoList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue)
      )
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchText, infoList]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/info-api/delete/${id}`);
      setInfoList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (info) => {
    setEditingInfo(info);
    form.setFieldsValue(info);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingInfo(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingInfo) {
        await api.put(`/info-api/put/${editingInfo.id}`, values);
        toast.success("Updated successfully!");
      } else {
        await api.post("/info-api/post", values);
        toast.success("Created successfully!");
      }

      await fetchInfo();
      handleModalCancel();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Please fill all required fields."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Thing",
      dataIndex: "things",
      key: "things",
      sorter: (a, b) => a.things?.localeCompare(b.things),
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person_name",
      key: "contact_person_name",
      sorter: (a, b) =>
        a.contact_person_name?.localeCompare(b.contact_person_name),
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
      render: (text) => (text ? `+91 ${text}` : "N/A"),
    },
    {
      title: "Second Contact",
      dataIndex: "sec_contact_number",
      key: "sec_contact_number",
      render: (text) => (text ? `+91 ${text}` : "N/A"),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => <span title={text}>{text || "N/A"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            aria-label={`Edit ${record.things || "record"}`}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            aria-label="Confirm record deletion"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete ${record.things || "record"}`}
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
  const startIdx = (currentPage - 1) * pageSize;
  const currentData = filteredList.slice(startIdx, startIdx + pageSize);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      role="main"
    >
      <main
        style={{
          marginTop: 5,
          flex: 1,
          paddingBottom: 5,
          width: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 20px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "35px", fontWeight: 600 }}>
            Info Details
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <Search
              placeholder="Search by Value"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              aria-label="Search Info"
              enterButton
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              aria-label="Add Info"
            >
              Add Info
            </Button>
          </div>
        </div>

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
          aria-label="Info table container"
          tabIndex="0"
        >
          <Table
            columns={columns}
            dataSource={currentData}
            rowKey="id"
            pagination={false}
            loading={loading}
            bordered
            scroll={{ y: 296 }}
            locale={{
              emptyText: (
                <div style={{ padding: "75px 0" }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No info found"
                  />
                </div>
              ),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "even-row" : "odd-row"
            }
            aria-label="Info List Table"
            role="table"
          />
        </div>

        {filteredList.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              maxWidth: 1200,
              margin: "10px auto 0",
            }}
          >
            {/* <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredList.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              size="small"
              aria-label="Info Table Pagination"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            /> */}
            <Pagination
              aria-label="Info Details Table Pagination"
              current={currentPage}
              pageSize={pageSize}
              total={filteredList.length}
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

        <Modal
          title={
            editingInfo ? `Edit Info: ${editingInfo.things}` : "Add New Info"
          }
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={700}
          aria-modal="true"
          role="dialog"
        >
          <Form layout="vertical" form={form} aria-label="Info Form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="things"
                  label="Thing Name"
                  rules={[
                    { required: true, message: "Please enter thing name" },
                  ]}
                >
                  <Input placeholder="Enter thing name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contact_person_name"
                  label="Contact Person Name"
                  rules={[
                    { required: true, message: "Please enter person name" },
                  ]}
                >
                  <Input placeholder="Enter contact person name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contact_number"
                  label="Contact Number"
                  rules={[
                    { required: true, message: "Please enter contact number" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Contact number must be 10 digits only",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter contact number"
                    addonBefore="+91"
                    maxLength={10}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ contact_number: onlyNums });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sec_contact_number"
                  label="Second Contact Number"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (/^[0-9]{10}$/.test(value)) return Promise.resolve();
                        return Promise.reject("Must be 10 digits only");
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter contact number (optional)"
                    addonBefore="+91"
                    maxLength={10}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ sec_contact_number: onlyNums });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="remark" label="Remark">
              <Input.TextArea
                rows={3}
                placeholder="Enter the Remark (optional)"
              />
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
};

export default InfoDetails;
