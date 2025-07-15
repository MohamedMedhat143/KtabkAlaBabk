import React, { useState, useEffect } from "react";
import "./Signin.css"; // ✅ Reuse same styles
import { useNavigate } from "react-router-dom";

// Simple encryption/decryption functions
const encryptData = (data) => {
  try {
    // Simple base64 encoding with a custom key
    const key = "bokk_app_secret_key_2025";
    const encoded = btoa(encodeURIComponent(data + key));
    return encoded;
  } catch (error) {
    console.error("Encryption error:", error);
    return data;
  }
};

const decryptData = (encryptedData) => {
  try {
    // Simple base64 decoding with key removal
    const key = "bokk_app_secret_key_2025";
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded.replace(key, "");
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData;
  }
};

export default function AdminSignin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  // Load saved credentials on component mount
  useEffect(() => {
    // Check if user is already logged in
    const adminToken =
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token");
    if (adminToken) {
      navigate("/admin_dashboard");
      return;
    }

    const savedPhone = localStorage.getItem("admin_phone");
    const savedPassword = localStorage.getItem("admin_password");
    const savedRememberMe = localStorage.getItem("admin_remember_me");

    if (savedRememberMe === "true" && savedPhone && savedPassword) {
      try {
        const decryptedPhone = decryptData(savedPhone);
        const decryptedPassword = decryptData(savedPassword);
        setPhone(decryptedPhone);
        setPassword(decryptedPassword);
        setRememberMe(true);
      } catch (error) {
        console.error("Error decrypting saved credentials:", error);
        // Clear corrupted data
        localStorage.removeItem("admin_phone");
        localStorage.removeItem("admin_password");
        localStorage.removeItem("admin_remember_me");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://ktabkalababk.up.railway.app/auth_admin/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: phone, password }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem("admin_token", encryptData(data.token));
        } else {
          sessionStorage.setItem("admin_token", data.token);
        }
        console.log(data.token);

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem("admin_phone", encryptData(phone));
          localStorage.setItem("admin_password", encryptData(password));
          localStorage.setItem("admin_remember_me", "true");
        } else {
          // Clear saved credentials if remember me is unchecked
          localStorage.removeItem("admin_phone");
          localStorage.removeItem("admin_password");
          localStorage.removeItem("admin_remember_me");
        }

        setPopup({ type: "success", message: "تم تسجيل دخول المشرف بنجاح!" });
        setTimeout(() => {
          setPopup(null);
          navigate("/admin_dashboard");
        }, 2000);
      } else {
        let message = data.message || "فشل تسجيل الدخول";
        if (message.includes("fails to match")) {
          message = "رقم الهاتف غير صالح أو غير مكتمل";
        }
        if (message.includes("incorrect password or email")) {
          message = "رقم الهاتف أو كلمة المرور غير صحيحة";
        }
        setPopup({ type: "error", message });
        setTimeout(() => setPopup(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", message: "فشل الاتصال بالخادم، حاول لاحقًا" });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div dir="rtl" lang="ar" className="container">
      <header className="header">
        <img src="/logo.png" alt="كتابك على بابك" className="logo-img" />
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-wrapper">
            <h2 className="form-title">تسجيل دخول المشرف</h2>

            <div className="form-group">
              <label className="label" htmlFor="phone">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">تذكرني</span>
              </label>
            </div>

            <button type="submit" className="btn-submit">
              دخول
            </button>
          </div>
        </form>
      </section>

      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      <footer className="home-footer">
        <div className="footer-text">
          جميع الحقوق محفوظة &copy; 2025 كتابك على بابك
        </div>
      </footer>
    </div>
  );
}
