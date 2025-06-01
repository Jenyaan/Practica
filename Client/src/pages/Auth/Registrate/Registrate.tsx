import styles from '../../../overlays/Auth/Auth.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { RegistrateRequest } from '../../../models/AuthModel';
import axios from 'axios';
import { PREFIX } from '../../../api/API';

const Registrate = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const [serverMessage, setServerMessage] = useState('');

  
  const onSubmit = async (dataF: any) => {

    const data: RegistrateRequest = {
      name: dataF.name,
      email: dataF.email,
      password: dataF.password
    }
    
    try {
      const response = await axios.post(`${PREFIX}/api/v1/users`, data);

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
      <h1 className={styles.auth_title}>Реєстрація</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>

        <input 
        {...register('name', { required: 'Ім’я обов’язкове' })}
         placeholder="Ім’я" className={styles.auth_input} />

        <input 
        {...register('email', { required: 'Пошта обов’язкова', pattern: { value: /^\S+@\S+$/i, message: 'Невірний формат пошти' } })}
         placeholder="Пошта" className={styles.auth_input} />
        
        <input 
        {...register('password', { required: 'Пароль обов’язковий', minLength: { value: 6, message: 'Мінімум 6 символів' } })}
         type="password" placeholder="Пароль" className={styles.auth_input} />
        
        <input 
        {...register('confirmPassword', { required: 'Підтвердження обов’язкове', validate: v => v === password || 'Паролі не співпадають' })}
         type="password" placeholder="Підтвердження паролю" className={styles.auth_input} />

        {(errors.email || errors.password || errors.name) && (
          <p className={styles["auth_error"]}>
            {typeof errors.email?.message === "string"
              ? errors.email.message
              : typeof errors.password?.message === "string"
              ? errors.password.message
              : typeof errors.name?.message === "string"
              ? errors.name.message
              : serverMessage}
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
