import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm } from '../contact-form';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText('Your Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
      expect(screen.getByLabelText('Subject *')).toBeInTheDocument();
      expect(screen.getByLabelText('Message *')).toBeInTheDocument();
    });

    it('should render submit button with correct text', () => {
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should render required field indicator', () => {
      render(<ContactForm />);

      expect(screen.getByText('* Required fields')).toBeInTheDocument();
    });

    it('should render all subject options', () => {
      render(<ContactForm />);

      const select = screen.getByLabelText('Subject *') as HTMLSelectElement;
      const options = Array.from(select.options).map((option) => option.value);

      expect(options).toEqual(['general', 'feedback', 'bug', 'partnership', 'media', 'other']);
    });

    it('should have correct default values', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText('Your Name *')).toHaveValue('');
      expect(screen.getByLabelText('Email Address *')).toHaveValue('');
      expect(screen.getByLabelText('Subject *')).toHaveValue('general');
      expect(screen.getByLabelText('Message *')).toHaveValue('');
    });

    it('should have correct placeholders', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tell us what's on your mind...")).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should mark required fields with required attribute', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText('Your Name *')).toBeRequired();
      expect(screen.getByLabelText('Email Address *')).toBeRequired();
      expect(screen.getByLabelText('Subject *')).toBeRequired();
      expect(screen.getByLabelText('Message *')).toBeRequired();
    });

    it('should have email type for email field', () => {
      render(<ContactForm />);

      const emailInput = screen.getByLabelText('Email Address *');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have text type for name field', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      expect(nameInput).toHaveAttribute('type', 'text');
    });
  });

  describe('User Input', () => {
    it('should update name field when typing', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      await user.type(nameInput, 'Jane Doe');

      expect(nameInput).toHaveValue('Jane Doe');
    });

    it('should update email field when typing', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText('Email Address *');
      await user.type(emailInput, 'jane@example.com');

      expect(emailInput).toHaveValue('jane@example.com');
    });

    it('should update message field when typing', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageInput = screen.getByLabelText('Message *');
      await user.type(messageInput, 'This is my message');

      expect(messageInput).toHaveValue('This is my message');
    });

    it('should update subject when selecting different option', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const subjectSelect = screen.getByLabelText('Subject *');
      await user.selectOptions(subjectSelect, 'feedback');

      expect(subjectSelect).toHaveValue('feedback');
    });
  });

  describe('Form Submission', () => {
    it('should prevent default form submission', () => {
      render(<ContactForm />);

      const form = document.querySelector('form') as HTMLFormElement;
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

      fireEvent(form, submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Fill required fields
      await user.type(screen.getByLabelText('Your Name *'), 'Test');
      await user.type(screen.getByLabelText('Email Address *'), 'test@example.com');
      await user.type(screen.getByLabelText('Message *'), 'Test');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should show success message after successful submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText('Your Name *'), 'Test');
      await user.type(screen.getByLabelText('Email Address *'), 'test@example.com');
      await user.type(screen.getByLabelText('Message *'), 'Test');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for success message
      await waitFor(
        () => {
          expect(
            screen.getByText(
              "Thank you for your message! We'll get back to you as soon as possible."
            )
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText('Your Name *'), 'Test');
      await user.type(screen.getByLabelText('Email Address *'), 'test@example.com');
      await user.type(screen.getByLabelText('Message *'), 'Test');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for form reset
      await waitFor(
        () => {
          expect(screen.getByLabelText('Your Name *')).toHaveValue('');
          expect(screen.getByLabelText('Email Address *')).toHaveValue('');
          expect(screen.getByLabelText('Subject *')).toHaveValue('general');
          expect(screen.getByLabelText('Message *')).toHaveValue('');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      const emailInput = screen.getByLabelText('Email Address *');
      const subjectSelect = screen.getByLabelText('Subject *');
      const messageTextarea = screen.getByLabelText('Message *');

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(subjectSelect).toHaveAttribute('id', 'subject');
      expect(messageTextarea).toHaveAttribute('id', 'message');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText('Your Name *')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Email Address *')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Subject *')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Message *')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /send message/i })).toHaveFocus();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct CSS classes to form elements', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      expect(nameInput).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'border',
        'rounded-lg',
        'bg-background'
      );
    });

    it('should apply grid layout for name and email fields', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      const gridContainer = nameInput.closest('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2', 'gap-6');
    });

    it('should render textarea with correct rows', () => {
      render(<ContactForm />);

      const messageTextarea = screen.getByLabelText('Message *');
      expect(messageTextarea).toHaveAttribute('rows', '6');
    });

    it('should have non-resizable textarea', () => {
      render(<ContactForm />);

      const messageTextarea = screen.getByLabelText('Message *');
      expect(messageTextarea).toHaveClass('resize-none');
    });

    it('should apply focus styles to inputs', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText('Your Name *');
      expect(nameInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary');
    });
  });

  describe('Button States', () => {
    it('should show Send icon in default state', () => {
      render(<ContactForm />);

      const sendIcon = document.querySelector('svg');
      expect(sendIcon).toBeInTheDocument();
      expect(sendIcon).toHaveClass('w-4', 'h-4');
    });

    it('should apply correct button styling', () => {
      render(<ContactForm />);

      const button = screen.getByRole('button', { name: /send message/i });
      expect(button).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'rounded-lg',
        'hover:bg-primary/90'
      );
    });
  });

  describe('Alert Messages', () => {
    it('should position alerts correctly in DOM', () => {
      const { container } = render(<ContactForm />);

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      // The form is the first child by default when no alerts are shown
      const firstChild = container.firstChild;
      expect(firstChild).toBe(form);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const specialChars = '!@#$%^&*()';

      await user.type(screen.getByLabelText('Your Name *'), specialChars);

      expect(screen.getByLabelText('Your Name *')).toHaveValue(specialChars);
    });

    it('should handle clearing form fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // Fill fields
      await user.type(screen.getByLabelText('Your Name *'), 'Test Name');
      await user.type(screen.getByLabelText('Email Address *'), 'test@example.com');

      // Clear fields
      await user.clear(screen.getByLabelText('Your Name *'));
      await user.clear(screen.getByLabelText('Email Address *'));

      expect(screen.getByLabelText('Your Name *')).toHaveValue('');
      expect(screen.getByLabelText('Email Address *')).toHaveValue('');
    });
  });
});
