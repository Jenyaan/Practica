import React, { useState } from 'react'
import Footer from '../../components/simple/Footer/Footer'
import Header from '../../components/simple/Header/Header'
import styles from "./Book.module.css"
import { Link } from 'react-router-dom'
import Comments from '../../components/ui/comment/Comments'

const Book = () => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  return (
    <div className={styles['container']}>
        <Header/>
        <div className={styles.container_book}>
        <Link to='/home' className={styles.link_home}>
            <div><img src="/left-arrow.png" alt="" /></div>
            <p>На головну</p>
        </Link>

        <div className={styles.main_book}>
            <div className={styles.info_book}>
            <div className={styles.header_book}>
                <h1>48 Законів власті</h1>
                <div className={styles.favorites_book}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="30" viewBox="0 0 32 30" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.3656 9.75502L22.5322 8.80942C22.1456 8.76302 21.8089 8.53102 21.6306 8.18862L18.5839 2.33263C18.5789 2.32623 18.5756 2.31983 18.5722 2.31183C18.2922 1.81423 17.8572 1.39663 17.3322 1.12943C15.9206 0.439825 14.1689 0.971026 13.4239 2.33263L10.374 8.18703C10.194 8.52943 9.85398 8.76303 9.45231 8.81103L2.63398 9.75502C1.97398 9.84942 1.39565 10.131 0.965648 10.5662C0.435648 11.0926 0.152315 11.787 0.167315 12.5198C0.182315 13.2526 0.493981 13.9326 1.04065 14.435L5.98565 19.0046C6.26065 19.251 6.38898 19.627 6.32231 19.9934L5.15398 26.4222C5.05398 27.0222 5.16065 27.6414 5.45065 28.1534C5.81398 28.8094 6.41898 29.2878 7.15565 29.5054C7.43398 29.587 7.71898 29.627 8.00065 29.627C8.46398 29.627 8.92232 29.5182 9.33732 29.3054L15.4372 26.2782C15.7906 26.0974 16.2156 26.0974 16.5772 26.2814L22.6472 29.2958C23.1922 29.5838 23.8139 29.6878 24.4689 29.5918C26.0339 29.3454 27.1056 27.9214 26.8506 26.4094L25.6839 19.9934C25.6156 19.6158 25.7422 19.2462 26.0306 18.9806L30.9606 14.435C31.4222 14.0078 31.7256 13.4366 31.8089 12.827C32.0139 11.3358 30.9156 9.95662 29.3656 9.75502Z" fill="rgba(134, 85, 0, 1)" />
                </svg>
                </div>
            </div>

            <div className={styles.description_book}>
                <p>Жанр: <span style={{ textDecoration: "underline" }}>Психологія</span></p>
                <p>Автор: Роберт Грін</p>

                <div className={styles.description_about_book}>
                <p>Опис:</p>
                <p>
                    "48 законів влади" Роберта Гріна – це практичний посібник, який досліджує принципи та стратегії, що дозволяють здобувати та підтримувати владу. Книга об'єднує історичний досвід правителів, політиків та інших впливових фігур, щоб вивести 48 основних правил та законів, які допомагають у досягненні успіху та контролю над ситуаціями.
                </p>
                </div>

                <div className={styles.teg_book}>
                <p>Теги: </p>
                <a href="">#психологія</a>
                <a href="">#РобертаГріна</a>
                </div>

                <div className={styles.comments_container}>
                    <div className={styles.view_comments}  onClick={toggleComments}>
                        <p>Коментарі (2)</p>
                        <div>    
                            <img
                            src="/icons/dropmenu.svg"
                            alt=""
                            className={showComments ? styles.rotated : ""}
                            /></div>
                    </div>
                    <a href="">+ Додати коментар</a>
                </div>
                {showComments && <Comments />}

            </div>
            </div>

            <div className={styles.func_book}>
            <div className={styles.image_book}>
                <img src="/cart.png" alt="" />
            </div>
            <div className={styles.button_book}>
                <button className={styles.button_book_orange}>Читати онлайн</button>
                <button className={styles.button_book_black}>Завантажити</button>
            </div>
            </div>
        </div>
        </div>
        <Footer/>
    </div>

  )
}

export default Book