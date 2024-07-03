import React from "react";
import { Button } from "@fluentui/react-components";
import { Link } from "react-router-dom";

const GetStartedButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <Button
      className={`primary-button ${
        isDisabled ? "primary-button-disabled-button" : ""
      }`}
      style={{
        borderRadius: "5px",
      }}
    >
      <Link
        to={isDisabled ? "#" : "/hiring"}
        className={`primary-link ${isDisabled ? "primary-link-disabled" : ""}`}
        style={{
          textDecoration: "none",
          borderRadius: "5px",
          backgroundColor: isDisabled ? "grey" : "#393eb3",
          color: "white",
        }}
      >
        Get Started
      </Link>
    </Button>
  );
};

export default GetStartedButton;
