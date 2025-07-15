import React, { useEffect, useState } from "react";
import "./Book.css"; // ✅ Reusing your Books page CSS
import "./User.css";

import { useNavigate } from "react-router-dom";

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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
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
        message: "يجب تسجيل الدخول كأدمن لعرض المستخدمين",
      });
      navigate("/admin_signin");
      return;
    }

    try {
      const res = await fetch(
        "https://ktabkalababk.up.railway.app/user/admin/getalluser",
        {
          headers: { admin_token: token },
        }
      );
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف المستخدم؟");
    if (!confirmDelete) return;

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

    try {
      const res = await fetch(
        `https://ktabkalababk.up.railway.app/user/admin/deleteuser/${userId}`,
        {
          method: "DELETE",
          headers: { admin_token: token },
        }
      );

      if (res.ok) {
        setPopup({ type: "success", message: "تم حذف المستخدم بنجاح" });
        await fetchUsers();
      } else {
        setPopup({ type: "error", message: "فشل في حذف المستخدم" });
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setPopup({ type: "error", message: "حدث خطأ في الاتصال بالخادم" });
    }
  };

  const handleSetDefaultPassword = async (userId) => {
    const confirmReset = window.confirm(
      "هل أنت متأكد من إعادة تعيين كلمة المرور إلى الافتراضية؟"
    );
    if (!confirmReset) return;

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

    try {
      const res = await fetch(
        `https://ktabkalababk.up.railway.app/auth/setdefaultpassword/${userId}`,
        {
          method: "GET",
          headers: { admin_token: token },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: "success",
          message: "تم إعادة تعيين كلمة المرور إلى الافتراضية بنجاح",
        });
      } else {
        setPopup({
          type: "error",
          message: data.message || "فشل في إعادة تعيين كلمة المرور",
        });
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setPopup({ type: "error", message: "حدث خطأ في الاتصال بالخادم" });
    }
  };

  const handleSearch = async () => {
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
        message: "يجب تسجيل الدخول كأدمن للبحث عن المستخدمين",
      });
      navigate("/admin_signin");
      return;
    }

    try {
      const res = await fetch(
        `https://ktabkalababk.up.railway.app/user/admin/searchbook?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: { admin_token: token },
        }
      );
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
      } else {
        setUsers([]);
        setPopup({ type: "error", message: "لا يوجد مستخدم بهذا الرقم" });
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setPopup({ type: "error", message: "حدث خطأ أثناء البحث" });
    }
  };

  return (
    <div>
      <h2>قائمة المستخدمين</h2>
      <p className="total-books">عدد المستخدمين: {users.length}</p>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="ابحث برقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          بحث
        </button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : users.length === 0 ? (
        <p>لا يوجد مستخدمون.</p>
      ) : (
        <div className="books-list">
          {users.map((user) => (
            <div key={user._id} className="book-item">
              <h4>{user.userName}</h4>
              <p>المدينة: {user.city}</p>
              <p>العنوان: {user.address}</p>
              <p>رقم الهاتف: {user.phoneNumber}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                حذف
              </button>
              <button
                className="reset-password-button"
                onClick={() => handleSetDefaultPassword(user._id)}
              >
                إعادة تعيين كلمة المرور
              </button>
            </div>
          ))}
        </div>
      )}
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}
    </div>
  );
}
