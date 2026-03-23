import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const TASK_STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "overdue", label: "Overdue" },
    { value: "hold", label: "Hold" },
];

const TASK_PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

const TASK_TAGS = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "design", label: "Design" },
    { value: "testing", label: "Testing" },
    { value: "devops", label: "DevOps" },
    { value: "urgent", label: "Urgent" },
];

const TaskFormModal = ({ isVisible, editingTask, onCancel, onSubmit, loading, projectDueDate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        if (isVisible && editingTask) {
            form.setFieldsValue({
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority,
                tags: editingTask.tags,
                due_date: editingTask.due_date ? dayjs(editingTask.due_date) : null,
            });
        }
    }, [editingTask, isVisible, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                due_date: values.due_date ? values.due_date.format("YYYY-MM-DD") : null,
            };
            onSubmit(payload, editingTask);
        } catch (info) {
            console.log("Validate Failed:", info);
        }
    };

    const disabledDate = (current) => {
        const today = dayjs().startOf("day");
        const projectEnd = projectDueDate ? dayjs(projectDueDate).endOf("day") : null;
        if (current < today) return true;
        if (projectEnd && current > projectEnd) return true;
        return false;
    };

    return (
        <Modal
            title={editingTask ? `Edit Task: ${editingTask?.title}` : "Create New Task"}
            open={isVisible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Task Title"
                            name="title"
                            rules={[{ required: true, message: "Please input task title!" }]}
                        >
                            <Input placeholder="Enter task title" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Please select status!" }]}
                        >
                            <Select placeholder="Select Status">
                                {TASK_STATUS_OPTIONS.map(({ value, label }) => (
                                    <Option key={value} value={value}>{label}</Option>
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
                                {TASK_PRIORITY_OPTIONS.map(({ value, label }) => (
                                    <Option key={value} value={value}>{label}</Option>
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
                                disabledDate={disabledDate}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Tags" name="tags">
                            <Select placeholder="Select Tags" mode="multiple">
                                {TASK_TAGS.map(({ value, label }) => (
                                    <Option key={value} value={value}>{label}</Option>
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

export default TaskFormModal;