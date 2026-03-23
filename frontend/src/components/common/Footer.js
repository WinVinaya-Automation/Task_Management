import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "#5a5a5a", // darkened for better contrast
        color: "#ffffff",
        fontSize: "0.8rem", // slightly bigger for readability
        padding: "3px 0",
        textAlign: "center",
      }}
    >
      <Container>
        <Row>
          <Col>
            <p className="mb-0" aria-label="Copyright notice">
              © 2025 Winvinaya InfoSystems. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
