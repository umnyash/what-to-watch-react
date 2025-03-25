import clsx from 'clsx';
import Logo from '../logo';
import Breadcrumbs, { BreadcrumbLinks } from '../breadcrumbs';
import UserNavigation from '../user-navigation';

import { ReactNode, memo } from 'react';

type SiteHeaderProps = {
  heading?: ReactNode;
  breadcrumbs?: BreadcrumbLinks;
  withUserNavigation?: boolean;
  className?: string;
}

function SiteHeaderComponent(props: SiteHeaderProps): JSX.Element {
  const { heading, breadcrumbs, withUserNavigation, className } = props;
  const headerClassName = clsx('page-header', className);

  return (
    <header className={headerClassName}>
      <Logo />

      {heading && <h1 className="page-title user-page__title" dangerouslySetInnerHTML={{ __html: heading }} />}

      {breadcrumbs && <Breadcrumbs links={breadcrumbs} />}

      {withUserNavigation && <UserNavigation />}
    </header>
  );
}

const SiteHeader = memo(SiteHeaderComponent);

export default SiteHeader;
