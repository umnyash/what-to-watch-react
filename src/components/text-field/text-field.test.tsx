import { createRef } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextField from './text-field';

describe('Component: TextField', () => {
  const baseProps = {
    id: 'user-name',
    name: 'name',
    label: 'Your name',
    type: 'text',
    value: '',
    placeholder: 'umnyash',
    onChange: vi.fn(),
  };

  const optionalProps = {
    pattern: '[a-z]{4,8}',
    title: '4 to 8 lowercase letters',
    minLength: 4,
    required: true,
    disabled: true,
  };

  beforeEach(() => vi.clearAllMocks());

  it('should render correctly', () => {
    render(<TextField {...baseProps} />);
    const inputElement = screen.getByLabelText(baseProps.label);

    expect(inputElement).toHaveAttribute('id', baseProps.id);
    expect(inputElement).toHaveAttribute('name', baseProps.name);
    expect(inputElement).toHaveAttribute('type', baseProps.type);
    expect(inputElement).toHaveAttribute('placeholder', baseProps.placeholder);
    expect(inputElement).not.toHaveAttribute('pattern');
    expect(inputElement).not.toHaveAttribute('title');
    expect(inputElement).not.toHaveAttribute('minLength');
    expect(inputElement).not.toBeRequired();
    expect(inputElement).not.toBeDisabled();
  });

  it('should call onChange callback on change', async () => {
    const mockName = 'rus';
    const user = userEvent.setup();

    render(<TextField {...baseProps} />);
    const inputElement = screen.getByLabelText(baseProps.label);
    await user.type(inputElement, mockName);

    expect(baseProps.onChange).toHaveBeenCalledTimes(mockName.length);
  });

  it('should render correctly with optional props', () => {
    render(<TextField {...baseProps} {...optionalProps} />);
    const inputElement = screen.getByLabelText(baseProps.label);

    expect(inputElement).toHaveAttribute('pattern', optionalProps.pattern);
    expect(inputElement).toHaveAttribute('title', optionalProps.title);
    expect(inputElement).toHaveAttribute('minLength', String(optionalProps.minLength));
    expect(inputElement).toBeRequired();
    expect(inputElement).toBeDisabled();
  });

  it('should call onBlur callback when input loses focus', async () => {
    const mockOnBlur = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <TextField {...baseProps} onBlur={mockOnBlur} />
        <button>Some other interactive element</button>
      </>
    );
    const inputElement = screen.getByLabelText(baseProps.label);
    await user.click(inputElement);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalledOnce();
  });

  it('should save input element in provided ref', () => {
    const ref = createRef<HTMLInputElement>();

    render(<TextField {...baseProps} inputRef={ref} />);
    const inputElement = screen.getByLabelText(baseProps.label);

    expect(ref.current).toBe(inputElement);
  });

  it.each([
    false, true
  ])('should add error class only if prop invalid is true (current: %s)', (invalid) => {
    render(<TextField {...baseProps} invalid={invalid} />);
    const textFieldElement = screen.getByLabelText(baseProps.label).closest('div');

    if (invalid) {
      expect(textFieldElement).toHaveClass('sign-in__field--error');
    } else {
      expect(textFieldElement).not.toHaveClass('sign-in__field--error');
    }
  });
});
