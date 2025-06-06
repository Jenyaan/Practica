import React from 'react';
import styles from './Commnet.module.css';

export interface PropsCommentData {
  id: number;
  user_name: string;
  score: number;
  created_at: string;
  text:string
}

interface BookCommentProps {
  data: PropsCommentData;
}

const BookComment: React.FC<BookCommentProps> = ({ data }) => {
  console.log(data.score)
  return (
    <div className={styles['container-comment']}>
      <div className={styles['info-comment']}>
        <div className={styles['avatar-comment']}>
          <img src="/icons/avatar.svg" alt="Avatar" />
        </div>

        <div className={styles['user-comment']}>
          <p className={styles.username}>{data.user_name}</p>
          <p className={styles.date}>{new Date(data.created_at).toLocaleDateString('uk-UA')}</p>
        </div>

        <div className={styles['rating-comment']}>
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={i <= data.score ? '/icons/star-fill.png' : '/icons/star-outline.png'}
              alt="Star"
            />
          ))}
        </div>
      </div>

      <div className={styles['description-comment']}>
        <p>{data.text}</p>
      </div>
    </div>
  );
};

export default BookComment;
