// src/hooks/useProjectManagement.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/notification";
import dayjs from "dayjs";
import { DEFAULT_PAGE_SIZE } from "../constants/projectConstants";

const useProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchProject, setSearchProject] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = DEFAULT_PAGE_SIZE;

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/project-api/get");
            const reversedProjects = [...response.data].reverse();
            setProjects(reversedProjects);
            setFilteredProjects(reversedProjects);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            showErrorToast("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        const searchText = searchProject.trim().toLowerCase();
        if (!searchText) {
            setFilteredProjects(projects);
            setCurrentPage(1);
            return;
        }

        const filtered = projects.filter((project) =>
            [
                "name",
                "title",
                "description",
                "status",
                "priority",
                "owner_id",
            ].some((key) =>
                project[key]?.toString().toLowerCase().includes(searchText)
            )
        );

        setFilteredProjects(filtered);
        setCurrentPage(1);
    }, [searchProject, projects]);

    const handleDelete = useCallback(async (id) => {
        try {
            await api.delete(`/project-api/delete/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            showSuccessToast("Project deleted successfully!");
        } catch (error) {
            console.error("Failed to delete project:", error);
            showErrorToast("Failed to delete project");
        }
    }, []);

    const handleSaveProject = useCallback(
        async (values, editingProject) => {
            setLoading(true);
            try {
                const formatted = {
                    ...values,
                    due_date: values.due_date
                        ? dayjs(values.due_date).format("YYYY-MM-DD")
                        : null,
                };

                if (editingProject) {
                    await api.put(`/project-api/put/${editingProject.id}`, formatted);
                    showSuccessToast("Project updated successfully!");
                } else {
                    const response = await api.post("/project-api/post", formatted);
                    const newProjectId = response.data?.id || "Unknown";
                    showSuccessToast(
                        <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                            Project has been added successfully. The Project ID is{" "}
                            <b>{newProjectId}</b>
                        </div>,
                        {
                            style: {
                                minWidth: "300px",
                                maxWidth: "600px",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                            },
                        }
                    );
                }
                await fetchProjects();
                return true;
            } catch (err) {
                console.error("Error saving project:", err);
                showErrorToast(
                    err.response?.data?.message || "Please fill all required fields."
                );
                return false;
            } finally {
                setLoading(false);
            }
        },
        [fetchProjects]
    );

    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return {
        projects: paginatedProjects,
        totalProjects: filteredProjects.length,
        loading,
        searchProject,
        setSearchProject,
        currentPage,
        setCurrentPage,
        pageSize,
        handleDelete,
        handleSaveProject,
        fetchProjects,
    };
};

export default useProjectManagement;  // ← this line must exist