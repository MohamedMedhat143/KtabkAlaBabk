import React, { useEffect, useState } from "react";
import "./Order.css";
import { Link, useNavigate } from "react-router-dom";

export default function Order() {
  const [order, setOrder] = useState(null);
  const [oldPrice, setOldPrice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("يجب تسجيل الدخول لعرض الطلب.");
          setLoading(false);
          return;
        }
        // Fetch order
        const resOrder = await fetch("http://localhost:5000/order/getorder", {
          headers: { token: token },
        });
        const dataOrder = await resOrder.json();
        if (resOrder.ok && dataOrder.order) {
          setOrder(dataOrder.order);
          setOldPrice(dataOrder.oldPrice);
        } else {
          setError(dataOrder.message || "فشل في جلب بيانات الطلب.");
        }
        // Fetch user
        const resUser = await fetch("https://ktabkalababk.up.railway.app/user", {
          headers: { token: token },
        });
        const dataUser = await resUser.json();
        if (resUser.ok && dataUser.user) {
          setUser({
            firstName: dataUser.user.firstName || "",
            lastName: dataUser.user.lastName || "",
            phoneNumber: dataUser.user.phoneNumber || "",
            secondPhoneNumber: dataUser.user.secondPhoneNumber || "",
            city: dataUser.user.city || "",
            address: dataUser.user.address || "",
          });
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات الطلب أو المستخدم.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndUser();
  }, []);

  return (
    <div dir="rtl" lang="ar" className="home-container">
      <header className="home-header">
        <div className="header-content">
          <Link to="/home">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>
          <h2 className="header-title">مراجعة الطلب</h2>
        </div>
      </header>
      <section className="book-list-section">
        <h2 className="section-title">تفاصيل الطلب</h2>
        {loading ? (
          <p className="loading-text">جاري تحميل بيانات الطلب...</p>
        ) : error ? (
          <p className="empty-text">{error}</p>
        ) : order && user ? (
          <>
            {/* User Info */}
            <div className="user-info-box">
              <h3 className="user-info-title">معلومات المستخدم</h3>
              <p>
                <strong>الاسم:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>العنوان:</strong> {user.address}
              </p>
              <p>
                <strong>المدينة:</strong> {user.city}
              </p>
              <p>
                <strong>رقم الهاتف:</strong> {user.phoneNumber}
              </p>
              {user.secondPhoneNumber && (
                <p>
                  <strong>رقم هاتف إضافي:</strong> {user.secondPhoneNumber}
                </p>
              )}
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/profile")}
              >
                تعديل بيانات المستخدم
              </button>
            </div>
            {/* Order Info */}
            <div className="book-list">
              {order.orderItems.map((item) => (
                <div key={item._id} className="book-card">
                  <img
                    src={item.book.bookImage}
                    alt={item.book.bookName}
                    className="book-image"
                  />
                  <h3 className="book-title">{item.book.bookName}</h3>
                  <div className="book-divider" />
                  <p className="book-owner">{item.book.bookOwner}</p>
                  <p className="book-owner">{item.book.gradeOfBooks}</p>
                  <p className="book-price">السعر: {item.price} جنيه</p>
                  <p className="book-quantity">الكمية: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="total-price-container">
              <div className="total-price">
                <strong>إجمالي السعر: {order.totalOrderPrice} جنيه</strong>
              </div>
              {oldPrice && (
                <div className="old-price">
                  <span>السعر قبل الخصم: </span>
                  <span className="order-old-price">{oldPrice} جنيه</span>
                </div>
              )}
              <div className="payment-status">
                <span>حالة الدفع: </span>
                <span className={order.isPaid ? "paid" : "not-paid"}>
                  {order.isPaid ? "تم الدفع" : "لم يتم الدفع"}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </section>
      <footer className="home-footer">
        <div className="footer-text">
          جميع الحقوق محفوظة &copy; لموقع كتابك على بابك
        </div>
      </footer>
    </div>
  );
}
