import styles from '../../../overlays/Auth/Auth.module.css';
import { useForm } from 'react-hook-form';

const CreatePassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const onSubmit = (data: any) => console.log(data); 

  return (
    <>
      <h1 className={styles.auth_title}>Створення нового пароля</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.auth_form}>
        <input 
          {...register("password", { required: "Пароль обов’язковий", minLength: { value: 6, message: "Мінімум 6 символів" } })}
          type="password" placeholder="Пароль" className={styles.auth_input} />

        <input 
          {...register("confirmPassword", { required: "Підтвердження обов’язкове", validate: v => v === password || "Паролі не співпадають" })}
          type="password" placeholder="Підтвердження паролю" className={styles.auth_input} />

        {(errors.password || errors.confirmPassword) && (
          <p className={styles.auth_error}>
            {typeof errors.password?.message === "string"
              ? errors.password.message
              : typeof errors.confirmPassword?.message === "string"
              ? errors.confirmPassword.message
              : ""}
          </p>
        )}

        <button type="submit" className={styles.auth_button}>Створити</button>
      </form>
    </>
  );
};

export default CreatePassword;
