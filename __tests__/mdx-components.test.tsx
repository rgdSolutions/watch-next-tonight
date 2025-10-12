import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMDXComponents } from '../mdx-components';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('useMDXComponents', () => {
  it('returns all MDX component overrides', () => {
    const components = useMDXComponents({});
    const keys = [
      'h1',
      'h2',
      'h3',
      'h4',
      'p',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'code',
      'pre',
      'img',
    ];
    expect(Object.keys(components)).toEqual(keys);
  });

  it('renders all heading levels with correct styles', () => {
    const c = useMDXComponents({});
    const H1 = c.h1 as React.FC<{ children: React.ReactNode }>;
    const H2 = c.h2 as React.FC<{ children: React.ReactNode }>;
    const H3 = c.h3 as React.FC<{ children: React.ReactNode }>;
    const H4 = c.h4 as React.FC<{ children: React.ReactNode }>;

    render(
      <>
        <H1>H1</H1>
        <H2>H2</H2>
        <H3>H3</H3>
        <H4>H4</H4>
      </>
    );

    expect(screen.getByText('H1')).toHaveClass('text-4xl', 'font-bold');
    expect(screen.getByText('H2')).toHaveClass('text-3xl', 'font-semibold');
    expect(screen.getByText('H3')).toHaveClass('text-2xl', 'font-semibold');
    expect(screen.getByText('H4')).toHaveClass('text-xl', 'font-semibold');
  });

  it('renders paragraph with correct styling', () => {
    const c = useMDXComponents({});
    const P = c.p as React.FC<{ children: React.ReactNode }>;
    render(<P>Test</P>);
    expect(screen.getByText('Test')).toHaveClass('text-base', 'leading-7');
  });

  it('renders lists with correct styling', () => {
    const c = useMDXComponents({});
    const Ul = c.ul as React.FC<{ children: React.ReactNode }>;
    const Ol = c.ol as React.FC<{ children: React.ReactNode }>;
    const Li = c.li as React.FC<{ children: React.ReactNode }>;

    render(
      <>
        <Ul>
          <Li>UL</Li>
        </Ul>
        <Ol>
          <Li>OL</Li>
        </Ol>
      </>
    );

    expect(screen.getByText('UL').parentElement).toHaveClass('list-disc', 'list-inside');
    expect(screen.getByText('OL').parentElement).toHaveClass('list-decimal', 'list-inside');
    expect(screen.getByText('UL')).toHaveClass('ml-4');
  });

  it('renders external links with security attributes', () => {
    const c = useMDXComponents({});
    const A = c.a as React.FC<{ href?: string; children: React.ReactNode }>;
    render(<A href="https://example.com">Link</A>);
    const link = screen.getByText('Link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders internal links without target attribute', () => {
    const c = useMDXComponents({});
    const A = c.a as React.FC<{ href?: string; children: React.ReactNode }>;
    render(<A href="/about">Link</A>);
    expect(screen.getByText('Link')).not.toHaveAttribute('target');
  });

  it('renders code and pre elements with styling', () => {
    const c = useMDXComponents({});
    const Code = c.code as React.FC<{ children: React.ReactNode }>;
    const Pre = c.pre as React.FC<{ children: React.ReactNode }>;
    render(
      <Pre>
        <Code>code</Code>
      </Pre>
    );
    expect(screen.getByText('code')).toHaveClass('bg-muted', 'font-mono');
    expect(screen.getByText('code').parentElement).toHaveClass('bg-muted', 'p-4', 'rounded-lg');
  });

  it('renders blockquote with border styling', () => {
    const c = useMDXComponents({});
    const Blockquote = c.blockquote as React.FC<{ children: React.ReactNode }>;
    render(<Blockquote>Quote</Blockquote>);
    expect(screen.getByText('Quote')).toHaveClass('border-l-4', 'italic');
  });

  it('renders img component as Next.js Image', () => {
    const c = useMDXComponents({});
    const Img = c.img as React.FC<{ src?: string; alt?: string }>;
    render(<Img src="/test.jpg" alt="Test" />);
    expect(screen.getByAltText('Test')).toHaveAttribute('src', '/test.jpg');
  });

  it('merges custom components with defaults', () => {
    const CustomH1 = () => <h1>Custom</h1>;
    const c = useMDXComponents({ h1: CustomH1 });
    expect(c.h1).toBe(CustomH1);
    expect(c.h2).toBeDefined();
  });
});
