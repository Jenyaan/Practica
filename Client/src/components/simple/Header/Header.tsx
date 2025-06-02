import { useState } from "react";
import styles from "../Header/Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className={styles["header"]}>
      <div className={styles["header_left"]}>
        <Link to="/home" className={styles["header_logo"]}><img src="/logo.svg" alt="" /></Link>
        <div className={styles["header_search"]}>
          <input type="text" />
          <Link to='#' className={styles["header_search_link"]}><img src="/icons/search.svg" alt="" /></Link>
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
            <li><Link to="#" className={styles["dropdown_menu_link"]}>Профіль</Link></li>
            <li><Link to="/create-book" className={styles["dropdown_menu_link"]}>Додати книгу</Link></li>
            <li><Link to="#" className={styles["dropdown_menu_link"]}>Вийти</Link></li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
