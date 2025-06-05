import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/simple/Footer/Footer';
import Header from '../../components/simple/Header/Header';
import styles from './AddBook.module.css';
import axios from 'axios';
import { PREFIX } from '../../api/API';
import type { RootState } from '../../store/store';

interface FormValues {
  title: string;
  author: string;
  genre: string;
  description?: string;
  tags?: string;
  access: string;
  coverImage: FileList;
}

const AddBook = () => {
  const jwt = useSelector((state: RootState) => state.user.jwt);
  const [isIdUser, setIsIdUser] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [bookFiles, setBookFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsIdUser(response.data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (jwt) fetchUserData(jwt);
  }, [jwt]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
  // Валідація зображення
  if (!coverImage) {
    alert('Оберіть зображення обкладинки!');
    return;
  }

  if (!coverImage.type.startsWith('image/')) {
    alert('Файл обкладинки має бути зображенням!');
    return;
  }

  // Валідація файлів книг
  if (bookFiles.length === 0) {
    alert('Додайте хоча б один файл книги!');
    return;
  }

  const fileTypes = new Set<string>();
  let hasPDF = false;

  for (const file of bookFiles) {
    if (file.size === 0) {
      alert(`Файл "${file.name}" є порожнім!`);
      return;
    }

    const type = file.type;
    if (!type) {
      alert(`Файл "${file.name}" має невідомий формат!`);
      return;
    }

    if (fileTypes.has(type)) {
      alert(`Файли мають бути різних форматів! Повторюється: ${type}`);
      return;
    }

    fileTypes.add(type);

    if (type === 'application/pdf') {
      hasPDF = true;
    }
  }

  if (!hasPDF) {
    alert('Серед файлів книг має бути хоча б один PDF!');
    return;
  }

  // Формування FormData та відправка
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('author', data.author);
  formData.append('genres[0]', '1');
  formData.append('image', coverImage);

  if (data.description) {
    formData.append('description', data.description);
  }

  if (data.tags) {
    formData.append('tags', data.tags);
  }

  formData.append('public', data.access === 'Публічний' ? '1' : '0');

  bookFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  try {
    await axios.post(
      `${PREFIX}/api/v1/users/${isIdUser}/books`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    alert('Книга успішно додана!');
    navigate('/home');
  } catch (error: any) {
    console.error('Помилка додавання книги:', error.response || error);
    alert('Не вдалося додати книгу');
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setBookFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setBookFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setBookFiles(prev => prev.filter((_, i) => i !== index));
  };

const onInvalid = (errors: any) => {
  const messages = Object.values(errors).map((err: any) => err.message).filter(Boolean);
  if (messages.length > 0) {
    alert(messages.join('\n'));
  }
};

  return (
    <div className={styles.containerAddBook}>
      <Header />
      <div className={styles.main}>
        <h2>Додавання книги</h2>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <input
            {...register("title", {
              required: "Назва обов’язкова",
              minLength: { value: 10, message: "Мінімум 10 символів" },
              maxLength: { value: 50, message: "Максимум 50 символів" }
            })}
            placeholder="Назва книги"
            className={errors.title ? styles.inputError : ''}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}

          <input
            {...register("author", {
              required: "Автор обов’язковий",
              maxLength: { value: 50, message: "Максимум 50 символів" }
            })}
            placeholder="Автор"
            className={errors.author ? styles.inputError : ''}
          />
          {errors.author && <p className={styles.error}>{errors.author.message}</p>}

          <select {...register("genre", { required: "Жанр обов’язковий" })}>
            <option disabled value="">Жанр</option>
            <option value="Фантастика">Фантастика</option>
            <option value="Драма">Драма</option>
            <option value="Роман">Роман</option>
          </select>
          {errors.genre && <p className={styles.error}>{errors.genre.message}</p>}

          <div className={styles.fileDrop}>
            {coverImage ? (
              <div className={styles.fileItem}>
                <div className={styles.imagePreview}>
                  <img src="/icons/file.svg" alt="Обкладинка" />
                </div>
                <span className={styles.fileName}>{coverImage.name}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => setCoverImage(null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className={styles.addFileLabel}
                onClick={() => fileInputRef.current?.click()}
              >
                + Додати зображення
              </div>
            )}
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div
            className={`${styles.fileDrop} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {bookFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.imagePreview}>
                  <img src="/icons/file.svg" alt="Файл" />
                </div>
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            <label className={styles.addFileLabel}>
              + Додати файл
              <input
                type="file"
                multiple
                onChange={handleMultipleFilesChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <textarea
            {...register("description", { maxLength: { value: 500, message: "Максимум 500 символів" } })}
            placeholder="Опис"
            rows={5}
          />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}

          <input
            {...register("tags", { maxLength: { value: 100, message: "Максимум 100 символів" } })}
            placeholder="Теги (розділяйте пробілом)"
          />
          {errors.tags && <p className={styles.error}>{errors.tags.message}</p>}

          <select {...register("access", { required: "Виберіть доступ" })}>
            <option disabled value="">Доступ</option>
            <option value="Публічний">Публічний</option>
            <option value="Приватний">Приватний</option>
          </select>
          {errors.access && <p className={styles.error}>{errors.access.message}</p>}

          <button type="submit" className={styles.submit}>Додати</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddBook;
