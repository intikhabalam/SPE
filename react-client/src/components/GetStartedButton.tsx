import "../routes/App.css";
import { PrimaryButton } from "@fluentui/react";
import { Link } from "react-router-dom";

const GetStartedButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <PrimaryButton
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
    </PrimaryButton>
  );
};

export default GetStartedButton;
