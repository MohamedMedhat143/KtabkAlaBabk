import React, { useEffect, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(null);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          type: "success",
          message: "يجب تسجيل الدخول للوصول إلى السلة",
        });
        return;
      }

      const res = await fetch("https://ktabkalababk.onrender.com/cart", {
        headers: { token: `${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setCartItems(data.cart.cartItems);
        setTotalPrice(data.cart.totalCartPrice);
      } else {
        const errorMsg =
          data.message === "Cart Not Found" ? "السلة فارغة" : data.message;
        setError(errorMsg || "حدث خطأ أثناء تحميل السلة");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handlePayment = () => {
    setPopup({
      type: "success",
      message: "جاري تنفيذ عملية الدفع...",
    });
  };

  // Handle local quantity change
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = value;
    setCartItems(updatedItems);
  };

  // Send quantity to backend
  const updateQuantity = async (bookId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ktabkalababk.onrender.com/cart/updatequantity/${bookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ quantity: Number(quantity) }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setPopup({ type: "success", message: "تم تحديث الكمية بنجاح" });
        await fetchCart();
      } else {
        setPopup({
          type: "error",
          message: data.message || "فشل في تحديث الكمية",
        });
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ أثناء تحديث الكمية",
      });
    }
  };

  const deleteFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ktabkalababk.onrender.com/cart/deletefromcart/${bookId}`,
        {
          method: "DELETE",
          headers: { token: token },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setPopup({ type: "success", message: "تم حذف الكتاب من السلة بنجاح" });
        await fetchCart();
      } else {
        setPopup({
          type: "error",
          message: data.message || "فشل في حذف الكتاب من السلة",
        });
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ أثناء حذف الكتاب من السلة",
      });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          type: "success",
          message: "يجب تسجيل الدخول للوصول إلى الملف الشخصى",
        });
        return;
      }
      const res = await fetch(
        "https://ktabkalababk.onrender.com/cart/clearcart",
        {
          method: "DELETE",
          headers: { token: token },
        }
      );

      if (res.ok) {
        setPopup({
          type: "success",
          message: "تم مسح جميع الكتب من السلة بنجاح",
        });
        // await fetchCart();
        // window.location.reload();
      } else {
        setPopup({
          type: "error",
          message: "فشل في مسح السلة",
        });
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ أثناء مسح السلة",
      });
    }
  };

  return (
    <div dir="rtl" lang="ar" className="home-container">
      <header className="home-header">
        <div className="header-content">
          <Link to="/home">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>
          <h2 className="header-title">سلة المشتريات</h2>
        </div>
      </header>

      {/* Clear Cart Button (Top Left) */}
      <div className="clear-cart-container">
        <button onClick={clearCart} className="clear-cart-button">
          مسح كل السلة
        </button>
      </div>
      <section className="book-list-section">
        <h2 className="section-title">الكتب المضافة للسلة</h2>

        {loading ? (
          <p className="loading-text">جاري التحميل...</p>
        ) : error ? (
          <p className="empty-text">{error}</p>
        ) : cartItems.length === 0 ? (
          <p className="empty-text">السلة فارغة حالياً</p>
        ) : (
          <div className="book-list">
            {cartItems.map((item, index) => (
              <div key={index} className="book-card">
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
                <p
                  className={`book-status ${
                    item.book.isEmpty ? "out-of-stock" : "in-stock"
                  }`}
                >
                  {item.book.isEmpty ? "غير متاح" : "متاح"}
                </p>

                {/* Quantity Input & Buttons */}
                <div className="quantity-control">
                  <label>
                    الكمية:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      className="quantity-input"
                    />
                  </label>
                  <div className="button-group">
                    <button
                      onClick={() =>
                        updateQuantity(item.book._id, item.quantity)
                      }
                      className="update-button"
                    >
                      تحديث
                    </button>
                    <button
                      onClick={() => deleteFromCart(item.book._id)}
                      className="delete-button"
                    >
                      مسح
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Price & Payment Button */}
        {!loading && cartItems.length > 0 && (
          <div className="total-price-container">
            <div className="total-price">
              <strong>إجمالي السعر: {totalPrice} جنيه</strong>
            </div>
            <button onClick={handlePayment} className="payment-button">
              الدفع
            </button>
          </div>
        )}
      </section>
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}
      <footer className="home-footer">
        <div className="footer-text">
          جميع الحقوق محفوظة &copy; لموقع كتابك على بابك
        </div>
      </footer>
    </div>
  );
}
