import { RepositoryData } from '@/types/github';

export const generateAnalysis = async (repoData: RepositoryData) => {
  const treeStructure = repoData.tree
    .map((item: { path: string; type: string }) => `${item.type === 'tree' ? '📁' : '📄'} ${item.path}`)
    .join('\n');

  const codeContext = repoData.sourceContext
    .map((file: { path: string; content: string }) => `--- FILE: ${file.path} ---\n${file.content}\n`)
    .join('\n');

  const finalPrompt = `
    너는 매우 숙련된 10년 이상 경력을 가진 풀스택 개발자이자 코드 분석가라고 생각해줘.
    제공된 GitHub 레포지토리 정보를 바탕으로 아래 요구사항에 맞는 상세한 분석을 해줘.

    [프로젝트 파일 구조]
    ${treeStructure}

    [주요 파일 소스 코드]
    ${codeContext}

    [답변 가이드라인]
    1. 기술 스택(프레임워크, 라이브러리 등)을 파악하여 요약해줘.
    2. 프로젝트의 핵심 기능과 아키텍처 패턴을 설명해줘.
    3. 작성된 코드에 대해 평가해줘.
    3. 코드의 품질이나 개선 방향이 있다면 제안해줘.
    답변은 읽기 쉽게 Markdown 형식을 사용해주고, 답변은 존댓말로 해주면 좋겠어.
    `.trim();

  return finalPrompt;
};
