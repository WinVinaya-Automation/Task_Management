import React, { useState } from "react";
import { Button, Input } from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    DownloadOutlined,
} from "@ant-design/icons";

import useProjectManagement from "../../../hooks/useProjectManagement";
import ProjectTable from "./ProjectsTable";
import ProjectFormModal from "./ProjectForm";
import ProjectImportModal from "./ProjectImportModal";

import { showSuccessToast, showErrorToast } from "../../../utils/notification";

const { Search } = Input;

const ProjectsList = () => {
    const {
        projects,
        totalProjects,
        loading,
        setSearchProject,
        currentPage,
        setCurrentPage,
        pageSize,
        handleDelete,
        handleSaveProject,
        fetchProjects,
    } = useProjectManagement();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);

    const handleExport = async () => {
        try {
            const response = await fetch(
                `${window.location.protocol}//${window.location.hostname}:5000/project-api/export-projects`
            );
            if (!response.ok) {
                throw new Error("Export failed");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "projects_export.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSuccessToast("Export successful");
        } catch (error) {
            console.error("Export failed:", error);
            showErrorToast("Export failed");
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingProject(null);
    };

    const handleFormSubmit = async (values, projectToEdit) => {
        const success = await handleSaveProject(values, projectToEdit);
        if (success) {
            handleModalCancel();
        }
    };

    return (
        <div
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
            role="main"
        >
            <main
                style={{
                    marginTop: 5,
                    flex: 1,
                    paddingBottom: 5,
                    width: 1200,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 20px",
                        flexWrap: "wrap",
                        gap: "8px",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "35px", fontWeight: 600 }}>
                        All Projects
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            flexWrap: "wrap",
                        }}
                    >
                        <Search
                            placeholder="Search projects"
                            allowClear
                            onChange={(e) => setSearchProject(e.target.value)}
                            style={{ width: 250 }}
                            aria-label="Search Projects"
                            enterButton
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditingProject(null);
                                setIsModalVisible(true);
                            }}
                            aria-label="Add Project"
                        >
                            Add Project
                        </Button>

                        {/* <Button
                            icon={<UploadOutlined />}
                            onClick={() => setShowImportModal(true)}
                            aria-label="Import CSV"
                        >
                            Import
                        </Button>

                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            disabled={projects.length === 0}
                            aria-label="Export CSV"
                        >
                            Export
                        </Button> */}
                    </div>
                </div>

                <ProjectTable
                    data={projects}
                    total={totalProjects}
                    loading={loading}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <ProjectFormModal
                    isVisible={isModalVisible}
                    editingProject={editingProject}
                    onCancel={handleModalCancel}
                    onSubmit={handleFormSubmit}
                    loading={loading}
                />

                <ProjectImportModal
                    visible={showImportModal}
                    onClose={(shouldRefresh) => {
                        setShowImportModal(false);
                        if (shouldRefresh) {
                            setCurrentPage(1);
                            fetchProjects();
                        }
                    }}
                />
            </main>
        </div>
    );
};

export default ProjectsList;