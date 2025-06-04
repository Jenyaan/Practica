import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Header from '../../components/simple/Header/Header';
import Footer from '../../components/simple/Footer/Footer';
import LinkBack from '../../components/ui/LinkBack/LinkBack';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PREFIX } from '../../api/API';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

type ProfileFormData = {
  name: string;
  email: string;
  plan: string;
};

const Profile = () => {
  const jwt = useSelector((state: RootState) => state.user.jwt);
  const [isIdUser, setisIdUser] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      plan: 'Обмежений',
    },
  });

  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, email } = response.data;

        const defaultValues: ProfileFormData = {
          name: name || '',
          email: email || '',
          plan: 'Обмежений',
        };

        reset(defaultValues);
        setInitialData(defaultValues);
        setisIdUser(response.data.id)

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (jwt) {
      fetchUserData(jwt);
    } else {
      console.log('JWT token is missing');
    }
  }, [jwt, reset]);

  const watchedValues = watch();

  const isChanged = initialData
    ? initialData.name !== watchedValues.name ||
      initialData.email !== watchedValues.email
    : false;

    const onSubmit = async (data: ProfileFormData) => {
        
    if (!jwt || !isIdUser || !initialData) {
        console.error('JWT, ID користувача або початкові дані відсутні');
        return;
    }

    const payload: Partial<ProfileFormData> = {};
    if (data.name !== initialData.name) payload.name = data.name;
    if (data.email !== initialData.email) payload.email = data.email;

    try {
        const response = await axios.patch(`${PREFIX}/api/v1/users/${isIdUser}`, payload, {
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
        });

        console.log('Оновлення успішне:', response.data);

        // Оновлюємо initialData, щоб скинути стан isChanged
        setInitialData({
        name: response.data.name,
        email: response.data.email,
        plan: 'Обмежений'
        });

    } catch (error) {
        console.error('Помилка під час оновлення даних:', error);
    }
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
                {...register('name', { required: 'Обов’язкове поле' })}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
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
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field_group}>
              <label>
                Використовується план
                <Link to="" className={styles.change_link}>
                  змінити
                </Link>
              </label>
              <input
                className={styles.input_readonly}
                readOnly
                {...register('plan')}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.update_button}
            disabled={!isChanged}
          >
            Оновити дані
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
