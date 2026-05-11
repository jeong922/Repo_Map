export const parseGitHubUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const host = urlObj.hostname.toLowerCase();

    if (host !== 'github.com' && host !== 'www.github.com') {
      return { success: false, error: 'GitHub URL만 지원합니다.' };
    }

    const segments = urlObj.pathname.split('/').filter(Boolean);

    if (segments.length < 2) {
      return { success: false, error: 'GitHub 레포지토리 주소를 정확히 입력해주세요.' };
    }

    let resultPath = '';

    if (segments[2] === 'tree' || segments[2] === 'blob') {
      const owner = segments[0];
      const repo = segments[1];
      const rest = segments.slice(3);
      resultPath = [owner, repo, ...rest].join('/');
    } else {
      resultPath = segments.join('/');
    }

    return { success: true, resultPath };
  } catch {
    return { success: false, error: '유효한 URL 형식이 아닙니다.' };
  }
};
