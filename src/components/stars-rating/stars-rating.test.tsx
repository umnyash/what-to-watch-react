import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MAX_RATING } from '../../const';

import StarsRating from './stars-rating';

describe('Component: StarsRating', () => {
  const containerElementTestId = 'rating-stars';

  describe('should render correctly', () => {
    it('should render container and radiobuttons', () => {
      const inputAndLabelsCount = MAX_RATING * 2;

      render(
        <StarsRating value={0} onChange={vi.fn()} />
      );
      const containerElement = screen.getByTestId(containerElementTestId);

      expect(containerElement).toBeInTheDocument();
      expect(containerElement.children).toHaveLength(inputAndLabelsCount);
      for (let i = 1; i <= MAX_RATING; i++) {
        const radiobuttonElement = screen.getByLabelText(`Rating ${i}`);
        expect(radiobuttonElement).toBeInTheDocument();
      }
    });

    it('should render elements in correct order', () => {
      const expectedOrder = [
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label',
        'input', 'label'
      ];
      const expectedValuesAndLabels = [
        '10', 'Rating 10',
        '9', 'Rating 9',
        '8', 'Rating 8',
        '7', 'Rating 7',
        '6', 'Rating 6',
        '5', 'Rating 5',
        '4', 'Rating 4',
        '3', 'Rating 3',
        '2', 'Rating 2',
        '1', 'Rating 1'
      ];

      render(
        <StarsRating value={0} onChange={vi.fn()} />
      );
      const containerElement = screen.getByTestId(containerElementTestId);

      Array.from(containerElement.children).forEach((element, index) => {
        const elementTag = element.tagName.toLowerCase();
        expect(elementTag).toBe(expectedOrder[index]);

        if (elementTag === 'input') {
          expect(element).toHaveAttribute('value', expectedValuesAndLabels[index]);
        } else {
          expect(element).toHaveTextContent(expectedValuesAndLabels[index]);
        }
      });
    });
  });

  it('should call onChange callback once when user click on not checked radiobutton', async () => {
    const mockChangeHandler = vi.fn();
    const user = userEvent.setup();

    render(<StarsRating value={0} onChange={mockChangeHandler} />);
    const radiobuttonElement = screen.getByRole('radio', { name: 'Rating 5' });
    await user.click(radiobuttonElement);

    expect(mockChangeHandler).toHaveBeenCalledOnce();
  });

  describe('value prop', () => {
    it('should not checked radiobuttons when prop is 0', () => {
      render(<StarsRating value={0} onChange={vi.fn()} />);
      expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
    });

    it(`should not checked radiobuttons when prop is greater than max value (${MAX_RATING})`, () => {
      render(<StarsRating value={MAX_RATING + 1} onChange={vi.fn()} />);
      expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
    });

    it.each(
      Array.from({ length: MAX_RATING }, (_, index) => index + 1)
    )('should check corresponding radiobutton when prop is %d', (value) => {
      render(<StarsRating value={value} onChange={vi.fn()} />);
      const checkedRadiobutton: HTMLInputElement = screen.getByRole('radio', { checked: true });

      expect(+checkedRadiobutton.value).toBe(value);
    });

    it('should check corresponding radiobutton when prop is change', () => {
      const initialValue = 4;
      const expectedValue = 5;

      const { rerender } = render(<StarsRating value={initialValue} onChange={vi.fn()} />);
      rerender(<StarsRating value={expectedValue} onChange={vi.fn()} />);
      const checkedRadiobutton: HTMLInputElement = screen.getByRole('radio', { checked: true });

      expect(+checkedRadiobutton.value).toBe(expectedValue);
    });
  });

  describe('disabled prop', () => {
    it('should not disable radiobuttons when prop is missing', () => {
      render(<StarsRating value={0} onChange={vi.fn()} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });

    it('should not disable radiobuttons when prop is false', () => {
      render(<StarsRating value={0} onChange={vi.fn()} disabled={false} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });

    it('should disable radiobuttons when prop is true', () => {
      render(<StarsRating value={0} onChange={vi.fn()} disabled />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());
    });

    it('should disable radiobuttons when prop change to true', () => {
      const { rerender } = render(<StarsRating value={0} onChange={vi.fn()} />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());

      rerender(<StarsRating value={0} onChange={vi.fn()} disabled />);

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());
    });

    it('should enable radiobuttons when prop change to false', () => {
      const { rerender } = render(<StarsRating value={0} onChange={vi.fn()} disabled />);
      const radiobuttons = screen.getAllByRole('radio');

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());

      rerender(<StarsRating value={0} onChange={vi.fn()} />);

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
    });
  });
});
