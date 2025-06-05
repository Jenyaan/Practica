import styles from './Auth.module.css'
import { Outlet } from 'react-router-dom'

const Auth = () => {
  return (
    <div className={styles['auth-container']}>
        <div className={styles['auth-main']}>
            <Outlet/>
        </div>
    </div>
  )
}

export default Auth