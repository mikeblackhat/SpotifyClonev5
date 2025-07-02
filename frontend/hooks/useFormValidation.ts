import { useState } from 'react';

export const useFormValidation = (initialState: any, validate: (values: any) => any) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleBlur = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (callback: () => Promise<{ success: boolean; error?: string }>) => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const result = await callback();
        if (!result.success) {
          setErrors(prev => ({
            ...prev,
            form: result.error || 'Ocurrió un error inesperado.'
          }));
        }
        return result;
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          form: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
        }));
        return { success: false, error: 'Ocurrió un error inesperado.' };
      } finally {
        setIsSubmitting(false);
      }
    }
    return { success: false };
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors
  };
};

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateUsername = (username: string) => {
  return username.trim().length >= 3;
};
