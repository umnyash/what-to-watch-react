import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { AppRoute } from '../../const';

type LogoProps = {
  isLight?: boolean;
}

function LogoText(): JSX.Element {
  return (
    <>
      <span className="logo__letter logo__letter--1">W</span>
      <span className="logo__letter logo__letter--2">T</span>
      <span className="logo__letter logo__letter--3">W</span>
    </>
  );
}

function Logo({ isLight }: LogoProps): JSX.Element {
  const location = useLocation();
  const isDisabled = location.pathname === AppRoute.Root as string;
  const logoLinkClassName = clsx(
    'logo__link',
    isLight && 'logo__link--light'
  );

  return (
    <div className="logo">
      {isDisabled
        ? (
          <span className={logoLinkClassName}>
            <LogoText />
          </span>
        ) : (
          <Link className={logoLinkClassName} to={AppRoute.Root}>
            <LogoText />
          </Link>
        )}
    </div>
  );
}

export default Logo;
