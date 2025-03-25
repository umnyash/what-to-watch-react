import { memo } from 'react';
import Logo from '../logo';

function SiteFooterComponent(): JSX.Element {
  return (
    <footer className="page-footer">
      <Logo isLight />

      <div className="copyright">
        <p>© 2019 What to watch Ltd.</p>
      </div>
    </footer>
  );
}

const SiteFooter = memo(SiteFooterComponent);

export default SiteFooter;
