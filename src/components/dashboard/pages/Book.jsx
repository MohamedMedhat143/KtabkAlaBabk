import React, { useEffect, useState } from "react";
import "./Book.css";
import { useNavigate } from "react-router-dom";
// import Popup from "../../popup/Popup";

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

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    bookName: "",
    bookOwner: "",
    bookPrice: "",
    numberOfBooks: "",
    gradeOfBooks: "",
    weightOfBooks: "",
    isEmpty: "false",
  });
  const [bookImage, setBookImage] = useState(null);
  const navigate = useNavigate();
  const [editingBook, setEditingBook] = useState(null);
  const [popup, setPopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await fetch("https://ktabkalababk.up.railway.app/book/getbooks");
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();

    const formData = {
      bookName: newBook.bookName,
      bookOwner: newBook.bookOwner,
      bookPrice: newBook.bookPrice,
      numberOfBooks: newBook.numberOfBooks,
      gradeOfBooks: newBook.gradeOfBooks,
      weightOfBooks: newBook.weightOfBooks,
      isEmpty: newBook.isEmpty,
    };

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
      navigate("/admin_signin");
      return;
    }

    try {
      let res;
      if (editingBook) {
        const fd = new FormData();
        if (bookImage) {
          fd.append("bookImage", bookImage);
        }
        for (const key in formData) {
          fd.append(key, formData[key]);
        }

        res = await fetch(
          `https://ktabkalababk.up.railway.app/book/admin/editbook/${editingBook._id}`,
          {
            method: "PUT",
            headers: {
              admin_token: token, // ✅ Only token here (NO Content-Type; browser sets it automatically)
            },
            body: fd,
          }
        );
      } else {
        // ✅ Add book (image still needs FormData)
        const fd = new FormData();
        fd.append("bookImage", bookImage);
        for (const key in formData) {
          fd.append(key, formData[key]);
        }

        res = await fetch(
          "https://ktabkalababk.up.railway.app/book/admin/addbook",
          {
            method: "POST",
            headers: { admin_token: token },
            body: fd,
          }
        );
      }

      if (res.ok) {
        setPopup({
          type: "success",
          message: editingBook
            ? "تم تعديل الكتاب بنجاح!"
            : "تم إضافة الكتاب بنجاح!",
        });
        await fetchBooks();
        setShowAddForm(false);
        setEditingBook(null);
        setNewBook({
          bookName: "",
          bookOwner: "",
          bookPrice: "",
          numberOfBooks: "",
          gradeOfBooks: "",
          weightOfBooks: "",
          isEmpty: "false",
        });
        setBookImage(null);
      } else {
        const result = await res.json();
        console.error("Error:", result);
        setPopup({
          type: "error",
          message: editingBook ? "فشل في تعديل الكتاب" : "فشل في إضافة الكتاب",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ في الاتصال بالخادم",
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف الكتاب؟");
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

    if (!token) {
      setPopup({
        type: "error",
        message: "يجب تسجيل الدخول كأدمن لحذف كتاب",
      });
      navigate("/admin_dashboard");
      return;
    }

    try {
      const res = await fetch(
        `https://ktabkalababk.up.railway.app/book/admin/deletebook/${bookId}`,
        {
          method: "DELETE",
          headers: { admin_token: token },
        }
      );

      if (res.ok) {
        setPopup({
          type: "success",
          message: "تم حذف الكتاب بنجاح",
        });
        await fetchBooks(); // Refresh books after delete
      } else {
        setPopup({
          type: "error",
          message: "فشل في حذف الكتاب",
        });
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setPopup({
        type: "error",
        message: "حدث خطأ في الاتصال بالخادم",
      });
    }
  };
  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowAddForm(true);
    setNewBook({
      bookName: book.bookName,
      bookOwner: book.bookOwner,
      bookPrice: book.bookPrice,
      numberOfBooks: book.numberOfBooks,
      gradeOfBooks: book.gradeOfBooks,
      weightOfBooks: book.weightOfBooks,
      isEmpty: book.isEmpty.toString(),
    });
  };
  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/book?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      console.log(data);
      setBooks(data.book);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  return (
    <div>
      <h2>قائمة الكتب</h2>
      <p className="total-books">عدد الكتب: {books.length}</p>
      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="ابحث عن كتاب أو مدرس..."
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
      <button
        className="add-book-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        إضافة كتاب جديد
      </button>

      {showAddForm && (
        <form
          onSubmit={handleAddBook}
          encType="multipart/form-data"
          className="add-book-form"
        >
          <h3 className="text-xl font-bold text-center mb-4">
            إضافة كتاب جديد
          </h3>

          <div>
            <label className="block mb-1 font-semibold">صورة الكتاب:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBookImage(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">اسم الكتاب:</label>
            <input
              type="text"
              value={newBook.bookName}
              onChange={(e) =>
                setNewBook({ ...newBook, bookName: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">المدرس:</label>
            <input
              type="text"
              value={newBook.bookOwner}
              onChange={(e) =>
                setNewBook({ ...newBook, bookOwner: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">السعر:</label>
            <input
              type="number"
              value={newBook.bookPrice}
              onChange={(e) =>
                setNewBook({ ...newBook, bookPrice: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">عدد النسخ:</label>
            <input
              type="number"
              value={newBook.numberOfBooks}
              onChange={(e) =>
                setNewBook({ ...newBook, numberOfBooks: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">الصف الدراسي:</label>
            <select
              value={newBook.gradeOfBooks}
              onChange={(e) =>
                setNewBook({ ...newBook, gradeOfBooks: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">اختر الصف</option>
              <option value="الصف الثالث الثانوى">الصف الثالث الثانوى</option>
              <option value="الصف الثانى الثانوى">الصف الثانى الثانوى</option>
              <option value="الصف الاول الثانوى">الصف الاول الثانوى</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">الوزن:</label>
            <input
              type="number"
              value={newBook.weightOfBooks}
              onChange={(e) =>
                setNewBook({ ...newBook, weightOfBooks: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">هل الكتاب فارغ؟:</label>
            <select
              value={newBook.isEmpty}
              onChange={(e) =>
                setNewBook({ ...newBook, isEmpty: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="false">لا</option>
              <option value="true">نعم</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            حفظ الكتاب
          </button>
        </form>
      )}

      {loading ? (
        <p>جاري التحميل...</p>
      ) : books.length === 0 ? (
        <p>لا توجد كتب.</p>
      ) : (
        <div className="books-list">
          {books.map((book) => (
            <div key={book._id} className="book-item">
              <img
                src={book.bookImage}
                alt={book.bookName}
                className="book-image"
              />
              <h4>{book.bookName}</h4>
              <p>المدرس: {book.bookOwner}</p>
              <p>السعر: {book.bookPrice} جنيه</p>
              <p>عدد النسخ: {book.numberOfBooks}</p>
              <p>الوزن: {book.weightOfBooks} جم</p>
              <button
                className="edit-button"
                onClick={() => handleEditBook(book)}
              >
                تعديل
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteBook(book._id)}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}
    </div>
  );
}
