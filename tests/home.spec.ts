import { test, expect } from '@playwright/test';

test('홈 페이지 주요 UI가 렌더링된다.', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('분석을 원하는 GitHub 링크를 입력해 주세요.')).toBeVisible();

  await expect(page.getByRole('textbox')).toBeVisible();

  await expect(page.getByRole('button', { name: /analyze repository/i })).toBeVisible();
});

test('초기 진입 시 분석 버튼은 비활성화 상태다', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', {
    name: /analyze repository/i,
  });

  await expect(button).toBeDisabled();
});

test('GitHub URL 입력 시 분석 버튼이 활성화된다', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('textbox');
  const button = page.getByRole('button', { name: /analyze repository/i });

  await input.pressSequentially('github.com/jeong922/Repo_Map');

  await expect(button).toBeEnabled();
});

test('GitHub URL 입력 시 repository 페이지로 이동한다', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('textbox');

  await input.pressSequentially('github.com/jeong922/Repo_Map');

  const button = page.getByRole('button', { name: /analyze repository/i });

  await expect(button).toBeEnabled();

  await button.click();

  await expect(page).toHaveURL(/\/repository\/jeong922\/Repo_Map$/);
});

test('잘못된 URL 입력 시 에러 메시지를 표시한다', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('textbox');

  await input.pressSequentially('invalid-url');

  await page.getByRole('button', { name: /analyze repository/i }).click();

  await expect(page.getByText('GitHub URL만 지원합니다.')).toBeVisible();
});

test('잘못된 URL 입력 시 페이지 이동이 발생하지 않는다', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('textbox');

  await input.pressSequentially('invalid-url');

  await page.getByRole('button', { name: /analyze repository/i }).click();

  await expect(page).toHaveURL('/');
});
