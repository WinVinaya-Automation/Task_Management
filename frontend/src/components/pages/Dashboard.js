import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import {
  FaDatabase,
  // FaUsers,
  // FaCheckCircle,
  // FaExclamationTriangle,
  FaClipboardList,
  // FaUndoAlt,
  // FaBuilding,
  // FaListAlt,
  FaUserTie,
  FaLaptop,
  FaWalking,
  FaDesktop,
  // FaOtter,
  FaBars,
  FaDoorOpen,
} from "react-icons/fa";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  // State variables for metrics
  const [assetCount, setAssetCount] = useState(0);
  const [laptopsCount, setLaptopsCount] = useState(0);
  const [desktopsCount, setDesktopsCount] = useState(0);
  const [othersCount, setOthersCount] = useState(0);
  const [inServiceCount, setInServiceCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [assignedAssetsCount, setAssignedAssetsCount] = useState(0);
  const [reciverCount, setReciverCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAssetsRes = await axios.get(
          // "http://localhost:5000/asset-api/get"
          `${window.location.protocol}//${window.location.hostname}:5000` +
            "/asset-api/get"
        );
        const allAssets = allAssetsRes.data;

        // Set total asset count
        setAssetCount(allAssets.length);

        // Filter for laptops from the fetched data
        const laptopAssets = allAssets.filter(
          (asset) => asset.name === "Laptop"
        );
        setLaptopsCount(laptopAssets.length);

        const desktopAssets = allAssets.filter(
          (asset) => asset.name === "Desktop"
        );
        setDesktopsCount(desktopAssets.length);

        const otherAssets = allAssets.filter(
          (asset) => asset.name !== "Desktop" && asset.name !== "Laptop"
        );
        setOthersCount(otherAssets.length);

        const inServiceRes = await axios.get(
          // "http://localhost:5000/service-api/get"
          `${window.location.protocol}//${window.location.hostname}:5000` +
            "/service-api/get"
        );
        setInServiceCount(inServiceRes.data.length);

        const assignedRes = await axios.get(
          // "http://localhost:5000/assigned-api/get"
          `${window.location.protocol}//${window.location.hostname}:5000` +
            "/assigned-api/get"
        );
        setAssignedAssetsCount(assignedRes.data.length);

        const donerRes = await axios.get(
          // "http://localhost:5000/donor-api/get"
          `${window.location.protocol}//${window.location.hostname}:5000` +
            "/donor-api/get"
        );
        setDonorCount(donerRes.data.length);

        const wvfDonerRes = await axios.get(
          // "http://localhost:5000/wvf-donor-api/get"
          `${window.location.protocol}//${window.location.hostname}:5000` +
            "/wvf-donor-api/get"
        );
        setReciverCount(wvfDonerRes.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Assets",
      count: assetCount,
      icon: <FaDatabase size={40} />,
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Number of Laptops Assets",
      count: laptopsCount,
      icon: <FaLaptop size={40} />,
      bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      title: "Number of Desktop Assets",
      count: desktopsCount,
      icon: <FaDesktop size={40} />,
      bg: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    },
    {
      title: "Number of Other Assets",
      count: othersCount,
      icon: <FaBars size={40} />,
      bg: "linear-gradient(135deg,rgb(39, 169, 229) 0%,rgb(18, 117, 179) 100%)",
    },
    {
      title: "Number of Assets in Service",
      count: inServiceCount,
      icon: <FaClipboardList size={40} />,
      bg: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
    },
    {
      title: "Number of Assets in Use",
      count: assignedAssetsCount,
      icon: <FaWalking size={40} />,
      bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "Number of Asset - Donors",
      count: donorCount,
      icon: <FaDoorOpen size={40} />,
      bg: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    },
    {
      title: "Number of Receivers from WVF",
      count: reciverCount,
      icon: <FaUserTie size={40} />,
      bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <h1
        style={{
          marginTop: 0,
          paddingTop: 5,
          marginBottom: -45,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Dashboard
      </h1>

      <main
        className="dashboard-content"
        style={{ paddingTop: "30px", paddingBottom: "80px" }}
      >
        <Container fluid>
          <Row>
            {cardData.map((card, index) => (
              <Col xs={15} sm={6} md={4} lg={3} className="mb-3" key={index}>
                <Card
                  className="text-white text-center shadow border-0"
                  style={{
                    background: card.bg,
                    borderRadius: "1rem",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Card.Body>
                    <div style={{ marginBottom: "15px" }}>{card.icon}</div>
                    <Card.Title style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                      {card.title}
                    </Card.Title>
                    {loading ? (
                      <Spinner animation="border" variant="light" />
                    ) : (
                      <h2 style={{ fontSize: "2rem", margin: 0 }}>
                        {card.count}
                      </h2>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;
