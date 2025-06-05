import styles from '../../../overlays/Auth/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { RegistrateRequest } from '../../../models/AuthModel';
import { registration } from '../../../store/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispath, RootState } from '../../../store/store';

const Registrate = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const [serverMessage, setServerMessage] = useState('');
  const dispatch = useDispatch<AppDispath>();
  const { jwt } = useSelector((s: RootState) => s.user);
  const navigate = useNavigate();

  useEffect(() => { 
    if (jwt) navigate('/home'); 
  }, [jwt, navigate]);

  const onSubmit = async (dataF: any) => {
    const data: RegistrateRequest = {
      name: dataF.name,
      email: dataF.email,
      password: dataF.password
    }
    
    try {
      const result = await dispatch(registration(data));
      
      if (registration.fulfilled.match(result)) {
        navigate('/auth/login');
      } else if (registration.rejected.match(result)) {
        const errorMessage = result.payload as string || result.error?.message || 'Помилка реєстрації';
        setServerMessage(errorMessage);
        console.log(result);
        console.log(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <h1 className={styles.auth_title}>Реєстрація</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register('name', { required: 'Ім’я обов’язкове' })}
          placeholder="Ім’я" className={styles.auth_input} />
        <p className={styles.auth_hint}>Введіть своє повне ім’я</p>

        <input 
          {...register('email', { required: 'Пошта обов’язкова', pattern: { value: /^\S+@\S+$/i, message: 'Невірний формат пошти' } })}
          placeholder="Пошта" className={styles.auth_input} />
        <p className={styles.auth_hint}>Формат: name@example.com</p>

        <input 
          {...register('password', { required: 'Пароль обов’язковий', minLength: { value: 16, message: 'Мінімум 16 символів' } })}
          type="password" placeholder="Пароль" className={styles.auth_input} />
        <p className={styles.auth_hint}>Пароль повинен містити щонайменше 16 символів (літери, цифри та спецсимволи)</p>

        <input 
          {...register('confirmPassword', { required: 'Підтвердження обов’язкове', validate: v => v === password || 'Паролі не співпадають' })}
          type="password" placeholder="Підтвердження паролю" className={styles.auth_input} />
        <p className={styles.auth_hint}>Повторіть введений пароль</p>

      {(errors.name || errors.email || errors.password || errors.confirmPassword || serverMessage) && (
        <p className={styles["auth_error"]}>
          {errors.name?.message?.toString() ||
          errors.email?.message?.toString() ||
          errors.password?.message?.toString() ||
          errors.confirmPassword?.message?.toString() ||
          serverMessage}
        </p>
      )}

        <button type="submit" className={styles.auth_button}>Створити</button>
      </form>
      <div className={styles.auth_description}>
        <p>Вже є аккаунт? <Link to="/auth/login" className={styles.link}>Увійти</Link></p>
      </div>
    </>
  );
};

export default Registrate;
