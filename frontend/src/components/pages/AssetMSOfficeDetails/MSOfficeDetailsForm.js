// src/components/MSOfficeDetailsList/MSOfficeDetailsForm.jsx

import React, { useRef, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd"; // Space
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify"; // Directly import toast here for local validation message
import {
  MODAL_WIDTH,
  MAX_USERS_IN_GROUP,
} from "../../../constants/assetMSOfficeConstants";
import "../../../styles/global.css"; // Import global styles for rowClassName
const { Option } = Select;
const { TextArea } = Input;

const MSOfficeDetailsForm = ({
  isModalOpen,
  closeModal,
  handleSubmit,
  loading,
  editingDetail,
  form, // Received form instance from the hook
  getAvailableAssetsForMainLink,
  getAvailableAssetsForUserLink,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const modalFooter = [
    <Button key="cancel" onClick={closeModal}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={loading}
      onClick={handleSubmit}
    >
      {editingDetail ? "Update" : "Add"}
    </Button>,
  ];

  return (
    <Modal
      title={
        editingDetail
          ? `Edit MS Office Detail for: ${editingDetail.asset_link_id}`
          : "Add New MS Office Detail"
      }
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={closeModal}
      confirmLoading={loading}
      width={MODAL_WIDTH}
      footer={modalFooter}
      destroyOnClose // Important to clear form state on close
      maskClosable={false}
      aria-modal="true"
      role="dialog"
    >
      <div tabIndex={-1} ref={modalRef}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="asset_link_id"
                label="Asset Link ID (Main Asset)"
                rules={[
                  {
                    required: true,
                    message: "Please select a main asset!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Main Asset"
                  disabled={!!editingDetail || loading} // Disabled if editing
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const textContent = Array.isArray(option.children)
                      ? option.children
                          .map((child) =>
                            typeof child === "string"
                              ? child
                              : child?.props?.children
                          )
                          .join(" ")
                          .toLowerCase()
                      : String(option.children).toLowerCase();

                    return textContent.includes(input.toLowerCase());
                  }}
                >
                  {getAvailableAssetsForMainLink.map((asset) => (
                    <Option key={asset.assetID} value={asset.assetID}>
                      {asset.assetID}
                      {asset.oldID && (
                        <span className="old-id-text">
                          {" "}
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
                name="ms_office_version"
                label="MS Office Version"
                rules={[
                  {
                    required: true,
                    message: "Please enter MS Office version!",
                  },
                ]}
              >
                <Input placeholder="E.g. Office 2019, Office 365" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="licence_key"
                label="License Key"
                rules={[
                  { required: true, message: "Please enter license key!" },
                ]}
              >
                <Input placeholder="Enter license key" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="main_user_name"
                label="Main User Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter main user name!",
                  },
                ]}
              >
                <Input placeholder="Enter main user name" />
              </Form.Item>
            </Col>
          </Row>

          {editingDetail && ( // Only show this section when editing an existing detail
            <Form.List name="users_group">
              {(fields, { add, remove }) => (
                <>
                  <h5>Additional Users (Max {MAX_USERS_IN_GROUP})</h5>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const availableUserAssets =
                      getAvailableAssetsForUserLink(index);

                    return (
                      <Row gutter={16} key={key} align="bottom">
                        <Col span={11}>
                          <Form.Item
                            {...restField}
                            name={[name, "user_asset_link_id"]}
                            label="User's Asset Link ID"
                            rules={[
                              {
                                required: true,
                                message: "Please select an asset!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select Asset for User"
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) => {
                                const textContent = Array.isArray(
                                  option.children
                                )
                                  ? option.children
                                      .map((child) =>
                                        typeof child === "string"
                                          ? child
                                          : child?.props?.children
                                      )
                                      .join(" ")
                                      .toLowerCase()
                                  : String(option.children).toLowerCase();

                                return textContent.includes(
                                  input.toLowerCase()
                                );
                              }}
                            >
                              {availableUserAssets.map((asset) => (
                                <Option
                                  key={asset.assetID}
                                  value={asset.assetID}
                                >
                                  {asset.assetID}
                                  {asset.oldID && (
                                    <span className="old-id-text">
                                      {" "}
                                      (Old ID: {asset.oldID})
                                    </span>
                                  )}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            label="User Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter user name!",
                              },
                            ]}
                          >
                            <TextArea
                              rows={1}
                              placeholder="Enter user name"
                              maxLength={100}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            aria-label={`Remove user ${index + 1}`}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        if (fields.length < MAX_USERS_IN_GROUP) {
                          add();
                        } else {
                          toast.warn(
                            `You can add a maximum of ${MAX_USERS_IN_GROUP} users per license.`
                          );
                        }
                      }}
                      block
                      icon={<PlusOutlined />}
                      disabled={fields.length >= MAX_USERS_IN_GROUP}
                    >
                      Add User
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="remark" label="Remark">
                <TextArea
                  rows={2}
                  placeholder="Remarks (optional)"
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default MSOfficeDetailsForm;
