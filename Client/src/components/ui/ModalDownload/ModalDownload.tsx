import React from 'react';
import styles from './ModalDownload.module.css';

type ModalProps = {
  onClose: () => void;
  onDownload: (format: string) => void;
};

const ModalDownload: React.FC<ModalProps> = ({ onClose, onDownload }) => {
  const formats = ['PDF', 'RTF', 'TXT', 'EPUD', 'FB2', 'DOCX'];

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
          {formats.map((format) => (
            <button
              key={format}
              className={styles.formatButton}
              onClick={() => onDownload(format)}
            >
              {format}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalDownload;
