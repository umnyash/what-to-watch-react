import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { AppRoute } from '../../const';
import { ButtonType, ButtonSize } from './const';
import { withHistory } from '../../tests/render-helpers';

import Button from './button';

describe('Component: Button', () => {
  describe('buttons', () => {
    it.each([
      {
        expectedButtonType: ButtonType.Button,
        buttonText: 'Simple button',
        condition: 'by default',
      },
      {
        type: ButtonType.Button,
        expectedButtonType: ButtonType.Button,
        buttonText: 'Simple button',
        condition: `when type prop is "${ButtonType.Button}"`,
      },
      {
        type: ButtonType.Submit,
        expectedButtonType: ButtonType.Submit,
        buttonText: 'Submit button',
        condition: `when type prop is "${ButtonType.Submit}"`,
      },
      {
        type: ButtonType.Reset,
        expectedButtonType: ButtonType.Reset,
        buttonText: 'Reset button',
        condition: `when type prop is "${ButtonType.Reset}"`,
      },
    ])(
      'should render button with type $expectedButtonType $condition',
      ({ type, expectedButtonType, buttonText }) => {
        render(<Button type={type}>{buttonText}</Button>);
        const buttonElement = screen.getByRole('button', { name: buttonText });

        expect(buttonElement).toHaveAttribute('type', expectedButtonType);
      }
    );

    describe('disabled prop', () => {
      const buttonText = 'Some button';

      it('should render button as enabled when disabled prop is false', () => {
        render(<Button>{buttonText}</Button>);
        const buttonElement = screen.getByRole('button', { name: buttonText });

        expect(buttonElement).not.toBeDisabled();
      });

      it('should render button as disabled when disabled prop is true', () => {
        render(<Button disabled>{buttonText}</Button>);
        const buttonElement = screen.getByRole('button', { name: buttonText });

        expect(buttonElement).toBeDisabled();
      });

      it('should disabled when prop change to true', () => {
        const { rerender } = render(<Button>Button</Button>);
        rerender(<Button disabled>Button</Button>);

        expect(screen.getByRole('button')).toBeDisabled();
      });

      it('should enabled when prop change to false', () => {
        const { rerender } = render(<Button disabled>Button</Button>);
        rerender(<Button>Button</Button>);

        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });
  });

  describe('link', () => {
    const linkText = 'External link';
    const mockUrl = faker.internet.url();

    it('should render anchor element when type prop is "link"', () => {
      render(<Button type={ButtonType.Link} href={mockUrl}>{linkText}</Button>);
      const linkElement = screen.getByRole('link', { name: linkText });

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', mockUrl);
    });

    describe('rel and target props', () => {
      it('should apply the rel and target attributes if the corresponding props are present', () => {
        const expectedRelAttributeValue = 'nofollow noopener';
        const expectedTargetAttributeValue = '_blank';

        render(
          <Button
            type={ButtonType.Link}
            href={mockUrl}
            rel={expectedRelAttributeValue}
            target={expectedTargetAttributeValue}
          >
            {linkText}
          </Button>
        );
        const linkElement = screen.getByRole('link', { name: linkText });

        expect(linkElement).toHaveAttribute('rel', expectedRelAttributeValue);
        expect(linkElement).toHaveAttribute('target', expectedTargetAttributeValue);
      });

      it('should not apply the rel and target attributes if the corresponding props are missing', () => {
        render(<Button type={ButtonType.Link} href={mockUrl}>{linkText}</Button>);
        const linkElement = screen.getByRole('link', { name: linkText });

        expect(linkElement).not.toHaveAttribute('rel');
        expect(linkElement).not.toHaveAttribute('target');
      });
    });
  });

  describe('route', () => {
    it('should render Link component when type prop is "route"', () => {
      const linkText = 'Navigation Link';
      const { withHistoryComponent } = withHistory(
        <Button type={ButtonType.Route} to={AppRoute.Root}>{linkText}</Button>
      );

      render(withHistoryComponent);
      const linkElement = screen.getByRole('link', { name: linkText });

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', AppRoute.Root);
    });
  });

  describe('button size', () => {
    it.each([
      ['catalog__button', undefined],
      ['catalog__button', ButtonSize.M],
      ['sign-in__btn', ButtonSize.L]
    ])('should have %s as base className when button size is %s', (className, size) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('class', className);
    });
  });

  describe('className prop', () => {
    const baseClassName = 'catalog__button';

    it('should have base classes when prop is missing', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('class', baseClassName);
    });

    it('should add the passed classes to the base classes when prop is present', () => {
      const passedClassName = 'login__submit button--modificator block__button';
      const expectedClassAttributeValue = `${baseClassName} ${passedClassName}`;

      render(<Button className={passedClassName}>Button</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('class', expectedClassAttributeValue);
    });
  });

  describe('onClick prop', () => {
    it('should call handler when user click button', async () => {
      const user = userEvent.setup();
      const mockHandleButtonClick = vi.fn();

      render(<Button onClick={mockHandleButtonClick}>Button</Button>);
      await user.click(screen.getByRole('button'));

      expect(mockHandleButtonClick).toHaveBeenCalled();
    });
  });
});
