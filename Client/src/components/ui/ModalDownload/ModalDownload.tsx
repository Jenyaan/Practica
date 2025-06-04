import React from 'react';
import axios from 'axios';
import styles from './ModalDownload.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

type ModalProps = {
  onClose: () => void;
  bookId: string;
  format: string;
};

const ModalDownload: React.FC<ModalProps> = ({ onClose, bookId, format }) => {
  const jwt = useSelector((state: RootState) => state.user.jwt);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `/api/v1/books/${bookId}/download/${format.toLowerCase()}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `book.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Помилка під час завантаження:', error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.close}
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClose();
          }}
        >
          <img src="/icons/close.svg" alt="Закрити" />
        </div>
        <p className={styles.title}>Завантажити книгу у форматі:</p>
        <div className={styles.buttons}>
          <button className={styles.formatButton} onClick={handleDownload}>
            {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDownload;
