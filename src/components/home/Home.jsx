import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const hasToken = Boolean(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!hasToken) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ktabkalababk.vercel.app/cart/getcart", {
        headers: { token: token },
      });
      const data = await res.json();

      if (res.ok && data.cart && data.cart.cartItems) {
        setCartCount(data.cart.cartItems.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          "https://ktabkalababk.vercel.app/book/getbooks"
        );
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false); // ✅ Always stop loading, whether success or error
      }
    };

    fetchBooks();
    fetchCartCount();
  }, [hasToken]);

  const addToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          type: "error",
          message: "يجب تسجيل الدخول لإضافة الكتاب إلى السلة",
        });
        return;
      }

      const res = await fetch(
        "https://ktabkalababk.vercel.app/cart/addtocart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            book: bookId,
            quantity: 1,
          }),
        }
      );

      if (res.ok) {
        setPopup({
          type: "success",
          message: "تم إضافة الكتاب إلى السلة بنجاح!",
        });
        // Refresh cart count after adding item
        fetchCartCount();
      } else {
        setPopup({
          type: "error",
          message: "فشل في إضافة الكتاب إلى السلة",
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ في الاتصال بالخادم",
      });
    }
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleAddToCart = async (bookId) => {
    try {
      const button = document.getElementById(`add-button-${bookId}`);
      button.classList.add("add-animation"); // Add animation class

      setTimeout(() => {
        button.classList.remove("add-animation"); // Remove after animation
      }, 500); // Duration matches animation below

      await addToCart(bookId); // Your existing function to add to cart
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `https://ktabkalababk.vercel.app/book?search=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      console.log(data);
      setBooks(data.book);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleSearchButtonClick = () => {
    setButtonClicked(true);
    setShowSearch(!showSearch);
    setTimeout(() => setButtonClicked(false), 400); // remove class after animation
  };

  return (
    <div dir="rtl" lang="ar" className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          {/* Logo */}
          <Link to="/home">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>

          {/* Header Text in the Middle */}
          <span className="header-title">مرحبا بك في كتابك على بابك</span>
          <div className="header-icons">
            {hasToken ? (
              <>
                {/* Logout Icon */}
                <button
                  onClick={() => {
                    // Clear all stored data
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");

                    // Redirect to home (will show login button)
                    navigate("/home");
                  }}
                  className="header-button logout-button"
                  title="تسجيل الخروج"
                >
                  <span className="logout-icon"></span>
                </button>
                {/* Cart Icon */}
                <div className="cart-container">
                  <button onClick={goToCart} className="cart-button">
                    <img src="trolley.png" alt="Cart" className="icon-image" />
                    {cartCount > 0 && (
                      <span className="cart-count">{cartCount}</span>
                    )}
                  </button>
                </div>
                {/* Profile Icon */}
                <button onClick={goToProfile} className="header-button">
                  <img src="user.png" alt="Profile" className="icon-image" />
                </button>
                {/* Search Icon */}
                <button
                  onClick={handleSearchButtonClick}
                  className={`header-button ${buttonClicked ? "clicked" : ""}`}
                >
                  <img src="search.png" alt="Search" className="icon-image" />
                </button>
                {/* Search Bar */}
                {showSearch && (
                  <div className="search-bar">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="ابحث عن كتاب او مدرس..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <button
                className="login-button"
                onClick={() => navigate("/signin")}
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Book List */}
      <section className="book-list-section">
        <h2 className="section-title">قائمة الكتب المتاحة</h2>

        {loading ? (
          <p className="loading-message">جارٍ تحميل الكتب...</p>
        ) : books.length === 0 ? (
          <p className="no-books-message">لا توجد كتب متاحة حالياً.</p>
        ) : (
          <div className="book-list">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <img
                  src={book.bookImage}
                  alt={book.bookName}
                  className="book-image"
                />
                <h3 className="book-title">{book.bookName}</h3>
                <div className="book-divider" />
                <p className="book-owner">{book.bookOwner}</p>
                <p className="book-owner">{book.gradeOfBooks}</p>
                <p className="book-price">السعر: {book.bookPrice} جنيه</p>
                <button
                  id={`add-button-${book._id}`}
                  onClick={() => handleAddToCart(book._id)}
                  className={`book-button ${
                    book.isEmpty ? "unavailable-button" : ""
                  }`}
                  disabled={book.isEmpty}
                >
                  {book.isEmpty ? "غير متاح" : "إضافة إلى السلة"}
                </button>
              </div>
            ))}
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
