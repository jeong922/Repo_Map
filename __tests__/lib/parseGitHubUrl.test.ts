import { parseGitHubUrl } from '@/lib/parseGitHubUrl';

describe('parseGitHubUrl', () => {
  describe('정상 케이스', () => {
    it('기본 레포지토리 URL에서 owner/repo 경로를 추출해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map');

      expect(result).toEqual({
        success: true,
        resultPath: 'jeong922/Repo_Map',
      });
    });

    it('https 없이 github.com 주소도 허용해야 한다.', () => {
      const result = parseGitHubUrl('github.com/jeong922/Repo_Map');

      expect(result).toEqual({
        success: true,
        resultPath: 'jeong922/Repo_Map',
      });
    });

    it('https 없이 www.github.com 주소도 허용해야 한다.', () => {
      const result = parseGitHubUrl('www.github.com/jeong922/Repo_Map');

      expect(result).toEqual({
        success: true,
        resultPath: 'jeong922/Repo_Map',
      });
    });

    it('www.github.com 호스트도 허용해야 한다.', () => {
      const result = parseGitHubUrl('https://www.github.com/jeong922/Repo_Map');

      expect(result).toEqual({
        success: true,
        resultPath: 'jeong922/Repo_Map',
      });
    });

    it('대문자가 섞인 호스트네임도 자동 소문자화하여 처리해야 한다.', () => {
      const result = parseGitHubUrl('https://GITHUB.COM/jeong922/Repo_Map');

      expect(result.success).toBe(true);
      expect(result.resultPath).toBe('jeong922/Repo_Map');
    });

    it('마지막에 슬래시(trailing slash)가 있어도 무시하고 파싱해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map/');

      expect(result.resultPath).toBe('jeong922/Repo_Map');
    });

    it('3번째 세그먼트가 tree인 경우 해당 단어만 제거하여 경로를 구성해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map/tree/main');

      expect(result.resultPath).toBe('jeong922/Repo_Map/main');
    });

    it('3번째 세그먼트가 blob인 경우 해당 단어만 제거하여 경로를 구성해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map/blob/main/README.md');

      expect(result.resultPath).toBe('jeong922/Repo_Map/main/README.md');
    });

    it('쿼리 스트링이나 해시가 포함되어 있어도 pathname만 사용해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map?tab=readme#section');

      expect(result.resultPath).toBe('jeong922/Repo_Map');
    });
  });

  describe('에러 케이스', () => {
    it('GitHub이 아닌 호스트인 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('https://gitlab.com/jeong922/Repo_Map');

      expect(result).toEqual({
        success: false,
        error: 'GitHub URL만 지원합니다.',
      });
    });

    it('프로토콜 없이 GitHub가 아닌 주소인 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('not-a-url-string');

      expect(result).toEqual({
        success: false,
        error: 'GitHub URL만 지원합니다.',
      });
    });

    it('owner/repo 형식만 입력한 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('jeong922/Repo_Map');

      expect(result).toEqual({
        success: false,
        error: 'GitHub URL만 지원합니다.',
      });
    });

    it('레포지토리 이름 없이 사용자명만 있는 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922');

      expect(result).toEqual({
        success: false,
        error: 'GitHub 레포지토리 주소를 정확히 입력해주세요.',
      });
    });

    it('URL 파싱 자체가 불가능한 경우 에러를 반환해야 한다.', () => {
      const result = parseGitHubUrl('https://');

      expect(result).toEqual({
        success: false,
        error: '유효한 URL 형식이 아닙니다.',
      });
    });
  });

  describe('엣지 케이스 (이름에 tree/blob이 포함된 경우)', () => {
    it('사용자 이름이 tree인 경우 경로를 그대로 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/tree/Repo_Map');

      expect(result.resultPath).toBe('tree/Repo_Map');
    });

    it('레포지토리 이름이 tree인 경우 경로를 그대로 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/tree');

      expect(result.resultPath).toBe('jeong922/tree');
    });

    it('사용자 이름이 tree이고 브랜치 경로에 tree가 있는 경우 3번째 tree만 제거해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/tree/Repo_Map/tree/main');

      expect(result.resultPath).toBe('tree/Repo_Map/main');
    });

    it('브랜치명 자체가 tree인 경우 구분자 역할을 하는 3번째 요소만 제거해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map/tree/tree');

      expect(result.resultPath).toBe('jeong922/Repo_Map/tree');
    });

    it('하위 디렉토리 이름이 tree인 경우 해당 경로는 제거하지 않고 유지해야 한다.', () => {
      const result = parseGitHubUrl('https://github.com/jeong922/Repo_Map/tree/main/src/tree/components');

      expect(result.resultPath).toBe('jeong922/Repo_Map/main/src/tree/components');
    });
  });
});
