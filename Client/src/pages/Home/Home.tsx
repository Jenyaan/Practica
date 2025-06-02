import React from 'react'
import Footer from '../../components/simple/Footer/Footer'
import Header from '../../components/simple/Header/Header'
import styles from "./Home.module.css"
import type { PropsCart } from '../../components/smart/BookCart/BookCart'
import BookCart from '../../components/smart/BookCart/BookCart'
import { Link } from 'react-router-dom'

const Home = () => {

  const cartItems: PropsCart[] = [
    {
      id: 1,
      title: 'Wireless Mouse',
      image: '/cart.png'
    },
    {
      id: 2,
      title: 'Mechanical Keyboard',
      image: '/cart.png'
    },
    {
      id: 3,
      title: 'USB-C Hub',
      image: '/cart.png'
    },
    {
      id: 4,
      title: 'Laptop Stand',
      image: '/cart.png'
    },
    {
      id: 5,
      title: 'Webcam',
      image: '/cart.png'
    },
    {
      id: 6,
      title: 'Noise Cancelling Headphones',
      image: '/cart.png'
    }
  ];


  return (
    <div className={styles['container']}>
        <Header/>
        <div className={styles["home_main"]}>
          <h1>Мої Книги</h1>
          <div className={styles["view_books"]}>
            <div className={styles["cataloge_books"]}>
              {cartItems.map((cart) => (
                <Link to= {`/book/${cart.id}`} className={styles['link-book']}><BookCart key = {cart.id} {...cart}/></Link>
              ))}
            </div>
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