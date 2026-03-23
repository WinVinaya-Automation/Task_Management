import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        // width: "230vh",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Result
        status="404"
        title="Error 404"
        subTitle=<h5>
          <b>"Sorry, the page you are looking for doesn't exist."</b>
        </h5>
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        }
        style={{
          textAlign: "center",
          backgroundColor: "#ffffff",
          //   borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default NotFound;
