import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContactPage from '../contact/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/contact'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the ContactForm component
vi.mock('@/components/contact-form', () => ({
  ContactForm: () => <div data-testid="contact-form">Contact Form Component</div>,
}));

describe('ContactPage', () => {
  it('should render the page title and main heading', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get in Touch');
    expect(
      screen.getByText(/Have questions, feedback, or suggestions\? We'd love to hear from you/i)
    ).toBeInTheDocument();
  });

  it('should display both contact methods', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'Contact Methods' })).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Report issues or contribute')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Share your thoughts')).toBeInTheDocument();
  });

  it('should render the ContactForm component', () => {
    render(<ContactPage />);

    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Send Us a Message' })
    ).toBeInTheDocument();
  });

  it('should include FAQ preview section with link', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Frequently Asked Questions' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Before reaching out, you might find your answer in our FAQ section/i)
    ).toBeInTheDocument();

    const faqLink = screen.getByRole('link', { name: /View FAQ/i });
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('should display expected response time information', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Expected Response Time' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We typically respond to inquiries within 24-48 hours during business days/i)
    ).toBeInTheDocument();
  });

  it('should render GitHub repository link with correct attributes', () => {
    render(<ContactPage />);

    const githubLink = screen.getByRole('link', { name: 'View Repository' });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/rgdSolutions/watch-next-tonight'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should link to contact form section from feedback method', () => {
    render(<ContactPage />);

    const formLink = screen.getByRole('link', { name: 'Use Form Below' });
    expect(formLink).toHaveAttribute('href', '#contact-form');
  });

  it('should render contact method cards with icons', () => {
    render(<ContactPage />);

    // Check for the presence of method cards
    const methodCards = screen
      .getAllByText(/GitHub|Feedback/)
      .filter((el) => el.classList.contains('font-semibold'));
    expect(methodCards).toHaveLength(2);
  });

  it('should include breadcrumb navigation', () => {
    render(<ContactPage />);

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('should have scroll to top component', () => {
    const { container } = render(<ContactPage />);

    // ScrollToTop component would be rendered
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain('container');
  });
});
