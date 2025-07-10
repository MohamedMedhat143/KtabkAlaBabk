import React, { useEffect, useState } from "react";
import "./Profile.css"; // ✅ Only Profile's CSS
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [popup, setPopup] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          type: "success",
          message: "يجب تسجيل الدخول للوصول إلى الملف الشخصى",
        });
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);

        return;
      }
      const res = await fetch("https://ktabkalababk.onrender.com/user", {
        headers: { token },
      });
      const data = await res.json();

      if (res.ok) {
        setUserData(data.user);
      } else {
        setPopup({
          type: "error",
          message: data.message || "فشل في جلب البيانات",
        });
      }
    } catch (err) {
      setPopup({ type: "error", message: "حدث خطأ أثناء جلب البيانات" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://ktabkalababk.onrender.com/user/edituser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPopup({ type: "success", message: "تم تحديث البيانات بنجاح" });
        setEditing(false);
      } else {
        setPopup({ type: "error", message: data.message || "فشل في التحديث" });
      }
    } catch (err) {
      setPopup({ type: "error", message: "حدث خطأ أثناء التحديث" });
    }
  };

  return (
    <div dir="rtl" lang="ar" className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <Link to="/home">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>
          <h2 className="header-title">حسابي الشخصي</h2>
        </div>
      </header>

      <section className="book-list-section">
        {loading ? (
          <p className="loading-message">جاري تحميل البيانات...</p>
        ) : (
          <div className="profile-container">
            <h3 className="book-title">معلومات المستخدم</h3>

            <label>الاسم الأول:</label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
              disabled={!editing}
              className="profile-input"
            />

            <label>الاسم الأخير:</label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
              disabled={!editing}
              className="profile-input"
            />

            <label>رقم الهاتف:</label>
            <input
              type="text"
              value={userData.phoneNumber}
              onChange={(e) =>
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
              disabled={!editing}
              className="profile-input"
            />
            <label>المدينة:</label>
            <select
              id="city"
              name="city"
              className="profile-input"
              value={userData.city}
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
              }
              disabled={!editing}
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

            <label>العنوان:</label>
            <input
              type="text"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              disabled={!editing}
              className="profile-input"
            />

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="profile-button edit-button"
              >
                تعديل البيانات
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="profile-button save-button"
              >
                حفظ التعديلات
              </button>
            )}
          </div>
        )}
      </section>

      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-text">
          جميع الحقوق محفوظة &copy; لموقع كتابك على بابك
        </div>
      </footer>
    </div>
  );
}
