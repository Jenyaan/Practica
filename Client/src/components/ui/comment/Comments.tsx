import React from 'react';
import styles from './Commnet.module.css';

const Comment = () => {
  return (
    <div className={styles['container-comment']}>
      <div className={styles['info-comment']}>
        <div className={styles['avatar-comment']}>
          <img src="/icons/avatar.svg" alt="Avatar" />
        </div>

        <div className={styles['user-comment']}>
          <p className={styles.username}>Jekan34</p>
          <p className={styles.date}>21.05.2025</p>
        </div>

        <div className={styles['rating-comment']}>
          {[1, 2, 3, 4].map((_, i) => (
            <img key={i} src="/icons/star-fill.png" alt="Star" />
          ))}
          <img src="/icons/star-outline.png" alt="Star" />
        </div>

        <div className={styles['review-actions']}>
          <div className={styles['like-comment']}>
            <img src="/icons/like.svg" alt="Like" />
            <p>(1)</p>
          </div>
          <div className={styles['dislike-comment']}>
            <img src="/icons/dislike.svg" alt="Dislike" />
            <p>(0)</p>
          </div>
        </div>
      </div>

      <div className={styles['description-comment']}>
        <p>Дуже сподобалась книга! Варта вашого часу</p>
      </div>
    </div>
  );
};

export default Comment;
