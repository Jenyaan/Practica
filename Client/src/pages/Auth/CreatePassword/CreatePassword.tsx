import React from 'react'
import styles from '../../../overlays/Auth/Auth.module.css'

const CreatePassword = () => {
  return (
     <>
      <h1 className={styles["auth_title"]}>Створення нового пароля</h1>
      <form action="" method="post" className={styles["auth_form"]}>
        <input type="password" placeholder="Пароль" className={styles["auth_input"]}/>
        <input type="password" placeholder="Підтвердження паролю" className={styles["auth_input"]}/>
        <button type="submit" className={styles["auth_button"]}>
          Створити
        </button>
      </form>
    </>
  )
}

export default CreatePassword