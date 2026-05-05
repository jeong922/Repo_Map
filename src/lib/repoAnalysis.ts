import { FileNode, RepositoryData, SourceContext } from '@/types/github';

export const generateAnalysis = async (repoData: RepositoryData) => {
  const treeStructure = repoData.tree
    .map((item: FileNode) => `${item.type === 'tree' ? '📁' : '📄'} ${item.path}`)
    .join('\n');

  const codeContext = repoData.sourceContext
    .map((file: SourceContext) => `--- FILE: ${file.path} ---\n${file.content}\n`)
    .join('\n');

  const finalPrompt = `
    당신은 코드베이스를 정밀 분석하여 아키텍처 인사이트를 제공하는 전문 분석 시스템입니다.
    제공된 GitHub 데이터를 바탕으로 객관적이고 명확한 분석 리포트를 한국어로 작성하세요.

    [주의사항]
    - "안녕하세요" 등의 불필요한 인사말은 모두 생략하고 바로 본론(###)으로 시작하세요.
    - 모든 답변은 반드시 **한국어**로 작성하세요.
    - 분석 내용 중 주요 로직이나 아키텍처적 설계가 드러나는 핵심 구간은 반드시 관련 소스 코드를 인용하여 설명하세요.
    - 톤앤매너: 전문적, 객관적, 분석적.

    [데이터 정보]
    - 프로젝트 구조:
    ${treeStructure}

    [주요 소스 코드]
    ${codeContext}

    [리포트 구성 요구사항]
    1. **기술 스택**: 프레임워크 및 라이브러리 요약.
    2. **핵심 로직 및 아키텍처**: 비즈니스 흐름 분석. (필요시 구조를 보여주는 의사코드나 핵심 코드 조각 포함)
    3. **코드 품질 및 패턴 리뷰**: 가독성/효율성 분석. 잘 작성된 부분이나 리팩토링이 필요한 부분을 실제 코드를 인용하여 평가하세요.
    4. **최적화 및 개선 제안**: 구체적인 개선 방향. "Before(현재 코드) & After(개선 제안 코드)" 방식을 활용하여 코드 블록으로 제시하세요.

    [분석 가이드라인]
    - 먼저 프로젝트의 전반적인 의도를 파악하세요.
    - 설정 파일(설정값)보다는 실제 비즈니스 로직이 담긴 파일을 우선적으로 심층 분석하세요.
    - 제공된 소스 코드 중 아키텍처적으로 가장 중요한 지점을 식별하여 분석에 활용하세요.
    - 개선 제안 시, 성능과 유지보수성 측면에서 가장 큰 임팩트를 줄 수 있는 부분을 우선순위로 두세요.

    [형식]
    - Markdown 형식을 유지하세요.
    - 제목은 3단계 헤더(###)부터 사용하세요.
    - 모든 코드 예시는 해당 언어의 문법 강조(예: \`\`\`typescript)를 적용하세요.
    - 리스트와 코드 블록을 적극 활용하여 시각적 가독성을 극대화하세요.
    `.trim();

  return finalPrompt;
};
