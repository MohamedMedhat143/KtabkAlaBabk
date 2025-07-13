import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [popup, setPopup] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://ktabkalababk.vercel.app/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          phoneNumber,
          password,
          repassword,
          city: selectedCity, // ← new field
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPopup({ type: "success", message: "تم إنشاء الحساب بنجاح!" });
        setTimeout(() => setPopup(null), 3000);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        let message = data.message || "فشل تسجيل الدخول";
        console.log(message);

        if (message.includes('ValidationError: "password"')) {
          message = "كلمة المرور يجب أن تحتوي على أحرف وأرقام";
        }

        if (message.includes('ValidationError: "repassword"')) {
          message = "كلمة المرور وتأكيد كلمة المرور غير متطابقتين";
        }
        setPopup({
          type: "error",
          message: message || "فشل في إنشاء الحساب",
        });
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
            <h2 className="form-title">إنشاء حساب</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="label">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="label">
                  اسم العائلة
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="label">
                العنوان
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {/* Dropdown for Cities */}
            <div className="form-group">
              <label htmlFor="city" className="label">
                اختر المدينة
              </label>
              <select
                id="city"
                name="city"
                className="input"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">-- اختر المدينة --</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الإسكندرية">الإسكندرية</option>
                <option value="بورسعيد">بورسعيد</option>
                <option value="السويس">السويس</option>
                <option value="دمياط">دمياط</option>
                <option value="الدقهلية">الدقهلية</option>
                <option value="الشرقية">الشرقية</option>
                <option value="القليوبية">القليوبية</option>
                <option value="كفر الشيخ">كفر الشيخ</option>
                <option value="الغربية">الغربية</option>
                <option value="المنوفية">المنوفية</option>
                <option value="البحيرة">البحيرة</option>
                <option value="الإسماعيلية">الإسماعيلية</option>
                <option value="الفيوم">الفيوم</option>
                <option value="بني سويف">بني سويف</option>
                <option value="المنيا">المنيا</option>
                <option value="أسيوط">أسيوط</option>
                <option value="سوهاج">سوهاج</option>
                <option value="قنا">قنا</option>
                <option value="الأقصر">الأقصر</option>
                <option value="أسوان">أسوان</option>
                <option value="الوادي الجديد">الوادي الجديد</option>
                <option value="مطروح">مطروح</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="repassword" className="label">
                تاكيد كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="input"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="label">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-submit">
              إنشاء حساب
            </button>
            <p className="signup-text">
              لديك حساب بالفعل؟
              <Link to="/signin" className="signup-link">
                تسجيل الدخول
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
