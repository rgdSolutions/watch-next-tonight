import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FAQPage from '../faq/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/faq'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/script
vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => <script {...props}>{children}</script>,
}));

describe('FAQPage', () => {
  it('should render the page title and main heading', () => {
    render(<FAQPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Frequently Asked Questions'
    );
    expect(
      screen.getByText(/Everything you need to know about finding your perfect movie or TV show/i)
    ).toBeInTheDocument();
  });

  it('should render all 15 FAQ questions', () => {
    render(<FAQPage />);

    const questions = [
      'How does Watch Next Tonight work?',
      'Is Watch Next Tonight free to use?',
      'Which streaming platforms does Watch Next Tonight support?',
      'Do I need to create an account to use the service?',
      'How accurate are the streaming availability results?',
    ];

    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });

    // Verify total count of FAQ items
    const allQuestions = screen.getAllByRole('heading', { level: 3 });
    expect(allQuestions).toHaveLength(15);
  });

  it('should toggle FAQ answers when clicked', async () => {
    const user = userEvent.setup();
    render(<FAQPage />);

    const firstQuestion = screen.getByText('How does Watch Next Tonight work?');
    const detailsElement = firstQuestion.closest('details') as HTMLDetailsElement;

    expect(detailsElement).not.toHaveAttribute('open');

    // Click to open
    await user.click(firstQuestion);
    expect(detailsElement).toHaveAttribute('open');

    // Check that answer is visible
    expect(
      screen.getByText(
        /uses advanced algorithms to provide personalized movie and TV show recommendations/i
      )
    ).toBeInTheDocument();
  });

  it('should render structured data script for SEO', () => {
    const { container } = render(<FAQPage />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.id).toBe('faq-schema');
  });

  it('should display Still Have Questions section with contact links', () => {
    render(<FAQPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Still Have Questions?' })
    ).toBeInTheDocument();

    const contactLink = screen.getByRole('link', { name: 'Contact Support' });
    expect(contactLink).toHaveAttribute('href', '/contact');

    const issueLink = screen.getByRole('link', { name: 'Report an Issue' });
    expect(issueLink).toHaveAttribute(
      'href',
      'https://github.com/rgdSolutions/watch-next-tonight/issues'
    );
    expect(issueLink).toHaveAttribute('target', '_blank');
  });

  it('should render Quick Tips section with all five tips', () => {
    render(<FAQPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Quick Tips for Best Results' })
    ).toBeInTheDocument();

    const tips = [
      'Select multiple genres for more diverse recommendations',
      'Use "Last 2 Years" for the newest content across platforms',
      'Check trending daily for fresh, popular content',
      'Try different genre combinations to discover hidden gems',
      'Bookmark the site for quick access when you need recommendations',
    ];

    tips.forEach((tip) => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });

  it('should include breadcrumb navigation', () => {
    render(<FAQPage />);

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('should display chevron icons that change on expand/collapse', async () => {
    const user = userEvent.setup();
    render(<FAQPage />);

    const firstQuestion = screen.getByText('How does Watch Next Tonight work?');
    const detailsElement = firstQuestion.closest('details') as HTMLElement;

    // Initially, ChevronDown should be visible
    const chevronDown = detailsElement.querySelector('.group-open\\:hidden');
    const chevronUp = detailsElement.querySelector('.group-open\\:block');

    expect(chevronDown).toBeInTheDocument();
    expect(chevronUp).toBeInTheDocument();

    // After clicking, chevron direction should change (handled by CSS classes)
    await user.click(firstQuestion);
    expect(detailsElement).toHaveAttribute('open');
  });

  it('should verify important FAQ content is present', () => {
    render(<FAQPage />);

    // Check for key information users need
    expect(screen.getByText(/completely free to use/i)).toBeInTheDocument();
    expect(screen.getByText(/Netflix, Amazon Prime Video, Disney\+/i)).toBeInTheDocument();
    expect(screen.getByText(/don't need to create an account/i)).toBeInTheDocument();
    expect(screen.getByText(/over 100 countries worldwide/i)).toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    render(<FAQPage />);

    // Check for main element
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Check for sections
    const sections = main.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);

    // Check that FAQs use details/summary elements
    const detailsElements = screen.getAllByRole('group');
    expect(detailsElements.length).toBe(15);
  });
});
