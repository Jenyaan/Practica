import { useEffect, useState } from 'react'
import Footer from '../../components/simple/Footer/Footer'
import Header from '../../components/simple/Header/Header'
import styles from "./Book.module.css"
import { Link, useParams } from 'react-router-dom'
import LinkBack from '../../components/ui/LinkBack/LinkBack'
import ModalDownload from '../../components/ui/ModalDownload/ModalDownload'
import ModalComment from '../../components/ui/ModalComment/ModalComment'
import axios from 'axios'
import { PREFIX } from '../../api/API'
import CommentData, { type PropsCommentData } from '../../components/smart/comment/BookComment'  // Добавь импорт компонента для комментов

export interface Book {
  author: string;
  bookmarks: string[];
  description: string;
  formats: string[];
  genres: string[];
  id: number;
  image_url: string;
  public: boolean;
  tags: string;
  title: string;
  user_id: number;
  year?: number | null;
}

const Book = () => {
  const [showComments, setShowComments] = useState(false);
  const [showDownLoadModal, setShowDownLoadModal] = useState(false);
  const [showCommentdModal, setShowCommentdModal] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const { bookId } = useParams<{ bookId: string }>();

  const [comments, setComments] = useState<PropsCommentData[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    axios.get<Book>(`${PREFIX}/api/v1/books/${bookId}`)
      .then(response => setBook(response.data))
      .catch(error => console.error('Помилка при завантаженні книги:', error));
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;

    setCommentsLoading(true);
    axios.get<{ data: PropsCommentData[] }>(`${PREFIX}/api/v1/books/${bookId}/comments`)
      .then(response => setComments(response.data.data))
      .catch(error => console.error('Помилка при завантаженні коментарів:', error))
      .finally(() => setCommentsLoading(false));
  }, [bookId]);

  const toggleComments = () => setShowComments(prev => !prev);

  const averageRating = comments.length
    ? (comments.reduce((sum, c) => sum + c.score, 0) / comments.length).toFixed(1)
    : '0.0';



  if (!book) return <div>Завантаження...</div>;

  return (
    <div className={styles['container']}>
      <Header/>
      <div className={styles.container_book}>
        <LinkBack>На головну</LinkBack>

        <div className={styles.main_book}>
          <div className={styles.info_book}>
            <div className={styles.header_book}>
              <h1>{book.title}</h1>
              <div className={styles.favorites_book}></div>
            </div>

            <div className={styles.description_book}>
            <div className={styles.description_book_raiting}>
              <p>Жанр: <span style={{ textDecoration: "underline" }}>{book.genres.join(", ")}</span></p>
              {comments.length > 0 && (
                <p>Оцінка: {averageRating} / 5</p>
              )}
            </div>
              <p>Автор: {book.author}</p>

              <div className={styles.description_about_book}>
                <p>Опис:</p>
                <p>{book.description}</p>
              </div>

              <div className={styles.teg_book}>
                <p>Теги: </p>
                <a href="">{book.tags}</a>
              </div>

              <div className={styles.comments_container}>
                <div className={styles.view_comments} onClick={toggleComments}>
                  <p>Коментарі ({comments.length})</p>
                  <div>
                    <img
                      src="/icons/dropmenu.svg"
                      alt=""
                      className={showComments ? styles.rotated : ""}
                    />
                  </div>
                </div>
                <a href="" onClick={e => {
                  e.preventDefault();
                  setShowCommentdModal(true);
                }}>
                  + Додати коментар
                </a>

                {showCommentdModal && (
                  <ModalComment
                    onClose={() => setShowCommentdModal(false)}
                    bookId={book.id.toString()}
                  />
                )}
              </div>

              {showComments && (
                <div>
                  {commentsLoading && <p>Завантаження коментарів...</p>}
                  {!commentsLoading && comments.length === 0 && <p>Коментарі відсутні.</p>}
                  {!commentsLoading && comments.length > 0 && comments.map(comment => (
                    <CommentData key={comment.id} data={comment} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.func_book}>
            <div className={styles.image_book}>
              <img src={`${PREFIX}/storage/${book.image_url}`} alt={book.title} />
            </div>
            <div className={styles.button_book}>
              <Link to={`/book/${book.id}/1`} className={styles.button_book_orange}>Читати онлайн</Link>
              <button className={styles.button_book_black} onClick={() => setShowDownLoadModal(true)}>Завантажити</button>
              {showDownLoadModal && (
                <ModalDownload
                  onClose={() => setShowDownLoadModal(false)}
                  bookId={book.id.toString()}
                  format={book.formats[0]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Book
