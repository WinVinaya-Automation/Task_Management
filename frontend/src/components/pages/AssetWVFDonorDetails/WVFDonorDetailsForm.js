import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd";
import { toast } from "react-toastify";
import { MODAL_DEFAULT_WIDTH } from "../../../constants/assetWVFDonorConstants";

const { Option } = Select;
const { TextArea } = Input;

const WVFDonorDetailsForm = ({
  isModalOpen,
  editingDonor,
  onClose,
  onSubmit,
  loading,
  getAvailableAssets,
  statusOptions,
}) => {
  const [form] = Form.useForm();
  const modalRef = useRef(null);

  // Effect to populate form fields when editingDonor changes (for edit mode)
  useEffect(() => {
    if (editingDonor) {
      form.setFieldsValue({
        ...editingDonor,
        password: "", // Always clear password field when editing for security
      });
    } else {
      form.resetFields(); // Clear all fields for new donor
    }
  }, [editingDonor, form]);

  // Effect to focus the modal when it opens for accessibility
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

  // Handles form submission, including validation
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values); // Call the parent's submit handler (addDonor/updateDonor)
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
      {editingDonor ? "Update" : "Add"}
    </Button>,
  ];

  return (
    <Modal
      title={editingDonor ? "Edit Donor" : "Add New Donor"}
      open={isModalOpen}
      onOk={handleFormSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={MODAL_DEFAULT_WIDTH}
      footer={modalFooter}
      destroyOnClose // Important: ensures form state is reset on modal close
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
                rules={[
                  { required: true, message: "Please select an Asset ID!" },
                ]}
              >
                <Select
                  placeholder="Select asset"
                  disabled={!!editingDonor} // Disable if editing existing record
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
                  {/* If editing, ensure the current asset is an option even if it's already linked */}
                  {editingDonor &&
                    !getAvailableAssets.some(
                      (asset) => asset.assetID === editingDonor.asset_link_id
                    ) && (
                      <Option
                        key={editingDonor.asset_link_id}
                        value={editingDonor.asset_link_id}
                      >
                        {editingDonor.asset_link_id}
                      </Option>
                    )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Receiver Name"
                name="receiver_name"
                rules={[
                  { required: true, message: "Please enter receiver name!" },
                ]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User ID"
                name="new_user_id"
                rules={[{ required: true, message: "Please enter User ID!" }]}
              >
                <Input placeholder="Enter user ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password!" }]}
              >
                <Input placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status!" }]}
              >
                <Select placeholder="Select status">
                  {statusOptions.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Remark" name="remark">
                <TextArea rows={3} placeholder="Additional notes" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default WVFDonorDetailsForm;
