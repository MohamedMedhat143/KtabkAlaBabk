import React, { useState } from "react";
import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://ktabkalababk.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setPopup({ type: "success", message: "تم تسجيل الدخول بنجاح!" });
        setTimeout(() => {
          setPopup(null);
          navigate("/home");
        }, 2000);
      } else {
        let message = data.message || "فشل تسجيل الدخول";

        // Detect phone validation error:
        if (message.includes("fails to match the required pattern")) {
          message = "رقم الهاتف غير صالح او غير مكتمل";
        }
        if (message.includes("incorrect password or phone")) {
          message = "رقم الهاتف او كلمة المرور غير صالحين";
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
            <h2 className="form-title">تسجيل الدخول</h2>

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

            <button type="submit" className="btn-submit">
              دخول
            </button>

            <p className="signup-text">
              ليس لديك حساب؟{" "}
              <Link to="/signup" className="signup-link">
                إنشاء حساب
              </Link>
            </p>
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
