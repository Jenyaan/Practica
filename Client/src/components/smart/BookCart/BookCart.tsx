import React from 'react'
import styles from './BookCart.module.css'
import { PREFIX } from '../../../api/API';

export interface PropsCart{
    id: number;
    title: string;
    image_url: string;
} 

const BookCart = (cart: PropsCart) => {
  return (
    <div className={styles["cart_book"]}>
        <div><img src={`${PREFIX}/storage/${cart.image_url}`} alt={cart.title} /></div>
        <p>{cart.title}</p>
    </div>
  )
}

export default BookCart