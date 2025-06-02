import { useState } from "react";
import styles from "../Header/Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className={styles["header"]}>
      <div className={styles["header_left"]}>
        <div className={styles["header_logo"]}>
          <img src="/logo.svg" alt="" />
        </div>
        <div className={styles["header_search"]}>
          <input type="text" />
          <a href="#"><img src="/icons/search.svg" alt="" /></a>
        </div>
      </div>
      <div className={styles["header_right"]}>
        <div className={styles["header_avatar"]}>
          <img src="/icons/avatar.svg" alt="" />
        </div>
        <p>Jekan34</p>
        <div
          className={`${styles["header_dropmenu"]} ${isMenuOpen ? styles["rotated"] : ""}`}
          onClick={toggleMenu}
        >
          <img src="/icons/dropmenu.svg" alt="" />
        </div>
        {isMenuOpen && (
          <ul className={styles["dropdown_menu"]}>
            <li><a href="#">Профіль</a></li>
            <li><a href="#">Налаштування</a></li>
            <li><a href="#">Вийти</a></li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
