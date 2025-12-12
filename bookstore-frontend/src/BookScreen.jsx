import "./App.css";
import BookList from "./components/BookList";
import Clock from "./components/Clock";
import { Form, Button, Spin, Space, Popconfirm } from "antd";
import { LogoutOutlined, BookOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import axios from "axios";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";
import SearchFilter from "./components/SearchFilter";
import HeaderBar from "./components/Navbar";

axios.defaults.baseURL = import.meta.env.VITE_APP_URL;
const URL_BOOK = "api/book";
const URL_CATEGORY = "/api/book-category";

function BookScreen({ onLogout }) {
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const bookCount = bookData.reduce((total, book) => total + book.stock, 0);

  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStock, setFilterStock] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(
        response.data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
      console.log(response.data)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    setTotalAmount(
      bookData.reduce((total, book) => total + book.price * book.stock, 0)
    );
  }, [bookData]);

  const generateRandomISBN = () => {
    const randomDigits = () => Math.floor(Math.random() * 1000000000);
    return `978-${randomDigits()}`;
  };

  const handleAddBook = async (values) => {
    const bookToSend = {
      title: values.title,
      coverUrl: `/images/books/placeholder.jpg`,
      price: parseFloat(values.price),
      stock: parseInt(values.stock),
      categoryId: values.categoryId,
      author: "Generated Author",
      description: "Generated Description",
      isbn: generateRandomISBN(),
      likeCount: 0,
    };

    try {
      console.log(bookToSend)
      const response = await axios.post(URL_BOOK, bookToSend);
      const createdBook = response.data;

      setBookData((prevBookData) => [...prevBookData, createdBook]);

      fetchBooks();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLiked = async (bookId) => {
    const bookToUpdate = bookData.find(book => book.id === bookId);
    if (!bookToUpdate) return;
    setBookData(
      bookData.map((book) =>
        book.id === bookId ? { ...book, likeCount: book.likeCount + 1 } : book
      )
    );

    try {
      const response = await axios.patch(`${URL_BOOK}/${bookId}`, {
        likeCount: bookToUpdate.likeCount + 1,
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleted = async (bookId) => {
    const bookToUpdate = bookData.find(book => book.id === bookId);
    if (!bookToUpdate) return;
    try {
      const response = await axios.delete(`${URL_BOOK}/${bookId}`);

    } catch (error) {
      console.error(error);
    }
    setBookData(bookData.filter((book) => book.id !== bookId));
  };

  const handleEditBook = async (book) => {
    setLoading(true)
    try {
      const editedData = { ...book, 'price': Number(book.price), 'stock': Number(book.stock) }
      const { id, category, createdAt, updatedAt, ...data } = editedData
      const response = await axios.patch(URL_BOOK + `/${id}`, data);
      fetchBooks();
    } catch (error) {
      console.error('Error editing book:', error);
    } finally {
      setLoading(false);
      setEditBook(null);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('authToken');

    delete axios.defaults.headers.common['Authorization'];

    if (onLogout) {
      onLogout();
    }
  };

  const filteredBooks = bookData.filter((book) => {
    const titleMatch = book.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase());

    // 2. Filter by Category
    const categoryMatch = filterCategory
      ? book.categoryId === filterCategory
      : true;

    // 3. Filter by Stock
    const stockMatch = filterStock !== null
      ? book.stock < filterStock
      : true;

    return titleMatch && categoryMatch && stockMatch;
  });

  return (
    <div style={{ padding: "0 20px" }}>
      <HeaderBar onLogout={handleLogout} />
      <div style={{ padding: "20px" }}>
        <h3>Book List</h3>
        {bookCount > 50 ? (
          <p style={{ color: "green" }}>
            Wow we have so many books, {bookCount} books
          </p>
        ) : (
          <p style={{ color: "red" }}>Boss low on stock... {bookCount} books</p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >

          <SearchFilter
            categories={categories}
            filterTitle={filterTitle}
            onTitleChange={setFilterTitle}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            filterStock={filterStock}
            onStockChange={setFilterStock}
            onClearFilters={() => {
              setFilterTitle('');
              setFilterCategory(null);
              setFilterStock(null);
            }}
          />

          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>Add a book</Button>
          <AddBook
            open={isAddModalOpen}
            onCancel={() => setIsAddModalOpen(false)}
            onSave={(values) => {
              handleAddBook(values);
              setIsAddModalOpen(false);
            }}
            categories={categories}
          />
          {/* <AddBook
            form={form}
            categories={categories}
            onBookAdded={handleAddBook}
          /> */}
        </div>

        <h3>My books worth ${totalAmount.toFixed(2)} </h3>

        <Spin spinning={loading}>
          <BookList
            data={filteredBooks}
            onEdit={book => setEditBook(book)}
            onLiked={handleLiked}
            onDeleted={handleDeleted}
          />
          <EditBook
            book={editBook}
            categories={categories}
            open={editBook !== null}
            onCancel={() => setEditBook(null)}
            onSave={handleEditBook} />
        </Spin>
      </div>
    </div>
  );
}

export default BookScreen;
