import { parseGitHubUrl } from '@/lib/github-api';

describe('parseGitHubUrl', () => {
  describe('정상 케이스', () => {
    it('기본 레포지토리 URL에서 owner/repo 경로를 추출해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react');
      expect(result).toEqual({
        success: true,
        resultPath: 'facebook/react',
      });
    });

    it('www.github.com 호스트도 허용해야 한다.', () => {
      const result = parseGitHubUrl('https://www.github.com/facebook/react');
      expect(result).toEqual({
        success: true,
        resultPath: 'facebook/react',
      });
    });

    it('대문자가 섞인 호스트네임도 자동 소문자화하여 처리해야 한다.', () => {
      const result = parseGitHubUrl('https://GITHUB.COM/facebook/react');
      expect(result.success).toBe(true);
      expect(result.resultPath).toBe('facebook/react');
    });

    it('마지막에 슬래시(trailing slash)가 있어도 무시하고 파싱해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/');
      expect(result.resultPath).toBe('facebook/react');
    });

    it('3번째 세그먼트가 tree인 경우 해당 단어만 제거하여 경로를 구성해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/tree/main');
      expect(result.resultPath).toBe('facebook/react/main');
    });

    it('3번째 세그먼트가 blob인 경우 해당 단어만 제거하여 경로를 구성해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/blob/main/README.md');
      expect(result.resultPath).toBe('facebook/react/main/README.md');
    });

    it('쿼리 스트링이나 해시가 포함되어 있어도 pathname만 사용해야 한다.', () => {
      const urlWithExtra = 'https://github.com/facebook/react?tab=readme#section';
      const result = parseGitHubUrl(urlWithExtra);
      expect(result.resultPath).toBe('facebook/react');
    });
  });

  describe('에러 케이스', () => {
    it('GitHub이 아닌 호스트인 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('https://gitlab.com/facebook/react');
      expect(result).toEqual({
        success: false,
        error: 'GitHub URL만 지원합니다.',
      });
    });

    it('유효하지 않은 URL 형식인 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('not-a-url-string');
      expect(result).toEqual({
        success: false,
        error: '유효한 URL 형식이 아닙니다.',
      });
    });

    it('레포지토리 이름 없이 사용자명만 있는 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook');
      expect(result).toEqual({
        success: false,
        error: 'GitHub 레포지토리 주소를 정확히 입력해주세요.',
      });
    });
  });

  describe('엣지 케이스 (이름에 tree/blob이 포함된 경우)', () => {
    it('사용자 이름이 tree인 경우 경로를 그대로 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/tree/react');
      expect(result.resultPath).toBe('tree/react');
    });

    it('레포지토리 이름이 tree인 경우 경로를 그대로 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/tree');
      expect(result.resultPath).toBe('facebook/tree');
    });

    it('사용자 이름이 tree이고 브랜치 경로에 tree가 있는 경우 3번째 tree만 제거해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/tree/react/tree/main');
      expect(result.resultPath).toBe('tree/react/main');
    });

    it('브랜치명 자체가 tree인 경우 구분자 역할을 하는 3번째 요소만 제거해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/tree/tree');
      expect(result.resultPath).toBe('facebook/react/tree');
    });

    it('하위 디렉토리 이름이 tree인 경우 해당 경로는 제거하지 않고 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/tree/main/src/tree/components');
      expect(result.resultPath).toBe('facebook/react/main/src/tree/components');
    });
  });
});
