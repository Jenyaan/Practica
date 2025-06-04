import { useState } from "react";
import styles from "../Header/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { userActions } from "../../../store/auth.slice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
  const { jwt } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate('/auth/login');
  };


  return (
    <header className={styles["header"]}>
      <div className={styles["header_left"]}>
        {jwt ? 
        (<Link to="/home" className={styles["header_logo"]}><img src="/logo.svg" alt="" /></Link>):
        (<Link to="/" className={styles["header_logo"]}><img src="/logo.svg" alt="" /></Link>)
        }
        <div className={styles["header_search"]}>
          <input type="text" />
          <Link to='#' className={styles["header_search_link"]}><img src="/icons/search.svg" alt="" /></Link>
        </div>
      </div>
      {jwt ?(
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
              <li><Link to="/profile" className={styles["dropdown_menu_link"]}>Профіль</Link></li>
              <li><Link to="/create-book" className={styles["dropdown_menu_link"]}>Додати книгу</Link></li>
              <li><Link to="#" className={styles["dropdown_menu_link"]} onClick={handleLogout}>Вийти</Link></li>
            </ul>
          )}
        </div>
      ):(
        <div className={styles["header_right"]}>
          <Link to="/auth/registrate" className={styles["auth_link"]}>Реєстрація</Link>
          <Link to="/auth/login" className={styles["auth_link"]}>Вхід</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
