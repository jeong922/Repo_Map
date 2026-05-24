import { RepositoryData, SourceContext } from '@/types/github';

export const generateAnalysis = async (repoData: RepositoryData) => {
  const treeStructure = repoData.tree.map((item) => item.path).join('\n');

  const codeContext = repoData.sourceContext
    .map((file: SourceContext) => `// === ${file.path} ===\n${file.content}`)
    .join('\n\n');

  const finalPrompt = `
# ROLE
Senior Software Architect.

# TASK
Analyze the provided repository and generate a technical report.

# RULES
- Language: Korean
- Start directly with: "### 1. 기술 스택"
- No greetings
- Use Markdown
- Use syntax-highlighted code blocks
- Focus on business logic
- Ignore unimportant configs and boilerplate
- Cite real code snippets
- Avoid speculation

# PROJECT STRUCTURE
${treeStructure}

# CORE CODE CONTEXT
${codeContext}

# REQUIRED OUTPUT

### 1. 기술 스택
- Frameworks
- Libraries
- Runtime/Infrastructure

### 2. 핵심 로직 및 아키텍처
- Main business flow
- Key modules
- Architectural decisions
- Important code snippets

### 3. 코드 품질 및 패턴 리뷰
- Readability
- Maintainability
- Design patterns
- Anti-patterns

### 4. 최적화 및 개선 제안
- Performance improvements
- Maintainability improvements
- Before/After code examples
`.trim();

  return finalPrompt;
};
