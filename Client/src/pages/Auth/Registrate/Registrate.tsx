import React from 'react'
import styles from '../../../overlays/Auth/Auth.module.css'
import { Link } from 'react-router-dom'


const Registrate = () => {
  return (
    <>
        <h1 className={styles["auth_title"]}>Реєстрація</h1>
        <form action="" method="post" className={styles["auth_form"]}>
            <input type="text" placeholder="Ім’я " className={styles["auth_input"]}/>
            <input type="email" placeholder="Пошта" className={styles["auth_input"]}/>
            <input type="password" placeholder="Пароль" className={styles["auth_input"]}/>
            <input type="password" placeholder="Підтвердження паролю" className={styles["auth_input"]}/>
            <button className={styles["auth_button"]}>Створити</button>
        </form>
        <div className={styles["auth_description"]}>
            <p>Вже є аккаунт ?<Link to='/auth/login' className={styles['link']}>Увійти</Link></p>
        </div>
    </>
  )
}

export default Registrate