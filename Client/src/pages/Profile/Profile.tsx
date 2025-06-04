import React, { useState } from 'react';
import styles from './Profile.module.css';
import Header from '../../components/simple/Header/Header';
import Footer from '../../components/simple/Footer/Footer';
import LinkBack from '../../components/ui/LinkBack/LinkBack';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type ProfileFormData = {
  username: string;
  email: string;
  plan: string;
};

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: 'Jekan',
      email: 'Jekaniks34@gmail.com',
      plan: 'Обмежений',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log('Оновлені дані:', data);
    // Тут можна викликати API або dispatch
  };

  return (
    <div className={styles.container}>
      <Header />
      <LinkBack>На головну</LinkBack>

      <div className={styles.profile_main}>
        <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
          <h2>Профіль</h2>

          <div className={styles.row}>
            <div className={styles.field_group}>
              <label>Ім’я користувача</label>
              <input
                className={styles.input}
                {...register('username', { required: 'Обов’язкове поле' })}
              />
              {errors.username && <p className={styles.error}>{errors.username.message}</p>}
            </div>

            <div className={styles.field_group}>
              <label>Пошта</label>
              <input
                type="email"
                className={styles.input}
                {...register('email', {
                  required: 'Обов’язкове поле',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Невірний формат пошти',
                  },
                })}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field_group}>
              <label>
                Використовується план
                <Link to = '' className={styles.change_link}>змінити</Link>
              </label>
              <input
                className={styles.input_readonly}
                readOnly
                {...register('plan')}
              />
            </div>
          </div>
          
          <button type="submit" className={styles.update_button}>
            Оновити дані
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
