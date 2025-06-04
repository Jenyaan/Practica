import React, { useEffect, useRef, useState } from 'react';
import type { DragEvent, ChangeEvent, FormEvent } from 'react';
import Footer from '../../components/simple/Footer/Footer';
import Header from '../../components/simple/Header/Header';
import styles from './AddBook.module.css';
import { PREFIX } from '../../api/API';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface BookData {
  title: string;
  author: string;
  genre: string;
  description: string;
  tags: string;
  access: string;
  coverImage: File | null;
  bookFiles: File[];
}


const AddBook = () => {
    const jwt = useSelector((state: RootState) => state.user.jwt);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isIdUser, setisIdUser] = useState<number | null>(null);
    const [bookData, setBookData] = useState<BookData>({
        title: '',
        author: '',
        genre: 'Жанр',
        description: '',
        tags: '',
        access: 'Доступ',
        coverImage: null,
        bookFiles: []
    });
  
  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await axios.get(`${PREFIX}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, [jwt]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleMultipleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setBookData(prev => ({
        ...prev,
        bookFiles: [...prev.bookFiles, ...newFiles]
        }));
    }
    };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      setBookData(prev => ({
        ...prev,
        [name]: e.target.files![0]
      }));
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setBookData(prev => ({
        ...prev,
        bookFiles: [...prev.bookFiles, ...droppedFiles]
        }));
    }
    };

const removeFile = (index: number) => {
  setBookData(prev => {
    const updatedFiles = [...prev.bookFiles];
    updatedFiles.splice(index, 1);
    return {
      ...prev,
      bookFiles: updatedFiles
    };
  });
};


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('title', bookData.title);
  formData.append('author', bookData.author);

  if (bookData.coverImage) {
    formData.append('image', bookData.coverImage);
  }

  formData.append('genres[0]', '1');


  if (bookData.description) {
    formData.append('description', bookData.description);
  }

  if (bookData.tags) {
    formData.append('tags', bookData.tags);
  }

  if (bookData.access !== 'Доступ') {
    formData.append('public', bookData.access === 'Публічний' ? '1' : '0');
  }

  bookData.bookFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  try {
    const response = await axios.post(
      `${PREFIX}/api/v1/users/${isIdUser}/books`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log(response);

    alert('Книга успішно додана!');
    setBookData({
      title: '',
      author: '',
      genre: 'Жанр',
      description: '',
      tags: '',
      access: 'Доступ',
      coverImage: null,
      bookFiles: [],
    });
  } catch (error: any) {
    if (error.response) {
      console.error('Помилка:', error.response.data);
      alert('Помилка додавання книги');
    } else {
      console.error('Помилка під час надсилання форми:', error);
      alert('Непередбачена помилка');
    }
  }
};


  return (
    <div>
      <Header />
      <div className={styles.main}>
        <h2>Додавання книги</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Назва книги"
            value={bookData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Автор"
            value={bookData.author}
            onChange={handleChange}
            required
          />
          <select name="genre" value={bookData.genre} onChange={handleChange} required >
            <option disabled value="Жанр">Жанр</option>
            <option value="Фантастика">Фантастика</option>
            <option value="Драма">Драма</option>
            <option value="Роман">Роман</option>
          </select>

            <div className={styles.fileDrop}>
            {bookData.coverImage ? (
                <div className={styles.fileItem}>
                <div className={styles.imagePreview}>
                  <img
                    src="/icons/file.svg"
                    alt="Обкладинка"
                  />
                </div>
                <span className={styles.fileName}>{bookData.coverImage.name}</span>
                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => setBookData(prev => ({ ...prev, coverImage: null }))}
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
            {bookData.bookFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                <div className={styles.imagePreview}>
                  <img
                    src="/icons/file.svg"
                    alt="Файл"
                  />
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
            name="description"
            placeholder="Опис"
            rows={5}
            value={bookData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Теги (розділяйте пробілом)"
            value={bookData.tags}
            onChange={handleChange}
          />
          <select
            name="access"
            value={bookData.access}
            onChange={handleChange}
            required
          >
            <option disabled value="Доступ">Доступ</option>
            <option value="Публічний">Публічний</option>
            <option value="Приватний">Приватний</option>
          </select>
          <button type="submit" className={styles.submit}>Додати</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddBook; 