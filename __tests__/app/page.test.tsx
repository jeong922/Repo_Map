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

  it('서비스 설명과 이용 단계를 표시해야 한다', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('프로젝트를 이해하세요.');
    expect(screen.getByRole('heading', { name: '저장소 연결' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '인사이트 확인' })).toBeInTheDocument();
  });
});
