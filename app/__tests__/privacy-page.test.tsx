import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PrivacyPage from '../privacy/page';

describe('PrivacyPage', () => {
  it('should render the privacy policy heading', () => {
    render(<PrivacyPage />);

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
  });

  it('should contain all required privacy sections', () => {
    render(<PrivacyPage />);

    // Check for all main section headings
    expect(screen.getByText('GDPR Compliance')).toBeInTheDocument();
    expect(screen.getByText('Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('How We Use Information')).toBeInTheDocument();
    expect(screen.getByText('Security Measures')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Disclosure')).toBeInTheDocument();
    expect(screen.getByText('Advertising')).toBeInTheDocument();
    expect(screen.getByText('Do Not Track Signals')).toBeInTheDocument();
    expect(screen.getByText('California Privacy Rights (CalOPPA)')).toBeInTheDocument();
    expect(screen.getByText("Children's Privacy (COPPA)")).toBeInTheDocument();
    expect(screen.getByText('Data Breach Notification')).toBeInTheDocument();
    expect(screen.getByText('Email Communications (CAN-SPAM)')).toBeInTheDocument();
    expect(screen.getByText('Your Rights and Choices')).toBeInTheDocument();
    expect(screen.getByText('Terms and Consent')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Policy Updates')).toBeInTheDocument();
  });

  it('should have working go back navigation links', () => {
    render(<PrivacyPage />);

    // Should have two "Go back" links (top and bottom)
    const goBackLink = screen.getByText('Home');
    expect(goBackLink).toBeInTheDocument();

    // It should link to home page
    expect(goBackLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should have external links that open in new tabs', () => {
    render(<PrivacyPage />);

    // Check GitHub repository link
    const githubLink = screen.getByRole('link', {
      name: 'github.com/rgdSolutions/watch-next-tonight',
    });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/rgdSolutions/watch-next-tonight'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should contain TMDB attribution and disclaimer', () => {
    render(<PrivacyPage />);

    // Check for TMDB mention and disclaimer
    expect(screen.getByText(/The Movie Database \(TMDB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/not endorsed or certified by TMDB/i)).toBeInTheDocument();
  });
});
