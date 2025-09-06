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
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('Advertising')).toBeInTheDocument();
    expect(screen.getByText('Your Choices')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Updates')).toBeInTheDocument();
  });

  it('should have working go back navigation links', () => {
    render(<PrivacyPage />);

    // Should have two "Go back" links (top and bottom)
    const goBackLinks = screen.getAllByText('Go back');
    expect(goBackLinks).toHaveLength(2);

    // Both should link to home page
    goBackLinks.forEach((link) => {
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });

  it('should have external links that open in new tabs', () => {
    render(<PrivacyPage />);

    // Check Google Privacy Policy link
    const googleLink = screen.getByRole('link', { name: /Google Privacy Policy/i });
    expect(googleLink).toHaveAttribute('href', 'https://policies.google.com/privacy');
    expect(googleLink).toHaveAttribute('target', '_blank');
    expect(googleLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check GitHub repository link
    const githubLink = screen.getByRole('link', { name: /GitHub repository/i });
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
