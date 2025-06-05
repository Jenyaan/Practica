import { useEffect, useState } from 'react';
import Header from '../../components/simple/Header/Header';
import Footer from '../../components/simple/Footer/Footer';
import styles from './Search.module.css';
import axios from 'axios';
import { PREFIX } from '../../api/API';
import type { PropsCart } from '../../components/smart/BookCart/BookCart';
import { useParams, Link } from 'react-router-dom';
import BookCart from '../../components/smart/BookCart/BookCart';

const Search = () => {
  const { nameBook } = useParams();
  const [books, setBooks] = useState<PropsCart[]>([]);

  useEffect(() => {
    const fetchPageText = async () => {
      try {
        const filters: string[] = [];
        if (nameBook) {
          filters.push(`title:${nameBook}`);
        }
        const res = await axios.get(`${PREFIX}/api/v1/books`, {
          params: { filter_by: filters }
        });
        const booksData = res.data.data.map((book: any) => ({
          id: book.id,
          title: book.title,
          image_url: book.image_url
        }));
        setBooks(booksData);
      } catch (err) {
        console.error('Помилка завантаження сторінки:', err);
      }
    };

    if (nameBook) {
      fetchPageText();
    }
  }, [nameBook]);

  const renderPagination = () => null; // тимчасова заглушка

  return (
    <div className={styles['container']}>
      <Header />
      <div className={styles['main']}>
        <h2>Результат, за пошуком: “{nameBook}”</h2>
        <div className={styles['view_books']}>
          <div className={styles['cataloge_books']}>
            {books.map((book) => (
              <Link to={`/book/${book.id}`} className={styles['link-book']} key={book.id}>
                <BookCart {...book} />
              </Link>
            ))}
          </div>
          <div className={styles['fillter_books']}>
            <input type="text" placeholder="Пошук за автором чи назвою" />
            <select>
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

export default Search;
