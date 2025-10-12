import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { render } from '../tests/utils/test-utils';

describe('test-utils', () => {
  describe('render', () => {
    it('renders a component correctly', () => {
      render(<div>Test Component</div>);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('renders component with children', () => {
      const TestComponent = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="wrapper">{children}</div>
      );

      render(
        <TestComponent>
          <span>Child Content</span>
        </TestComponent>
      );

      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('passes through render options correctly', () => {
      const TestComponent = () => <div>Test</div>;

      const { container } = render(<TestComponent />, {
        container: document.createElement('section'),
      });

      expect(container.tagName).toBe('SECTION');
    });

    it('wraps component with AllTheProviders', () => {
      const TestComponent = () => <div data-testid="test-component">Wrapped Component</div>;

      render(<TestComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Wrapped Component')).toBeInTheDocument();
    });

    it('handles nested components correctly', () => {
      const Parent = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="parent">{children}</div>
      );
      const Child = () => <span data-testid="child">Child</span>;

      render(
        <Parent>
          <Child />
        </Parent>
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('supports re-exported testing library utilities', () => {
      render(
        <div>
          <button>Click me</button>
          <input placeholder="Enter text" />
        </div>
      );

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders multiple children in provider wrapper', () => {
      render(
        <>
          <div data-testid="first">First</div>
          <div data-testid="second">Second</div>
          <div data-testid="third">Third</div>
        </>
      );

      expect(screen.getByTestId('first')).toBeInTheDocument();
      expect(screen.getByTestId('second')).toBeInTheDocument();
      expect(screen.getByTestId('third')).toBeInTheDocument();
    });

    it('handles empty children in wrapper', () => {
      const EmptyComponent = () => null;
      const { container } = render(<EmptyComponent />);
      expect(container.firstChild).toBeNull();
    });

    it('preserves component props when rendering', () => {
      const ComponentWithProps = ({ text, id }: { text: string; id: string }) => (
        <div data-testid={id}>{text}</div>
      );

      render(<ComponentWithProps text="Hello World" id="prop-test" />);

      const element = screen.getByTestId('prop-test');
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('Hello World');
    });
  });
});
