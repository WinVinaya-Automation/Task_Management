import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import {
  FaDatabase,
  FaClipboardList,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPauseCircle,
  FaSpinner,
} from "react-icons/fa";

const BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000`;

function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Projects
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectTodo, setProjectTodo] = useState(0);
  const [projectInProgress, setProjectInProgress] = useState(0);
  const [projectDone, setProjectDone] = useState(0);
  const [projectOverdue, setProjectOverdue] = useState(0);
  const [projectHold, setProjectHold] = useState(0);

  // Tasks
  const [totalTasks, setTotalTasks] = useState(0);
  const [taskTodo, setTaskTodo] = useState(0);
  const [taskInProgress, setTaskInProgress] = useState(0);
  const [taskDone, setTaskDone] = useState(0);
  const [taskOverdue, setTaskOverdue] = useState(0);
  const [taskHold, setTaskHold] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get(`${BASE_URL}/project-api/get`),
          axios.get(`${BASE_URL}/task-api/get`),
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        setTotalProjects(projects.length);
        setProjectTodo(projects.filter((p) => p.status === "todo").length);
        setProjectInProgress(projects.filter((p) => p.status === "in_progress").length);
        setProjectDone(projects.filter((p) => p.status === "done").length);
        setProjectOverdue(projects.filter((p) => p.status === "overdue").length);
        setProjectHold(projects.filter((p) => p.status === "hold").length);

        setTotalTasks(tasks.length);
        setTaskTodo(tasks.filter((t) => t.status === "todo").length);
        setTaskInProgress(tasks.filter((t) => t.status === "in_progress").length);
        setTaskDone(tasks.filter((t) => t.status === "done").length);
        setTaskOverdue(tasks.filter((t) => t.status === "overdue").length);
        setTaskHold(tasks.filter((t) => t.status === "hold").length);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectCards = [
    {
      title: "Total Projects",
      count: totalProjects,
      icon: <FaDatabase size={20} />,
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Projects Todo",
      count: projectTodo,
      icon: <FaClipboardList size={20} />,
      bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      title: "Projects In Progress",
      count: projectInProgress,
      icon: <FaSpinner size={20} />,
      bg: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    },
    {
      title: "Projects Done",
      count: projectDone,
      icon: <FaCheckCircle size={20} />,
      bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "Projects Overdue",
      count: projectOverdue,
      icon: <FaExclamationTriangle size={20} />,
      bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
    },
    {
      title: "Projects On Hold",
      count: projectHold,
      icon: <FaPauseCircle size={20} />,
      bg: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    },
  ];

  const taskCards = [
    {
      title: "Total Tasks",
      count: totalTasks,
      icon: <FaTasks size={20} />,
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Tasks Todo",
      count: taskTodo,
      icon: <FaClipboardList size={20} />,
      bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      title: "Tasks In Progress",
      count: taskInProgress,
      icon: <FaSpinner size={20} />,
      bg: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    },
    {
      title: "Tasks Done",
      count: taskDone,
      icon: <FaCheckCircle size={20} />,
      bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "Tasks Overdue",
      count: taskOverdue,
      icon: <FaExclamationTriangle size={20} />,
      bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
    },
    {
      title: "Tasks On Hold",
      count: taskHold,
      icon: <FaPauseCircle size={20} />,
      bg: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    },
  ];

  const renderCards = (cards) =>
    cards.map((card, index) => (
      <Col xs={12} sm={6} md={4} lg={2} className="mb-3" key={index}>
        <Card
          className="text-white text-center shadow border-0"
          style={{
            background: card.bg,
            borderRadius: "1rem",
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Card.Body>
            <div style={{ marginBottom: "15px" }}>{card.icon}</div>
            <Card.Title style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {card.title}
            </Card.Title>
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              <h2 style={{ fontSize: "2rem", margin: 0 }}>{card.count}</h2>
            )}
          </Card.Body>
        </Card>
      </Col>
    ));

  return (
    <div className="dashboard-wrapper">
      <h1
        style={{
          marginTop: 0,
          paddingTop: 0,
          marginBottom: 0,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Dashboard
      </h1>

      <main
        className="dashboard-content"
        style={{ paddingTop: "0px", paddingBottom: "0px" }}
      >
        <Container fluid>
          <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Projects</h4>
          <Row className="g-3">{renderCards(projectCards)}</Row>

          <h4 style={{ fontWeight: 600, marginTop: 24, marginBottom: 16 }}>Tasks</h4>
          <Row className="g-3">{renderCards(taskCards)}</Row>
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;