import styles from '../../../overlays/Auth/Auth.module.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
      <h1 className={styles["auth_title"]}>Вхід</h1>
      <form action="" method="post" className={styles["auth_form"]}>
        <input type="email" placeholder="Пошта" className={styles["auth_input"]} />
        <input type="password" placeholder="Пароль" className={styles["auth_input"]} />
        <button className={styles["auth_button"]}>Увійти</button>
      </form>
      <div className={styles["auth_description"]}>
        <p>
          Не зареєстрований? <Link className={styles['link']} to='/auth/registrate'>Створити користувача</Link>
        </p>
        <p>
          Забули пароль? <Link className={styles['link']} to='/auth/send-password'>Відновити</Link>
        </p>
      </div>
    </>
  )
}

export default Login
