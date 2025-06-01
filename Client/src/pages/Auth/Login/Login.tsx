import styles from '../../../overlays/Auth/Auth.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = () => console.log("d"); 

  return (
    <>
      <h1 className={styles.auth_title}>Вхід</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register("email", { required: "Пошта обов’язкова", pattern: { value: /^\S+@\S+$/i, message: "Невірний формат пошти" } })} 
          placeholder="Пошта" className={styles.auth_input} />
        <input 
          {...register("password", { required: "Пароль обов’язковий", minLength: { value: 6, message: "Мінімум 6 символів" } })} 
          type="password" placeholder="Пароль" className={styles.auth_input} />

        {(errors.email || errors.password) && (
          <p className={styles.auth_error}>
            {typeof errors.email?.message === "string"
              ? errors.email.message
              : typeof errors.password?.message === "string"
              ? errors.password.message
              : ""}
          </p>
        )}

        <button type="submit" className={styles.auth_button}>Увійти</button>
      </form>
      <div className={styles.auth_description}>
        <p>Не зареєстровані? <Link to="/auth/registrate" className={styles.link}>Створити користувача</Link></p>
        <p>Забули пароль? <Link to="/auth/send-password" className={styles.link}>Відновити</Link></p>
      </div>
    </>
  );
};

export default Login;
