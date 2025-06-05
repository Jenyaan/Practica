import { useEffect, useState } from "react";
import styles from "../Header/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { userActions } from "../../../store/auth.slice";
import axios from "axios";
import { PREFIX } from "../../../api/API";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isName, setIsName] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
  const { jwt } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');


  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate('/auth/login');
  };

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (jwt) {
      fetchUserData(jwt);
    } else {
      console.log('JWT token is missing');
    }
  }, [jwt]);


  return (
    <header className={styles["header"]}>
      <div className={styles["header_left"]}>
        {jwt ? 
        (<Link to="/home" className={styles["header_logo"]}><img src="/logo.svg" alt="" /></Link>):
        (<Link to="/" className={styles["header_logo"]}><img src="/logo.svg" alt="" /></Link>)
        }
        <div className={styles["header_search"]}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Link 
            to={`/search/${encodeURIComponent(searchTerm)}`} 
            className={styles["header_search_link"]}
          >
            <img src="/icons/search.svg" alt="Search" />
          </Link>
        </div>
      </div>
      {jwt ?(
        <div className={styles["header_right"]}>
          <div className={styles["header_avatar"]}>
            <img src="/icons/avatar.svg" alt="" />
          </div>
          <p>{isName}</p>
          <div
            className={`${styles["header_dropmenu"]} ${isMenuOpen ? styles["rotated"] : ""}`}
            onClick={toggleMenu}
          >
            <img src="/icons/dropmenu.svg" alt="" />
          </div>
          {isMenuOpen && (
            <ul className={styles["dropdown_menu"]}>
              <Link to="/profile" className={styles["dropdown_menu_link"]}><li>Профіль</li></Link>
              <Link to="/create-book" className={styles["dropdown_menu_link"]}><li>Додати книгу</li></Link>
              <Link to="#" className={styles["dropdown_menu_link"]} onClick={handleLogout}><li>Вийти</li></Link>
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
