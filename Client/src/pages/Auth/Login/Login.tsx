import styles from '../../../overlays/Auth/Auth.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../../../models/AuthModel';
import axios from 'axios';
import { useState } from 'react';
import { PREFIX } from '../../../api/API';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [serverMessage, setServerMessage] = useState('');

  
  const onSubmit = async (data: LoginRequest) => {
  try {
    const response = await axios.post(`${PREFIX}/api/v1/auth/login`, data);

    if (response.status === 200) {
      setServerMessage('Вхід успішний!');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      setServerMessage('Невірний логін або пароль.');
    } else {
      setServerMessage('Сталася помилка. Спробуйте пізніше.');
    }
  }
};

  return (
    <>
      <h1 className={styles.auth_title}>Вхід</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register("email", { required: "Пошта обов’язкова", pattern: { value: /^\S+@\S+$/i, message: "Невірний формат пошти" } })} 
          placeholder="Пошта" className={styles.auth_input} />
        <input 
          {...register("password", { required: "Пароль обов’язковий", minLength: { value: 6, message: "Мінімум 6 символів" } })} 
          type="password" placeholder="Пароль" className={styles.auth_input} />

          {(errors.email || errors.password || serverMessage) && (
            <p className={styles.auth_error}>
              {typeof errors.email?.message === "string"
                ? errors.email.message
                : typeof errors.password?.message === "string"
                ? errors.password.message
                : serverMessage}
            </p>
          )}

        <button type="submit" className={styles.auth_button}>Увійти</button>
      </form>
      <div className={styles.auth_description}>
        <p>Не зареєстровані? <Link to="/auth/registrate" className={styles.link}>Створити користувача</Link></p>
        <p>Забули пароль? <Link to="/auth/send-password" className={styles.link}>Відновити</Link></p>
      </div>
    </>
  );
};

export default Login;
