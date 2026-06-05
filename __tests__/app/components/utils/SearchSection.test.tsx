import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { parseGitHubUrl } from '@/lib/parseGitHubUrl';
import { SearchSection } from '@/components/SearchSection';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/lib/parseGitHubUrl', () => ({
  parseGitHubUrl: jest.fn(),
}));

describe('SearchSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('올바른 URL이면 repository 페이지로 이동해야 한다', async () => {
    const user = userEvent.setup();

    (parseGitHubUrl as jest.Mock).mockReturnValue({
      success: true,
      resultPath: 'jeong922/Repo_Map',
    });

    render(<SearchSection />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', {
      name: /analyze repository/i,
    });

    await user.type(input, 'github.com/jeong922/Repo_Map');
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith('/repository/jeong922/Repo_Map');
  });

  it('잘못된 URL이면 에러 메시지를 보여줘야 한다', async () => {
    const user = userEvent.setup();

    (parseGitHubUrl as jest.Mock).mockReturnValue({
      success: false,
      error: '잘못된 GitHub URL입니다.',
    });

    render(<SearchSection />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', {
      name: /analyze repository/i,
    });

    await user.type(input, 'invalid-url');
    await user.click(button);

    expect(await screen.findByText('잘못된 GitHub URL입니다.')).toBeInTheDocument();

    expect(mockPush).not.toHaveBeenCalled();
  });
});
