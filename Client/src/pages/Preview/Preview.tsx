import React, { useEffect } from 'react'
import Header from '../../components/simple/Header/Header'
import Footer from '../../components/simple/Footer/Footer'
import styles from "../Preview/Preview.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

const Preview = () => {
  const { jwt } = useSelector((s: RootState) => s.user);
  const navigate = useNavigate();

  useEffect(() => { 
    if (jwt) navigate('/home'); 
  }, [jwt, navigate]);

  return (
    <div className={styles['container']}>
        <Header/>
        <div className={styles["home_main"]}>
          <div className={styles["home_description"]}>
            <h1>
              Ласкаво просимо у твій цифровий книжковий простір — завантажуй улюблені книги, читай у зручний момент, зберігай у власній бібліотеці або ділися з друзями. Зручно, надійно й завжди поруч.
            </h1>
            <Link to='auth/registrate' className={styles["home_button"]}>Почати</Link>
          </div>
          <div className={styles["home_image"]}>
            <img src="/Home.png" alt="" />
          </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Preview