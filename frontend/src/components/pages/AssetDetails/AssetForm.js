import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import {
  PRODUCT_NAME_OPTIONS,
  STATUS_OPTIONS,
  ASSET_LOCATIONS,
} from "../../../constants/assetConstants";

const { Option } = Select;
const { TextArea } = Input;

const AssetFormModal = ({
  isVisible,
  editingAsset,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingAsset) {
      form.setFieldsValue({
        ...editingAsset,
        purchase_date: editingAsset.purchase_date
          ? dayjs(editingAsset.purchase_date)
          : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ location: "Bengaluru" }); // Set default for new asset
    }
  }, [editingAsset, isVisible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values, editingAsset); // Pass values and editingAsset to parent handler
      // The parent handler will handle closing the modal on success
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title={
        editingAsset ? `Edit Asset: ${editingAsset?.name}` : "Create New Asset"
      }
      open={isVisible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      aria-modal="true"
      role="dialog"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ location: "Bengaluru" }} // Redundant due to useEffect, but can be kept for initial load
        aria-label="Asset Form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Asset Name"
              name="name"
              rules={[{ required: true, message: "Please input asset name!" }]}
            >
              <Select placeholder="Select Asset Name" disabled={!!editingAsset}>
                {PRODUCT_NAME_OPTIONS.map(({ value, label }) => (
                  <Option key={value} value={value} aria-label={label}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Asset Old ID" name="oldID">
              <Input placeholder="Enter asset old ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Asset Brand Name"
              name="brandname"
              rules={[{ required: true, message: "Please input brand name!" }]}
            >
              <Input placeholder="Enter brand name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Asset Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select placeholder="Select Asset Status">
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <Option key={value} value={value} aria-label={label}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Asset Location"
              name="location"
              rules={[{ required: true, message: "Please input location!" }]}
            >
              <Select placeholder="Select a location">
                {ASSET_LOCATIONS.map(({ value, label }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Remarks" name="description">
              <TextArea rows={2} placeholder="Enter description" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AssetFormModal;
