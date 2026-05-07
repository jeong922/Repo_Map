export const parseGitHubUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      return { error: 'GitHub URL만 지원합니다.' };
    }
    const pathname = urlObj.pathname.split('/').filter(Boolean);
    if (pathname.length < 2) {
      return { error: 'GitHub 레포지토리 주소를 정확히 입력해주세요.' };
    }
    const resultPath = pathname.filter((segment) => segment !== 'tree').join('/');
    return { resultPath, error: null };
  } catch {
    return { error: '유효한 URL 형식이 아닙니다.' };
  }
};
