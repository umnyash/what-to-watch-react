import Button, { ButtonSize } from '../button';

type ErrorMessageProps = {
  text: string;
  onRetryButtonClick: () => void;
}

function ErrorMessage({ text, onRetryButtonClick }: ErrorMessageProps): JSX.Element {
  return (
    <div className="sign-in user-page__content">
      <div className="sign-in__message">
        <h2>Something went wrong</h2>
        <p>{text}</p>
      </div>
      <Button size={ButtonSize.L} onClick={onRetryButtonClick}>Try again</Button>
    </div>
  );
}

export default ErrorMessage;
