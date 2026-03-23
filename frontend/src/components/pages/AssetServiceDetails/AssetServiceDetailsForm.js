import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd";
import { toast } from "react-toastify";
// --- Import constant ---
import { MODAL_DEFAULT_WIDTH } from "../../../constants/assetServiceConstants";

const { Option } = Select;

const AssetServiceDetailsForm = ({
  isModalOpen,
  editingService,
  onClose,
  onSubmit,
  loading,
  getAvailableAssets,
  statusOptions,
  serviceStatusOptions,
}) => {
  const [form] = Form.useForm();
  const modalRef = useRef(null);

  useEffect(() => {
    if (editingService) {
      form.setFieldsValue(editingService);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Open" });
    }
  }, [editingService, form]);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector(
          "input, select, textarea"
        );
        firstInput?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      if (error.errorFields) {
        console.log("Form validation failed:", error.errorFields);
        toast.error("Please fill in all required fields correctly.");
      } else {
        console.error("Form submission error:", error);
      }
    }
  };

  const modalFooter = [
    <Button key="cancel" onClick={onClose}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={loading}
      onClick={handleFormSubmit}
    >
      {editingService ? "Update" : "Add"}
    </Button>,
  ];

  return (
    <Modal
      title={
        editingService
          ? `Edit Service Detail: ${editingService?.asset_link_id}`
          : "Create New Service Detail"
      }
      open={isModalOpen}
      onOk={handleFormSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={MODAL_DEFAULT_WIDTH}
      footer={modalFooter}
      destroyOnClose
      aria-modal="true"
      role="dialog"
    >
      <div ref={modalRef} tabIndex={-1}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Asset ID"
                name="asset_link_id"
                rules={[{ required: true, message: "Please select asset ID!" }]}
              >
                <Select
                  placeholder="Select Asset ID"
                  disabled={!!editingService}
                  showSearch
                  filterOption={(input, option) =>
                    String(option.children || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {getAvailableAssets.map((asset) => (
                    <Option key={asset.assetID} value={asset.assetID}>
                      {asset.assetID}
                    </Option>
                  ))}
                  {editingService &&
                    !getAvailableAssets.some(
                      (asset) => asset.assetID === editingService.asset_link_id
                    ) && (
                      <Option
                        key={editingService.asset_link_id}
                        value={editingService.asset_link_id}
                      >
                        {editingService.asset_link_id}
                      </Option>
                    )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status!" }]}
              >
                <Select placeholder="Select Status">
                  {statusOptions.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Issue Description"
                name="issue_description"
                rules={[
                  {
                    required: true,
                    message: "Please input issue description!",
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter issue description"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Service Status"
                name="service_status"
                rules={[
                  {
                    required: true,
                    message: "Please select service status!",
                  },
                ]}
              >
                <Select placeholder="Select Service Status">
                  {serviceStatusOptions.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Remark" name="remark">
                <Input placeholder="Enter remark" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AssetServiceDetailsForm;
