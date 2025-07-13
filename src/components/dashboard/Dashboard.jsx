import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import BooksPage from "./pages/Book";
import { Link, useNavigate } from "react-router-dom";
import UsersPage from "./pages/User";

// Decryption function (same as in Admin_Signin.jsx)
const decryptData = (encryptedData) => {
  try {
    const key = "bokk_app_secret_key_2025";
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded.replace(key, "");
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData;
  }
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("books");
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let token =
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token");

    // Try to decrypt if it's encrypted (localStorage token)
    if (token && localStorage.getItem("admin_token")) {
      try {
        token = decryptData(token);
      } catch (error) {
        console.error("Error decrypting token:", error);
        token = null;
      }
    }

    if (!token) {
      setPopup({
        type: "error",
        message: "يجب تسجيل الدخول كأدمن لإضافة كتاب",
      });
      setTimeout(() => {
        navigate("/admin_signin");
      }, 2000); // Wait 2 sec before redirect
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return popup ? (
      <div className={`popup ${popup.type}`}>{popup.message}</div>
    ) : null;
  }

  return (
    <div dir="rtl" lang="ar" className="dashboard-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <Link to="/admin_dashboard">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>
          <h2 className="header-title">لوحة تحكم الأدمن</h2>
          <button
            onClick={() => {
              // Clear all stored data
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_phone");
              localStorage.removeItem("admin_password");
              localStorage.removeItem("admin_remember_me");
              sessionStorage.removeItem("admin_token");

              // Redirect to signin
              navigate("/admin_signin");
            }}
            className="logout-button"
            title="تسجيل الخروج"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <button
            className={`sidebar-button ${
              activePage === "books" ? "active" : ""
            }`}
            onClick={() => setActivePage("books")}
          >
            الكتب
          </button>
          <button
            className={`sidebar-button ${
              activePage === "users" ? "active" : ""
            }`}
            onClick={() => setActivePage("users")}
          >
            المستخدمين
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {activePage === "books" && <BooksPage />}
          {activePage === "users" && <UsersPage />}
        </main>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-text">
          جميع الحقوق محفوظة &copy; لموقع كتابك على بابك
        </div>
      </footer>
    </div>
  );
}
