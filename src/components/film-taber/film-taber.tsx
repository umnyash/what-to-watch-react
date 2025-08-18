import { useState, MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from './types';

type FilmTaberProps = {
  tabs: Tabs;
  tabSearchParam: string;
}

function FilmTaber({ tabs, tabSearchParam }: FilmTaberProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const urlTabTitle = searchParams.get(tabSearchParam);
    return Math.max(tabs.findIndex((tab) => tab.title === urlTabTitle), 0);
  });

  const getTabClickHandler = (tabTitle: string, index: number) => (evt: MouseEvent) => {
    evt.preventDefault();
    setActiveTab(index);
    const currentSearchParams = new URLSearchParams(searchParams);
    currentSearchParams.set(tabSearchParam, tabTitle);
    setSearchParams(currentSearchParams);
  };

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
                  onClick={getTabClickHandler(tab.title, index)}
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
