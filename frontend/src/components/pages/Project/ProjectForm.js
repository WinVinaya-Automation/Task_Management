import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";
import {
    PROJECT_TYPE_OPTIONS,
    PROJECT_OWNER,
    STATUS_OPTIONS,
    PRIORITY_OPTIONS,
    PROJECT_TAGS,
} from "../../../constants/projectConstants";

const { Option } = Select;
const { TextArea } = Input;

const ProjectFormModal = ({
    isVisible,
    editingProject,
    onCancel,
    onSubmit,
    loading,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();

        if (isVisible && editingProject) {
            form.setFieldsValue({
                type: editingProject.type,
                title: editingProject.title,
                description: editingProject.description,
                status: editingProject.status,
                priority: editingProject.priority,
                owner_name: editingProject.owner_name,
                tags: editingProject.tags,
                due_date: editingProject.due_date
                    ? dayjs(editingProject.due_date)
                    : null,
            });
        }
    }, [editingProject, isVisible, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                due_date: values.due_date
                    ? values.due_date.format("YYYY-MM-DD")
                    : null,
            };
            onSubmit(payload, editingProject);
        } catch (info) {
            console.log("Validate Failed:", info);
        }
    };

    return (
        <Modal
            title={
                editingProject
                    ? `Edit Project: ${editingProject?.title}`
                    : "Create New Project"
            }
            open={isVisible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            width={700}
            aria-modal="true"
            role="dialog"
        >
            <Form form={form} layout="vertical" aria-label="Project Form">
                <Row gutter={16}>

                    <Col span={12}>
                        <Form.Item
                            label="Project Title"
                            name="title"
                            rules={[{ required: true, message: "Please input project title!" }]}
                        >
                            <Input placeholder="Enter project title" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Project Type"
                            name="type"
                            rules={[{ required: true, message: "Please select project type!" }]}
                        >
                            <Select
                                placeholder="Select Project Type"
                                disabled={!!editingProject}
                            >
                                {PROJECT_TYPE_OPTIONS.map(({ value, label }) => (
                                    <Option key={value} value={value} aria-label={label}>
                                        {label}
                                    </Option>
                                ))}
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
                            label="Priority"
                            name="priority"
                            rules={[{ required: true, message: "Please select priority!" }]}
                        >
                            <Select placeholder="Select Priority">
                                {PRIORITY_OPTIONS.map(({ value, label }) => (
                                    <Option key={value} value={value} aria-label={label}>
                                        {label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Owner"
                            name="owner_name"
                            rules={[{ required: true, message: "Please select owner!" }]}
                        >
                            <Select placeholder="Select an owner">
                                {PROJECT_OWNER.map(({ value, label }) => (
                                    <Option key={value} value={value}>
                                        {label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Due Date"
                            name="due_date"
                            rules={[{ required: true, message: "Please select due date!" }]}
                        >
                            <DatePicker
                                placeholder="Select Due Date"
                                format="DD-MMM-YYYY"
                                disabledDate={(current) =>
                                    current && current.isBefore(dayjs().startOf("day"))
                                }
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Tags" name="tags">
                            <Select placeholder="Select Tags" mode="multiple">
                                {PROJECT_TAGS.map(({ value, label }) => (
                                    <Option key={value} value={value} aria-label={label}>
                                        {label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Description" name="description">
                            <TextArea rows={3} placeholder="Enter description" />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    );
};

export default ProjectFormModal;