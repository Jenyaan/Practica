import React, { useEffect, useState } from 'react';
import Footer from '../../components/simple/Footer/Footer';
import Header from '../../components/simple/Header/Header';
import styles from './Home.module.css';
import type { PropsCart } from '../../components/smart/BookCart/BookCart';
import BookCart from '../../components/smart/BookCart/BookCart';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { PREFIX } from '../../api/API';

const Home = () => {
  const jwt = useSelector((state: RootState) => state.user.jwt);
  const [books, setBooks] = useState<PropsCart[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1); // ← Додали стан для останньої сторінки
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) navigate('/');
  }, [jwt, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setUserId(res.data.id);
      } catch (error) {
        console.error('Помилка отримання користувача:', error);
      }
    };

    if (jwt) {
      fetchUser();
    }
  }, [jwt]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${PREFIX}/api/v1/users/${userId}/books`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const booksData = res.data.data.map((book: any) => ({
          id: book.id,
          title: book.title,
          image_url: book.image_url
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Помилка отримання книг:', error);
      }
    };

    if (jwt && userId !== null) {
      fetchBooks();
    }
  }, [jwt, userId]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={i === currentPage ? styles['active_page'] : ''}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={styles['container']}>
      <Header />
      <div className={styles['home_main']}>
        <h1>Мої Книги</h1>
        <div className={styles['view_books']}>
          <div className={styles['cataloge_books']}>
            {books.map((book) => (
              <Link to={`/book/${book.id}`} className={styles['link-book']} key={book.id}>
                <BookCart {...book} />
              </Link>
            ))}
          </div>
          <div className={styles['fillter_books']}>
            <input type="text" id="search" placeholder="Пошук за автором чи назвою" />
            <select id="genre">
              <option value="">Жанр</option>
              <option value="history">Історія</option>
              <option value="fiction">Художня</option>
            </select>
            <select id="genre">
              <option value="">Жанр</option>
              <option value="history">Історія</option>
              <option value="fiction">Художня</option>
            </select>
          </div>
        </div>
        <div className={styles['pagination']}>
          {renderPagination()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
