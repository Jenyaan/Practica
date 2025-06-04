import React, { useEffect, useState } from 'react';
import styles from './ModalComment.module.css';
import axios from 'axios';
import { PREFIX } from '../../../api/API';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

type Props = {
  onClose: () => void;
  bookId: string;
};

const ModalComment: React.FC<Props> = ({ onClose, bookId}) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(4);
  const [idUser, setIdUser] = useState('');
  const jwt = useSelector((state: RootState) => state.user.jwt);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setIdUser(res.data.id);
      } catch (error) {
        console.error('Помилка отримання користувача:', error);
      }
    };

    if (jwt) {
      fetchUser();
    }
  }, [jwt]);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${PREFIX}/api/v1/users/${idUser}/books/${bookId}/comments`,
        {
          text: comment,
          score: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      onClose(); // закрити модалку після успішної відповіді
    } catch (error) {
      console.error('Помилка при додаванні коментаря:', error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.close} onClick={onClose}>
          <img src="/icons/close.svg" alt="close" />
        </div>
        <p className={styles.title}>Додати коментар</p>
        <textarea
          className={styles.textarea}
          placeholder="Коментар"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={styles.rating}>
          <span>Оцінка (від 1 до 5):</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? styles.starFilled : styles.star}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button className={styles.addButton} onClick={handleSubmit}>
          Додати
        </button>
      </div>
    </div>
  );
};

export default ModalComment;
