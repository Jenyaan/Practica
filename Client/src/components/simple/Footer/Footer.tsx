import React from 'react'
import styles from "../Footer/Footer.module.css"

const Footer = () => {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer_description"]}>
        <p>Про нас</p>
        <p>План оплати</p>
        <p>Правила сайту</p>
      </div>
      <div className={styles["footer_social"]}>
        <p>Соціальні мережі</p>
        <div className={styles["footer_message"]}>
          <div><img src="/icons/facebook.svg" alt="" /></div>
          <div><img src="/icons/instagram.svg" alt="" /></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
