import React from 'react'
import Header from '../../components/simple/Header/Header'
import Footer from '../../components/simple/Footer/Footer'
import styles from "../Preview/Preview.module.css"


const Preview = () => {
  return (
    <div className={styles['container']}>
        <Header/>
        <div className={styles["home_main"]}>
          <div className={styles["home_description"]}>
            <h1>
              Ласкаво просимо у твій цифровий книжковий простір — завантажуй улюблені книги, читай у зручний момент, зберігай у власній бібліотеці або ділися з друзями. Зручно, надійно й завжди поруч.
            </h1>
            <button>Почати</button>
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