import styles from '../../../overlays/Auth/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../../../models/AuthModel';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../store/auth.slice';
import type { AppDispath, RootState } from '../../../store/store';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [serverMessage, setServerMessage] = useState('');
  const dispatch = useDispatch<AppDispath>();
  const { jwt } = useSelector((s: RootState) => s.user);
  const navigate = useNavigate();

  useEffect(() => { 
    if (jwt) navigate('/home'); 
  }, [jwt, navigate]); 

  const onSubmit = async (data: LoginRequest) => {     
    try {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
      } else if (login.rejected.match(result)) {
        console.log(result);
        setServerMessage(result.payload as string);
      }
    } catch (error) {
      console.error("Login error:", error);
    } 
  };

  return (
    <>
      <h1 className={styles.auth_title}>Вхід</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register("email", {
            required: "Пошта обов’язкова",
            pattern: { value: /^\S+@\S+$/i, message: "Невірний формат пошти" }
          })} 
          type="email"
          placeholder="Пошта"
          className={`${styles.auth_input} ${errors.email ? styles.auth_input_error : ''}`} />
        <input 
          {...register("password", {
          required: "Пароль обов’язковий",
          minLength: { value: 16, message: "Мінімум 16 символів" },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{16,}$/,
            message: "Пароль має містити цифру, велику літеру та спецсимвол"
          }})}
          type="password"
          placeholder="Пароль"
          className={`${styles.auth_input} ${errors.email ? styles.auth_input_error : ''}`} />


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
