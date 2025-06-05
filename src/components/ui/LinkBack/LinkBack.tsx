import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './LinkBack.module.css'

export interface LinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const LinkBack = ({children}: LinkProps) => {
  return (
    <Link to='/home' className={styles.link}>
        <div><img src="/left-arrow.png" alt="" /></div>
        <p>{children}</p>
    </Link>
  )
}

export default LinkBack