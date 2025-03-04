import { Link } from 'react-router-dom';
import { BreadcrumbLinks } from './types';

type BreadcrumbsProps = {
  links: BreadcrumbLinks;
}

function Breadcrumbs({ links }: BreadcrumbsProps): JSX.Element {
  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        {links.map(({ text, href }) => (
          <li className="breadcrumbs__item" key={text}>
            {href
              ? <Link className="breadcrumbs__link" to={href}>{text}</Link>
              : <a className="breadcrumbs__link">{text}</a>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Breadcrumbs;
