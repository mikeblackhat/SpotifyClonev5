interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'El correo electrónico es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Por favor ingresa un correo electrónico válido' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { 
      isValid: false, 
      error: 'La contraseña debe tener al menos 8 caracteres' 
    };
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      error: 'La contraseña debe incluir al menos una letra y un número' 
    };
  }

  return { isValid: true };
};

export const validateDisplayName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (name.trim().length < 3) {
    return { 
      isValid: false, 
      error: 'El nombre debe tener al menos 3 caracteres' 
    };
  }

  return { isValid: true };
};

export interface SignUpFormData {
  email: string;
  password: string;
  displayName: string;
  username?: string;
  name?: string;
}

export type SignUpFormErrors = Partial<Record<keyof SignUpFormData, string>>;

export const validateSignUpForm = (formData: SignUpFormData): { isValid: boolean; errors: SignUpFormErrors } => {
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password);
  const nameValidation = validateDisplayName(formData.displayName);

  const errors: SignUpFormErrors = {};
  
  if (!emailValidation.isValid) errors.email = emailValidation.error;
  if (!passwordValidation.isValid) errors.password = passwordValidation.error;
  if (!nameValidation.isValid) errors.displayName = nameValidation.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateUsernameFromEmail = (email: string): string => {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
};