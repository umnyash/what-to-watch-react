const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const PASSWORD_REGEXP = /(?=.*[a-zA-Z])(?=.*\d).*/;
const PASSWORD_MIN_LENGTH = 2;

export const validationErrorMessages = {
  email: {
    required: 'Email cannot be empty',
    pattern: 'Please enter a valid email address.',
  },
  password: {
    required: 'Password cannot be empty.',
    pattern: 'Password must contain letters and numbers.',
    minLength: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
  },
  emailAndPassword: {
    required: 'Email and password should not be empty.',
  },
} as const;

const ValidationRules = {
  email: {
    required: {
      message: validationErrorMessages.email.required,
    },
    pattern: {
      value: EMAIL_REGEXP,
      message: validationErrorMessages.email.pattern,
    },
  },
  password: {
    required: {
      message: validationErrorMessages.password.required,
    },
    pattern: {
      value: PASSWORD_REGEXP,
      message: validationErrorMessages.password.pattern,
    },
    minLength: {
      value: PASSWORD_MIN_LENGTH,
      message: validationErrorMessages.password.minLength,
    }
  }
} as const;

export const getValidationErrorMessage = (type: keyof typeof ValidationRules, value: string) => {
  const rules = ValidationRules[type];

  if (!value.length) {
    return rules.required.message;
  }

  if (!rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }

  if ('minLength' in rules && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }

  return null;
};
