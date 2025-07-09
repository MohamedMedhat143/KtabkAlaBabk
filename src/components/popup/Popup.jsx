import React, { useEffect } from "react";
import "./Popup.css";

export default function Popup({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-overlay`}>
      <div className={`popup-content popup-${type}`}>
        <h2 className="popup-title">{message}</h2>
      </div>
    </div>
  );
}
