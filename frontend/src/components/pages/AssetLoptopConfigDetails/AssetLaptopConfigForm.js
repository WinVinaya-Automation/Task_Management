import React, { useRef, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd";
import { toast } from "react-toastify"; // Keep toast here for form validation errors
import "../../../styles/global.css"; // Import global styles for rowClassName

const MODAL_WIDTH = 700;
const { Option } = Select;

const AssetLaptopConfigForm = ({
  isModalOpen,
  editingLaptop,
  onClose,
  onSubmit, // Function to call on form submission (add/update)
  loading,
  getAvailableAssets, // Assets available for selection in the dropdown
  allLaptops, // All laptops data needed for custom validation (asset_link_id uniqueness)
}) => {
  const [form] = Form.useForm();
  const modalRef = useRef(null);

  // Effect to populate form fields when editingLaptop changes (for edit mode)
  // or reset when adding a new one
  useEffect(() => {
    if (editingLaptop) {
      form.setFieldsValue(editingLaptop);
    } else {
      form.resetFields(); // Clear all fields for new configuration
    }
  }, [editingLaptop, form]);

  // Effect to focus the modal when it opens for accessibility
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  // Handles form submission, including validation and custom checks
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields(); // Ant Design's built-in validation

      // Custom validation: Check for asset_link_id conflict ONLY when adding a new laptop
      if (!editingLaptop) {
        const isConflict = allLaptops.some(
          (item) => item.asset_link_id === values.asset_link_id
        );
        if (isConflict) {
          toast.error(
            "This asset is already linked to a laptop configuration."
          );
          // Set validation error on the field
          form.setFields([
            {
              name: "asset_link_id",
              errors: ["This asset is already linked."],
            },
          ]);
          return; // Stop submission if conflict found
        }
      }

      onSubmit(values); // Call the parent's submit handler (addLaptop/updateLaptop)
    } catch (error) {
      if (error.errorFields) {
        console.log("Form validation failed:", error.errorFields);
        toast.error("Please fill in all required fields correctly.");
      } else {
        // This catch is for other potential errors during validation or submission logic
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
      {editingLaptop ? "Update" : "Add"}
    </Button>,
  ];

  return (
    <Modal
      title={editingLaptop ? "Edit Configuration" : "Add Configuration"}
      open={isModalOpen}
      onOk={handleFormSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={MODAL_WIDTH}
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
                name="asset_link_id"
                label="Asset Link ID"
                rules={[{ required: true, message: "Please select an asset" }]}
              >
                <Select
                  placeholder="Select asset"
                  disabled={!!editingLaptop} // Disable if editing an existing record
                  showSearch
                  filterOption={(input, option) => {
                    // option.children is an array: [assetID_text_node, oldID_span_node]
                    const assetIDText = String(
                      option.children[0] || ""
                    ).toLowerCase();
                    const oldIDText = String(
                      option.children[2]?.props?.children || ""
                    ).toLowerCase(); // Check index for oldID text inside span

                    return (
                      assetIDText.includes(input.toLowerCase()) ||
                      oldIDText.includes(input.toLowerCase())
                    );
                  }}
                >
                  {getAvailableAssets.map((asset) => (
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
                name="model_name"
                label="Model Name"
                rules={[{ required: true, message: "Please enter model name" }]}
              >
                <Input placeholder="Enter model name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="processor_generation"
                label="Processor Generation"
                rules={[
                  {
                    required: true,
                    message: "Please enter processor generation",
                  },
                ]}
              >
                <Input placeholder="Enter processor generation" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bandwidth"
                label="Bandwidth"
                rules={[{ required: true, message: "Please enter bandwidth" }]}
              >
                <Input placeholder="Enter bandwidth" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="graphics_card"
                label="Graphics Card"
                rules={[
                  {
                    required: true,
                    message: "Please enter graphics card details",
                  },
                ]}
              >
                <Input placeholder="Enter graphics card details" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ram"
                label="RAM"
                rules={[{ required: true, message: "Please enter RAM size" }]}
              >
                <Input placeholder="Enter RAM size" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ram_type"
                label="RAM Type"
                rules={[{ required: true, message: "Please enter RAM type" }]}
              >
                <Input placeholder="Enter RAM type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rom"
                label="ROM"
                rules={[{ required: true, message: "Please enter ROM size" }]}
              >
                <Input placeholder="Enter ROM size" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rom_type"
                label="ROM Type"
                rules={[{ required: true, message: "Please enter ROM type" }]}
              >
                <Input placeholder="Enter ROM type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="os_details"
                label="OS Details"
                rules={[{ required: true, message: "Please enter OS details" }]}
              >
                <Input placeholder="Enter OS details" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="remark" label="Remark">
                <Input.TextArea rows={3} placeholder="Enter remarks" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AssetLaptopConfigForm;
