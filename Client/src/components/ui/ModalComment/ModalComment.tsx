import React, { useState } from 'react';
import styles from './ModalComment.module.css';

type Props = {
  onClose: () => void;
  onSubmit: (comment: string, rating: number) => void;
};

const ModalComment: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(4);

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
        <button className={styles.addButton} onClick={() => onSubmit(comment, rating)}>
          Додати
        </button>
      </div>
    </div>
  );
};

export default ModalComment;
