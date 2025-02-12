import clsx from 'clsx';
import { BreadcrumbLinks } from '../../types/breadcrumbs';
import Logo from '../logo';
import Breadcrumbs from '../breadcrumbs';
import UserNavigation from '../user-navigation';

import React from 'react';

type SiteHeaderProps = {
  heading?: React.ReactNode;
  breadcrumbs?: BreadcrumbLinks;
  withUserNavigation?: boolean;
  className?: string;
}

function SiteHeader(props: SiteHeaderProps): JSX.Element {
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

export default SiteHeader;
