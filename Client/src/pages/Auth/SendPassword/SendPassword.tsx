import React from 'react'
import styles from '../../../overlays/Auth/Auth.module.css'

const SendPassword = () => {
  return (
     <>
        <h1 className={styles["auth_title"]}>Відновлення паролю</h1>
        <p>Напишіть пошту до якої прив'язаний акаунт, прийде лист для відновлення пароля</p>
        <form action="" method="post" className={styles["auth_form"]}>
            <input type="email" placeholder="Пошта" className={styles["auth_input"]}/>
            <button className={styles["auth_button"]}>Відправити</button>
        </form>
    </>
  )
}

export default SendPassword