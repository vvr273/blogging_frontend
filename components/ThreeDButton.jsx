import React from "react";
import "./ThreeDButton.css";

export default function ThreeDButton({ text, onClick, disabled }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="three-d-container"
    >
      <div className="three-d-top">{text}</div>
      <div className="three-d-bottom"></div>
    </button>
  );
}