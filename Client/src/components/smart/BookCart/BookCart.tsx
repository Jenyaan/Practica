import React from 'react'
import styles from './BookCart.module.css'

export interface PropsCart{
    id: number;
    title: string;
    image: string;
} 

const BookCart = (cart: PropsCart) => {
  return (
    <div className={styles["cart_book"]}>
        <div><img src={cart.image} alt={cart.title} /></div>
        <p>{cart.title}</p>
    </div>
  )
}

export default BookCart