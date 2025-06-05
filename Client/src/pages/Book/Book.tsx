import React, { useEffect, useState } from 'react'
import Footer from '../../components/simple/Footer/Footer'
import Header from '../../components/simple/Header/Header'
import styles from "./Book.module.css"
import { Link, useParams } from 'react-router-dom'
import Comments from '../../components/smart/comment/Comments'
import LinkBack from '../../components/ui/LinkBack/LinkBack'
import ModalDownload from '../../components/ui/ModalDownload/ModalDownload'
import ModalComment from '../../components/ui/ModalComment/ModalComment'
import axios from 'axios'
import { PREFIX } from '../../api/API'

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
  year?: number | null;  // добавил, чтобы соответствовать твоему описанию
}

const Book = () => {
  const [showComments, setShowComments] = useState(false);
  const [showDownLoadModal, setShowDownLoadModal] = useState<boolean>(false);
  const [showCommentdModal, setShowCommentdModal] = useState<boolean>(false);

  // Типизация состояния book с интерфейсом Book | null (до загрузки данных)
  const [book, setBook] = useState<Book | null>(null);
  const { bookId } = useParams<{ bookId: string }>();  // типизация useParams

  useEffect(() => {
    if (!bookId) return;
    axios.get<Book>(`${PREFIX}/api/v1/books/${bookId}`)
      .then((response) => {
        console.log(response);
        setBook(response.data);
      })
      .catch((error) => {
        console.error('Помилка при завантаженні книги:', error);
      });
  }, [bookId]);

  const handleDownload = (format: string) => {
    console.log(`Формат обрано: ${format}`);
    setShowDownLoadModal(false);
  };

  const handleComment = (text: string, stars: number) => {
    console.log('Коментар:', text, 'Оцінка:', stars);
    setShowCommentdModal(false);
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

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
              <div className={styles.favorites_book}>
                {/* Иконка можно оставить */}
              </div>
            </div>

            <div className={styles.description_book}>
              <div className={styles.description_book_raiting}>
                <p>Жанр: <span style={{ textDecoration: "underline" }}>{book.genres.join(", ")}</span></p>
                {/* Оценка можно вывести, если есть */}
                <p>Оцінка: 4.7 / 5</p>
              </div>
              <p>Автор: {book.author}</p>

              <div className={styles.description_about_book}>
                <p>Опис:</p>
                <p>{book.description}</p>
              </div>

              <div className={styles.teg_book}>
                <p>Теги: </p>
                {/* Можно разбить строку тегов на отдельные, если нужно */}
                <a href="">{book.tags}</a>
              </div>

              <div className={styles.comments_container}>
                <div className={styles.view_comments} onClick={toggleComments}>
                  <p>Коментарі (2)</p>
                  <div>
                    <img
                      src="/icons/dropmenu.svg"
                      alt=""
                      className={showComments ? styles.rotated : ""}
                    />
                  </div>
                </div>
                <a href="" onClick={(e) => {
                  e.preventDefault();
                  if (book.id) {
                    setShowCommentdModal(true);
                  } else {
                    console.error('bookId не визначено');
                  }
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
              {showComments && <Comments bookId={book.id} />}
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
                  format={book.formats[0]} // або той формат, який треба
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
