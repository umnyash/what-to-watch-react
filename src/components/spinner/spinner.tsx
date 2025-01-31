import style from './spinner.module.css';

function Spinner(): JSX.Element {
  return (
    <div className={style.spinner}>
      <svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#d9cd8d">
        <circle cx="4" cy="12" r="3" />
        <circle cx="4" cy="12" r="3" />
        <circle cx="4" cy="12" r="3" />
        <circle cx="4" cy="12" r="3" />
      </svg>
    </div>
  );
}

export default Spinner;
