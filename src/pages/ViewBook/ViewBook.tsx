import Footer from '../../components/simple/Footer/Footer';
import Header from '../../components/simple/Header/Header';
import styles from './ViewBook.module.css';
import LinkBack from '../../components/ui/LinkBack/LinkBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PREFIX } from '../../api/API';
import type { RootState } from '../../store/store';
import type { Book } from '../Book/Book';

export interface PropsViewBook{
  text: string;
  total_pages: number;
}

const ViewBook = () => {
  const { bookId, pageId } = useParams()
  const navigate = useNavigate();
  const jwt = useSelector((state: RootState) => state.user.jwt);

  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [contentPage, setContentPage] = useState<PropsViewBook>();
  const [page, setPage] = useState(Number(pageId) || 1);

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchPageText = async () => {
      try {
        const res = await axios.get(`${PREFIX}/api/v1/books/${bookId}/read/${page}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        setContentPage(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Помилка завантаження сторінки:', err);
      }
    };

    if (jwt && bookId && page) {
      fetchPageText();
    }
  }, [jwt, bookId, page]);

  useEffect(() => {
  if (!bookId) return;
  axios.get<Book>(`${PREFIX}/api/v1/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    .then(response => setBook(response.data))
    .catch(error => console.error('Помилка при завантаженні книги:', error));
}, [bookId, jwt]);


  useEffect(() => {
    const stored = localStorage.getItem(`bookmark_${bookId}`);
    const parsed: number[] = stored ? JSON.parse(stored) : [];
    setBookmarks(parsed);
    setIsBookmarked(parsed.includes(page));
  }, [bookId, page]);

  const handleBookmark = () => {
    let updatedBookmarks = [...bookmarks];

    if (isBookmarked) {
      updatedBookmarks = updatedBookmarks.filter(p => p !== page);
    } else {
      updatedBookmarks.push(page);
    }

    setBookmarks(updatedBookmarks);
    setIsBookmarked(!isBookmarked);
    localStorage.setItem(`bookmark_${bookId}`, JSON.stringify(updatedBookmarks));
  };


  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Number(e.target.value);
    if (newPage >= 1 && newPage <= 456) {
      setPage(newPage);
      navigate(`/book/${bookId}/${newPage}`);
    }
  };

  useEffect(() => {
    if (pageId && Number(pageId) !== page) {
      setPage(Number(pageId));
    }
  }, [pageId]);

  return (
    <div className={styles['container']}>
      <Header />
      <div className={styles['main']}>
        <LinkBack>Назад</LinkBack>
        <div className={styles['head-read']}>
          <p>{book?.title}</p>
          {bookmarks.length > 0 && (
            <p className={styles['bookmark-list']}>Перейти до закладки:
              {bookmarks.map((p) => (
                <Link key={p} to={`/book/${bookId}/${p}`} className={styles['bookmark-item']}>
                  {p} ст.
                </Link>
              ))}
            </p>
          )}
        </div>
        <div className={styles['text-book']}>
        <div
          className={styles['bookmark']}
          onClick={handleBookmark}
          title={isBookmarked ? 'Видалити із закладок' : 'Додати в закладки'}
        >
          <img src={isBookmarked ? '/icons/save-active.svg' : '/icons/save.svg'} alt="Закладка" />
        </div>
          <p>{contentPage?.text}</p>
        </div>
        <div className={styles["page-control"]}>
          <input
            type="number"
            min={1}
            max={contentPage?.total_pages}
            value={page}
            onChange={handlePageChange}
          />
          <span>/ {contentPage?.total_pages}</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewBook;
