import { Link } from 'react-router-dom';
import { BreadcrumbItems } from './types';

type BreadcrumbsProps = {
  items: BreadcrumbItems;
}

function Breadcrumbs({ items }: BreadcrumbsProps): JSX.Element {
  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        {items.map(({ text, href }) => (
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
