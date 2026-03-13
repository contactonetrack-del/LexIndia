import { expect, test, type TestInfo } from '@playwright/test';

const PUBLIC_ROUTES = ['/en', '/en/lawyers', '/en/knowledge', '/en/templates'];

function getCookieUrl(testInfo: TestInfo): string {
  const baseURL = testInfo.project.use.baseURL;

  if (typeof baseURL !== 'string' || baseURL.length === 0) {
    throw new Error('Browser compliance tests require a configured Playwright baseURL.');
  }

  return new URL('/', baseURL).toString();
}

test('unprefixed routes redirect to locale-prefixed URLs', async ({ page }) => {
  await page.goto('/lawyers');
  await expect(page).toHaveURL(/\/en\/lawyers$/);
});

for (const route of PUBLIC_ROUTES) {
  test(`page shell renders with translated locale and theme support for ${route}`, async ({ context, page }, testInfo) => {
    await context.addCookies([
      {
        name: 'lexindia_theme',
        value: 'dark',
        url: getCookieUrl(testInfo),
      },
    ]);

    await page.goto(route);

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveClass(/dark/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
}

test('non-English locale updates html lang, keeps locale-prefixed route, and emits a locale-specific canonical URL', async ({ page }) => {
  await page.goto('/hi/knowledge');
  await expect(page).toHaveURL(/\/hi\/knowledge$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/hi\/knowledge$/);
});

test('tamil homepage does not leak english-only shell copy', async ({ page }) => {
  await page.goto('/ta');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('header')).not.toContainText('Legal Guides');
  await expect(page.locator('body')).not.toContainText('Total Lawyers');
  await expect(page.locator('body')).not.toContainText('found a trusted lawyer in');
});

test('tamil lawyers page removes english filter and sort labels', async ({ page }) => {
  await page.goto('/ta/lawyers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('body')).not.toContainText('Rating: High to Low');
  await expect(page.locator('body')).not.toContainText('Specialization');
  await expect(page.locator('body')).not.toContainText('Location not specified');
});

test('hindi pricing page renders localized plans instead of english fallback', async ({ page }) => {
  await page.goto('/hi/pricing');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('body')).not.toContainText('Grow your legal practice with LexIndia');
  await expect(page.locator('body')).not.toContainText('Create Free Profile');
  await expect(page.locator('body')).not.toContainText('Open English Page');
});

test('hindi knowledge page keeps localized shared CTA and lead capture blocks', async ({ page }) => {
  await page.goto('/hi/knowledge');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('#lead-email')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Talk to a Lawyer');
  await expect(page.locator('body')).not.toContainText('Know Your Rights. Protect Your Future.');
});

test('hindi templates page does not leak english category or upsell copy', async ({ page }) => {
  await page.goto('/hi/templates');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('body')).not.toContainText('Need help drafting a custom document?');
  await expect(page.locator('body')).not.toContainText('Filter by category');
});

test('lawyers api returns localized taxonomy data for hindi locale', async ({ request }) => {
  const response = await request.get('/api/lawyers?locale=hi');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(Array.isArray(data.lawyers)).toBeTruthy();
  expect(data.lawyers.length).toBeGreaterThan(0);

  const hasLocalizedSpecialization = data.lawyers.some((lawyer: any) =>
    lawyer.specializations?.some((specialization: any) => /[^\u0000-\u007F]/.test(specialization.name))
  );
  const hasLocalizedLanguage = data.lawyers.some((lawyer: any) =>
    lawyer.languages?.some((language: any) => /[^\u0000-\u007F]/.test(language.name))
  );

  expect(hasLocalizedSpecialization).toBeTruthy();
  expect(hasLocalizedLanguage).toBeTruthy();
});

test('hindi lawyer profile renders localized route copy', async ({ page, request }) => {
  const response = await request.get('/api/lawyers?locale=hi');
  const data = await response.json();
  const lawyerId = data.lawyers?.[0]?.id;

  expect(typeof lawyerId).toBe('string');

  await page.goto(`/hi/lawyers/${lawyerId}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('body')).not.toContainText('Back to lawyers');
  await expect(page.locator('body')).not.toContainText('Open English Page');
});

test('tamil rights page is localized and theme-safe', async ({ context, page }, testInfo) => {
  await context.addCookies([
    {
      name: 'lexindia_theme',
      value: 'dark',
      url: getCookieUrl(testInfo),
    },
  ]);

  await page.goto('/ta/rights');

  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('body')).not.toContainText('Select Your Situation');
  await expect(page.locator('body')).not.toContainText("Women's Rights");
});

test('tamil about page renders localized content without english marketing copy', async ({ page }) => {
  await page.goto('/ta/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('body')).not.toContainText('Our Story');
  await expect(page.locator('body')).not.toContainText('Making Legal Help');
});

test('tamil contact page renders localized support copy without english fallback', async ({ page }) => {
  await page.goto('/ta/contact');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('body')).not.toContainText('Contact LexIndia');
  await expect(page.locator('body')).not.toContainText('Send us a message');
});

test('tamil guides page keeps localized overlays and AI assistant available', async ({ page }) => {
  await page.goto('/ta/guides');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('body')).not.toContainText('Free legal guides');
  await expect(page.locator('#lead-email')).toBeVisible();
  await expect(page.getByTestId('chatbot-trigger')).toBeVisible();
  await page.getByTestId('chatbot-trigger').click();
  await expect(page.getByTestId('chatbot-input')).toBeVisible();
  await expect(page.getByTestId('chatbot-input')).not.toHaveAttribute('placeholder', 'Ask a legal question...');
});

test('localized not-found page avoids english fallback copy', async ({ page }) => {
  await page.goto('/hi/this-route-does-not-exist');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('body')).not.toContainText('Page Not Found');
  await expect(page.locator('body')).not.toContainText('Go Home');
});

test('tamil booking route keeps localized signed-out state', async ({ page }) => {
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    });
  });

  await page.route('**/api/lawyers/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        lawyer: {
          id: 'mock-lawyer',
          consultationFee: 1500,
          isVerified: true,
          user: {
            name: 'Anand',
            image: null,
          },
          specializations: [{ name: 'Family Law' }],
          modes: [{ mode: 'VIDEO' }],
        },
      }),
    });
  });

  await page.goto('/ta/book/mock-lawyer');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('body')).not.toContainText('Sign In to Book');
  await expect(page.locator('body')).not.toContainText('Go to Homepage and Sign In');
});
