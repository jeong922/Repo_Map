import Home from '@/app/page';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/SearchSection', () => ({
  SearchSection: () => <div data-testid='mock-search-section'>Search Section Mock</div>,
}));

describe('Home', () => {
  it('SearchSection 컴포넌트가 렌더링되어야 한다', () => {
    render(<Home />);

    expect(screen.getByTestId('mock-search-section')).toBeInTheDocument();
  });

  it('스타일 클래스가 적용되어 있어야 한다', () => {
    const { container } = render(<Home />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass('flex-1', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-center');
  });
});
