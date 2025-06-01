import styles from '../../../overlays/Auth/Auth.module.css';
import { useForm } from 'react-hook-form';

const SendPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data); // замінити на axios

  return (
    <>
      <h1 className={styles.auth_title}>Відновлення паролю</h1>
      <p>Напишіть пошту до якої прив'язаний акаунт, прийде лист для відновлення пароля</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register("email", { required: "Пошта обов’язкова", pattern: { value: /^\S+@\S+$/i, message: "Невірний формат пошти" } })} 
          placeholder="Пошта" className={styles.auth_input} />

        {errors.email && (
          <p className={styles.auth_error}>
            {typeof errors.email.message === "string" ? errors.email.message : ""}
          </p>
        )}

        <button type="submit" className={styles.auth_button}>Відправити</button>
      </form>
    </>
  );
};

export default SendPassword;
