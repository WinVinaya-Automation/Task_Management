// src/components/pages/AssetDonorDetails/AssetDonorDetailsFormModal.js
import React from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd";
import {
  MODAL_WIDTH,
  STATUS_OPTIONS,
} from "../../../constants/assetDonorConstants"; // Import constants
import "../../../styles/global.css"; // Import global styles for rowClassName

const { Option } = Select;

const AssetDonorDetailsFormModal = ({
  isModalOpen,
  editingDonor,
  loading,
  closeModal,
  handleFormSubmit, // This is handleSubmit from the hook
  form, // The form instance from the hook
  modalRef, // Ref for accessibility from the hook
  getAvailableAssets, // Function from the hook
}) => {
  // Modal Footer Buttons
  const modalFooter = [
    <Button key="cancel" onClick={closeModal}>
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
      title={
        editingDonor
          ? `Edit Donor: ${editingDonor?.donor_name || ""}`
          : "Add New Donor"
      }
      open={isModalOpen}
      onOk={handleFormSubmit} // This will trigger form validation and submission
      onCancel={closeModal}
      confirmLoading={loading}
      width={MODAL_WIDTH}
      footer={modalFooter}
      destroyOnClose // Important: ensures form state is reset on modal close
      aria-modal="true"
      role="dialog"
    >
      {/* TabIndex for accessibility when modal opens */}
      <div ref={modalRef} tabIndex={-1}>
        <Form form={form} layout="vertical" aria-label="Donor Form">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="asset_link_id"
                label="Asset ID"
                rules={[{ required: true, message: "Please select an asset!" }]}
              >
                <Select
                  placeholder="Select Asset"
                  disabled={!!editingDonor} // Disable if editing an existing record
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    // Filter logic for Asset ID and Old ID
                    const assetIDText = String(
                      option.children[0] || ""
                    ).toLowerCase();
                    const oldIDText = String(
                      option.children[2]?.props?.children || ""
                    ).toLowerCase();

                    return (
                      assetIDText.includes(input.toLowerCase()) ||
                      oldIDText.includes(input.toLowerCase())
                    );
                  }}
                  aria-label="Asset selection"
                >
                  {getAvailableAssets().map((asset) => (
                    <Option key={asset.assetID} value={asset.assetID}>
                      {asset.assetID}{" "}
                      {asset.oldID && (
                        <span className="old-id-text">
                          (Old ID: {asset.oldID})
                        </span>
                      )}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="donor_name"
                label="Donor Name"
                rules={[
                  { required: true, message: "Please input donor name!" },
                ]}
              >
                <Input placeholder="Enter donor name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status!" }]}
              >
                <Select placeholder="Select Status">
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Remark" name="remark">
                <Input.TextArea rows={3} placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AssetDonorDetailsFormModal;
