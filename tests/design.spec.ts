import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [375, 768, 1440]) {
    test(`${colorScheme} / ${width}: 홈과 분석 문서의 반응형 표시`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 1000 });
      await page.route('**/api/repository', (route) =>
        route.fulfill({
          json: { success: true, treeCount: 1, currentBranch: 'main' },
        }),
      );
      await page.route('**/api/chat', (route) =>
        route.fulfill({
          contentType: 'text/plain; charset=utf-8',
          body: '# 프로젝트 개요\n\n분석 결과의 본문입니다. **핵심 구조**를 확인하세요.\n\n## 실행 순서\n\n1. 저장소 연결\n2. 코드 분석\n\n> 프로젝트 설명\n\n| 파일 | 역할 | 참고 |\n| --- | --- | --- |\n| src/app/page.tsx | 홈 화면 | 진입점 |\n\n```typescript\nconst message = "Repo Map";\nconsole.log(message);\n```',
        }),
      );
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('html')).toHaveClass(new RegExp(colorScheme));
      await expect(page.getByRole('textbox')).toHaveAccessibleName('GitHub 저장소 URL');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('textbox').fill('github.com/example/project');
      await page.getByRole('button', { name: 'Analyze repository' }).click();
      await expect(page.getByText('Gemini AI Insights')).toBeVisible();
      await expect(page.locator('.report-markdown ol')).toHaveCSS('list-style-type', 'decimal');
      await expect(page.getByRole('region', { name: '분석 결과 표' })).toBeVisible();
      const codeBlock = page.locator('.report-markdown .rounded-3xl');
      await expect(codeBlock).toHaveCSS('background-color', 'rgb(26, 28, 30)');
      await expect(codeBlock).toHaveCSS('border-radius', '24px');
      await expect(codeBlock.locator('div[style]').first()).toHaveCSS('padding', '24px');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
