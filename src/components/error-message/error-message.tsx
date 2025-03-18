import Button, { ButtonSize } from '../button';

type ErrorMessageProps = {
  text: string;
  onButtonClick: () => void;
}

function ErrorMessage({ text, onButtonClick }: ErrorMessageProps): JSX.Element {
  return (
    <div className="sign-in user-page__content">
      <div className="sign-in__message">
        <h2>Something went wrong</h2>
        <p>{text}</p>
      </div>
      <Button size={ButtonSize.L} onClick={onButtonClick}>Try again</Button>
    </div>
  );
}

export default ErrorMessage;
