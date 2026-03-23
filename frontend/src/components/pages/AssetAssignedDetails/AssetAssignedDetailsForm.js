// src/components/pages/AssetAssign/AssetAssignedDetailsFormModal.js
import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button } from "antd";
import dayjs from "dayjs";
import {
  MODAL_WIDTH,
  ROLE_CONFIG,
  ROLE_OPTIONS,
} from "../../../constants/assetAssignedConstants";
import "../../../styles/global.css"; // Import global styles for rowClassName

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AssetAssignedDetailsFormModal = ({
  isModalOpen,
  editingRecord,
  loading,
  closeModal,
  handleFormSubmit,
  handleRoleChange, // Pass this down from the hook
  getAvailableAssets, // Pass available assets from the hook
  role, // Pass the current selected role state from the hook
}) => {
  const [form] = Form.useForm();
  const modalRef = useRef(null);

  // Effect to initialize form fields when modal opens or editingRecord changes
  useEffect(() => {
    if (editingRecord) {
      const {
        batch_start_date,
        batch_end_date,
        role: recordRole,
        ...rest
      } = editingRecord;
      form.setFieldsValue({
        ...rest,
        role: recordRole,
        dateRange: [
          batch_start_date ? dayjs(batch_start_date) : null,
          batch_end_date ? dayjs(batch_end_date) : null,
        ],
      });
      // The role state in the hook should also be updated when initializing form
      // This is handled in useAssignedAssetManagement's openModal.
    } else {
      form.resetFields(); // Clear all fields for new assignment
    }
  }, [editingRecord, isModalOpen, form]); // Added `form` to dependencies

  // Effect to focus the modal for accessibility
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  // Get the current role's configuration for dynamic rendering
  // Use 'others' as a fallback if role is empty or invalid
  const currentRoleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.others;

  // Handle modal OK button click
  const handleOk = async () => {
    // Pass the form instance and editingRecord to the parent handler
    const success = await handleFormSubmit(form.getFieldsValue(true), form); // Pass true to get all fields including hidden ones
    if (success) {
      // Parent `handleFormSubmit` will close modal on success
    }
  };

  // Modal Footer Buttons
  const modalFooter = [
    <Button key="cancel" onClick={closeModal}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={loading}
      onClick={handleOk} // Call handleOk which validates and then calls handleFormSubmit
    >
      {editingRecord ? "Update" : "Assign"}
    </Button>,
  ];

  return (
    <Modal
      title={editingRecord ? "Edit Assignment" : "Assign Asset"}
      open={isModalOpen}
      onOk={handleOk} // Use handleOk directly
      onCancel={closeModal}
      confirmLoading={loading}
      width={MODAL_WIDTH}
      footer={modalFooter}
      destroyOnClose // Important: ensures form state is reset on modal close
    >
      <div ref={modalRef} tabIndex={-1} aria-modal="true" role="dialog">
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="asset_link_id"
                label="Asset Link ID"
                rules={[{ required: true, message: "Please select an asset" }]}
              >
                <Select
                  showSearch
                  disabled={!!editingRecord} // Disable if editing an existing record
                  placeholder="Select asset"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
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
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select role" }]}
              >
                <Select
                  placeholder="Select role"
                  onChange={(value) => handleRoleChange(value, form)} // Pass form instance to hook handler
                  allowClear
                >
                  {ROLE_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Conditionally render Assigned To field */}
            {currentRoleConfig.showAssignedTo && (
              <Col span={12}>
                <Form.Item
                  name="assigned_to"
                  label="Assigned To"
                  rules={[
                    {
                      required: currentRoleConfig.showAssignedTo,
                      message: "Please enter assignee",
                    },
                  ]}
                >
                  <Input placeholder="Enter person or department name" />
                </Form.Item>
              </Col>
            )}

            {/* Conditionally render Student Name field */}
            {currentRoleConfig.showStudentName && (
              <Col span={12}>
                <Form.Item
                  name="student_name"
                  label="Student Name"
                  rules={[
                    {
                      required: currentRoleConfig.showStudentName,
                      message: "Please enter student name",
                    },
                  ]}
                >
                  <Input placeholder="Enter student name" />
                </Form.Item>
              </Col>
            )}

            {/* Conditionally render Batch Name field */}
            {currentRoleConfig.showBatchName && (
              <Col span={12}>
                <Form.Item
                  name="batch_name"
                  label="Batch Name"
                  rules={[
                    {
                      required: currentRoleConfig.showBatchName,
                      message: "Please enter batch name",
                    },
                  ]}
                >
                  <Input placeholder="Enter batch name" />
                </Form.Item>
              </Col>
            )}

            {/* Conditionally render Batch Dates field */}
            {currentRoleConfig.showBatchDates && (
              <Col span={12}>
                <Form.Item
                  name="dateRange"
                  label="Batch Dates"
                  rules={[
                    {
                      required: currentRoleConfig.showBatchDates,
                      message: "Please select both batch start and end dates",
                    },
                  ]}
                >
                  <RangePicker className="range-picker" />
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item name="remark" label="Remark">
                <TextArea rows={3} placeholder="Enter remarks" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AssetAssignedDetailsFormModal;
