import { screen, render } from '@testing-library/react';
import ErrorMessage from './error-message';
import Button, { ButtonSize } from '../button';

vi.mock('../button', async () => {
  const originalModule = await vi.importActual('../button');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('Component: Error Message', () => {
  const mockErrorDescription = 'We couldn\'t load the films. Please try again later.';
  const mockRetryButtonClickHandler = vi.fn();
  const retryButtonText = 'Try again';

  it('should render correctly', () => {
    render(<ErrorMessage text={mockErrorDescription} onRetryButtonClick={mockRetryButtonClickHandler} />);
    const desctiptionElement = screen.getByText(mockErrorDescription);

    expect(desctiptionElement).toBeInTheDocument();
    expect(Button).toHaveBeenCalledWith(
      {
        children: retryButtonText,
        size: ButtonSize.L,
        onClick: mockRetryButtonClickHandler,
      },
      expect.anything()
    );
  });
});
