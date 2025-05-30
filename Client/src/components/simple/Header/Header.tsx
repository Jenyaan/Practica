import React from 'react'
import styles from "../Header/Header.module.css"

const Header = () => {
  return (
    <header className={styles["header"]}>
      <div className={styles["header_left"]}>
        <div className={styles["header_logo"]}>
          <img src="/logo.svg" alt="" />
        </div>
        <div className={styles["header_search"]}>
          <input type="text" />
          <a href=""><img src="/icons/search.svg" alt="" /></a>
        </div>
      </div>
      <div className={styles["header_right"]}>
        <div className={styles["header_avatar"]}>
          <img src="/icons/avatar.svg" alt="" />
        </div>
        <p>Jekan34</p>
        <div className={styles["header_dropmenu"]}>
          <img src="/icons/dropmenu.svg" alt="" />
        </div>
      </div>
    </header>
  )
}

export default Header
