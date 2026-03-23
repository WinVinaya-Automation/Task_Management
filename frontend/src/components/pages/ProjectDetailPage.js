import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Spin, message } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../services/api";
import TaskTable from "./Project/tasks/TaskTable";
import TaskFormModal from "./Project/tasks/TaskFormModal";

const { Title } = Typography;

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/project-api/get/${id}`);
            setProject(res.data);
        } catch {
            messageApi.error("Failed to load project.");
        }
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/task-api/get/project/${id}`);
            setTasks(res.data);
        } catch {
            messageApi.error("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [id]);

    const handleSubmit = async (values, task) => {
        setSubmitting(true);
        try {
            if (task) {
                await api.put(`/task-api/put/${task.id}`, values);
                messageApi.success("Task updated successfully!");
            } else {
                await api.post(`/task-api/post`, { ...values, project_id: parseInt(id) });
                messageApi.success("Task created successfully!");
            }
            setModalVisible(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            messageApi.error(
                error.response?.data?.error || "Failed to save task."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setModalVisible(true);
    };

    const handleDelete = async (taskId) => {
        try {
            await api.delete(`/task-api/delete/${taskId}`);
            messageApi.success("Task deleted successfully!");
            fetchTasks();
        } catch {
            messageApi.error("Failed to delete task.");
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingTask(null);
    };

    if (!project) return <Spin style={{ marginTop: 100, display: "block" }} />;

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/project-list")}
                style={{ marginBottom: 16 }}
            >
                Back to Projects
            </Button>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Project: {project.title} Tasks
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                >
                    Add Task
                </Button>
            </div>

            <TaskTable
                data={tasks}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <TaskFormModal
                isVisible={modalVisible}
                editingTask={editingTask}
                onCancel={handleModalClose}
                onSubmit={handleSubmit}
                loading={submitting}
                projectDueDate={project.due_date}
            />
        </div>
    );
};

export default ProjectDetailPage;