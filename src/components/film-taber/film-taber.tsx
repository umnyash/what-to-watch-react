import { useState } from 'react';
import { Tabs } from './types';

type FilmTaberProps = {
  tabs: Tabs;
}

function FilmTaber({ tabs }: FilmTaberProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="film-card__desc">
      <nav className="film-nav film-card__nav">
        <ul className="film-nav__list">
          {tabs.map((tab, index) => {
            if (index === activeTab) {
              return (
                <li className="film-nav__item film-nav__item--active" key={tab.title}>
                  <span className="film-nav__link">{tab.title}</span>
                </li>
              );
            }

            return (
              <li className="film-nav__item" key={tab.title}>
                <a
                  className="film-nav__link"
                  href="#"
                  onClick={(evt) => {
                    evt.preventDefault();
                    setActiveTab(index);
                  }}
                >
                  {tab.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {tabs[activeTab].content}
    </div>
  );
}

export default FilmTaber;
