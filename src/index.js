import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Your global CSS (includes font import and global styles)
import App from "./App"; // Your main app component
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: measure performance (you can remove if you want)
reportWebVitals();
