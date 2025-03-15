import { ChangeEvent, MutableRefObject } from 'react';
import clsx from 'clsx';

type TextFieldProps = {
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  pattern?: string;
  title?: string;
  minLength?: number;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

function TextField(props: TextFieldProps): JSX.Element {
  const { inputRef, id, label, invalid, ...otherProps } = props;
  const fieldClassName = clsx('sign-in__field', invalid && 'sign-in__field--error');

  return (
    <div className={fieldClassName}>
      <input ref={inputRef} className="sign-in__input" id={id} {...otherProps} />
      <label className="sign-in__label visually-hidden" htmlFor={id}>{label}</label>
    </div>
  );
}

export default TextField;
