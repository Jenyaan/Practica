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

export interface PropsViewBook{
  text: string;
  total_pages: number;
}


const ViewBook = () => {
  const { bookId, pageId } = useParams(); // зчитуємо з URL
  const navigate = useNavigate();
  const jwt = useSelector((state: RootState) => state.user.jwt);

  const [contentPage, setContentPage] = useState<PropsViewBook>();
  const [page, setPage] = useState(Number(pageId) || 1);

  useEffect(() => {
    const fetchPageText = async () => {
      try {
        const res = await axios.get(`${PREFIX}/api/v1/books/${bookId}/read/${page}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        setContentPage(res.data);
      } catch (err) {
        console.error('Помилка завантаження сторінки:', err);
      }
    };

    if (jwt && bookId && page) {
      fetchPageText();
    }
  }, [jwt, bookId, page]);

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
          <p>48 Законів власті</p>
          <p className={styles['bookmark-list']}>Перейти до закладки:
            <Link to={`/book/${bookId}/21`} className={styles['bookmark-item']}>21 ст.</Link>
            <Link to={`/book/${bookId}/41`} className={styles['bookmark-item']}>41 ст.</Link>
            <Link to={`/book/${bookId}/81`} className={styles['bookmark-item']}>81 ст.</Link>
          </p>
        </div>
        <div className={styles['text-book']}>
          <div className={styles['bookmark']}><img src="/icons/save.svg" alt="" /></div>
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
