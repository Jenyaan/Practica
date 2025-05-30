import React from 'react'
import Footer from '../../components/simple/Footer/Footer'
import Header from '../../components/simple/Header/Header'
import styles from "./Home.module.css"


const Home = () => {
  return (
    <div className={styles['container']}>
        <Header/>
        <div className={styles["home_main"]}>
          <h1>Мої Книги</h1>
          <div className={styles["view_books"]}>
            <div id="cart" className={styles["cataloge_books"]}></div>
            <div className={styles["fillter_books"]}>
              <input type="text" id="search" placeholder="Пошук за автором чи назвою" />
              <select id="genre">
                <option value="">Жанр</option>
                <option value="history">Історія</option>
                <option value="fiction">Художня</option>
              </select>
            </div>
          </div>
          <div className={styles["pagination"]}>
            <p>1 ... 3 <span>4</span> 5 ... 12</p>
          </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Home