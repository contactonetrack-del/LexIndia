import { expect, test, type Page } from '@playwright/test';

function routeAnonymousSession(page: Page) {
  return page.route('**/api/auth/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    });
  });
}

test('laws are exposed in desktop and mobile navigation plus homepage discovery', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Navigation assertions are covered in the Chromium project only.');

  await routeAnonymousSession(page);
  await page.route('**/api/stats**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ lawyers: 4, verified: 3 }),
    });
  });

  await page.goto('/en');
  await expect(page.getByTestId('header-laws-link')).toHaveAttribute('href', '/en/laws');
  await expect(page.getByTestId('homepage-laws-link')).toHaveAttribute('href', '/en/laws');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await expect(page.getByTestId('mobile-nav-laws-link')).toHaveAttribute('href', '/en/laws');
});

test('citizens can browse from law list to act and section detail pages', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/laws');
  await expect(
    page.getByRole('heading', { name: 'Browse important Indian laws and sections' })
  ).toBeVisible();
  await expect(page.getByTestId('laws-act-card-constitution-of-india')).toBeVisible();

  await page.goto('/en/laws/constitution-of-india');
  await expect(
    page.getByRole('heading', { name: 'Constitution of India' })
  ).toBeVisible();
  await expect(page.getByText('Article 21')).toBeVisible();

  await page.goto('/en/laws/constitution-of-india/Article%2021');
  await expect(
    page.getByRole('heading', { name: 'Protection of life and personal liberty' })
  ).toBeVisible();
  await expect(page.getByText('Plain-English meaning')).toBeVisible();
});

test('law pages expose official source links and new BNS BNSS coverage', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/laws');
  await expect(page.getByTestId('laws-act-card-bharatiya-nyaya-sanhita-2023')).toBeVisible();
  await expect(
    page.getByTestId('laws-act-card-bharatiya-nagarik-suraksha-sanhita-2023')
  ).toBeVisible();
  await expect(page.getByTestId('laws-act-card-bharatiya-sakshya-adhiniyam-2023')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-companies-act-2013')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-central-goods-and-services-tax-act-2017')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-delhi-rent-control-act-1958')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-negotiable-instruments-act-1881')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-indian-evidence-act-1872')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-maharashtra-rent-control-act-1999')).toBeVisible();

  await page.goto('/en/laws/bharatiya-nagarik-suraksha-sanhita-2023');
  await expect(
    page.getByRole('heading', { name: 'Bharatiya Nagarik Suraksha Sanhita, 2023' })
  ).toBeVisible();
  await expect(page.getByTestId('act-official-source')).toContainText('India Code');
  await expect(page.getByTestId('act-current-version')).toContainText(
    '2023 procedure code currently in force'
  );
  await expect(page.getByTestId('act-code-transitions')).toContainText(
    'Code of Criminal Procedure, 1973'
  );
  await expect(
    page.getByTestId('act-official-source').getByRole('link', { name: /Open official act page/i })
  ).toHaveAttribute('href', /indiacode\.nic\.in/);

  await page.goto('/en/laws/bharatiya-nagarik-suraksha-sanhita-2023/Section%20173');
  await expect(
    page.getByRole('heading', { name: 'Information in cognizable cases' })
  ).toBeVisible();
  await expect(page.getByTestId('law-section-official-source')).toContainText('India Code');
  await expect(
    page.getByRole('heading', { name: 'Also searched as' }).locator('..').getByText('zero fir', {
      exact: true,
    })
  ).toBeVisible();
  await expect(page.getByTestId('law-section-crosswalks')).toContainText('CrPC Section 154');
});

test('law pages expose amendment timelines and section-level citation history', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/laws/negotiable-instruments-act-1881');
  await expect(
    page.getByRole('heading', { name: 'Negotiable Instruments Act, 1881' })
  ).toBeVisible();
  await expect(page.getByTestId('act-history-timeline')).toContainText(
    'Interim compensation amendment'
  );

  await page.goto('/en/laws/indian-evidence-act-1872/Section%2065B');
  await expect(
    page.getByRole('heading', { name: 'Admissibility of electronic records' })
  ).toBeVisible();
  await expect(page.getByTestId('law-section-history')).toContainText(
    'Historical citation after code transition'
  );
  await expect(page.getByTestId('law-section-crosswalks')).toContainText('BSA Section 63');
});

test('historical IPC pages show the successor-code transition clearly', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/laws/indian-penal-code-1860');
  await expect(page.getByRole('heading', { name: 'Indian Penal Code, 1860' })).toBeVisible();
  await expect(page.getByTestId('act-current-version')).toContainText('Historical');
  await expect(page.getByTestId('act-code-transitions')).toContainText(
    'Bharatiya Nyaya Sanhita, 2023'
  );
});

test('laws browse can be filtered by mapped issue topics', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/laws?issue=fir-and-police-complaints');
  await expect(
    page.getByTestId('laws-issue-chip-fir-and-police-complaints')
  ).toBeVisible();
  await expect(
    page.getByTestId('laws-act-card-bharatiya-nagarik-suraksha-sanhita-2023')
  ).toBeVisible();
  await expect(page.getByTestId('laws-act-card-constitution-of-india')).toHaveCount(0);

  await page.goto('/en/laws?issue=divorce-and-matrimonial-relief');
  await expect(
    page.getByTestId('laws-issue-chip-divorce-and-matrimonial-relief')
  ).toBeVisible();
  await expect(page.getByTestId('laws-act-card-hindu-marriage-act-1955')).toBeVisible();
  await expect(page.getByTestId('laws-act-card-special-marriage-act-1954')).toBeVisible();
});

test('ranked discovery search returns live law results from the seeded corpus', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.goto('/en/knowledge?q=FIR');
  await expect(page.locator('#knowledge-search')).toHaveValue('FIR');
  await expect(page.getByTestId('knowledge-search-group-guides')).toContainText(
    'How to File an FIR'
  );
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 173');

  await page
    .getByTestId('knowledge-search-group-laws')
    .getByRole('link', { name: /Section 173: Information in cognizable cases/i })
    .click();
  await expect(page).toHaveURL(
    /\/en\/laws\/bharatiya-nagarik-suraksha-sanhita-2023\/Section%20173$/
  );

  await page.goto('/en/knowledge?q=gst%20notice');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 73');

  await page.goto('/en/knowledge?q=board%20meeting');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 173');

  await page.goto('/en/knowledge?q=electronic%20evidence');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 63');

  await page.goto('/en/knowledge?q=delhi%20tenant%20eviction');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 14');

  await page.goto('/en/knowledge?q=cheque%20bounce');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 138');

  await page.goto('/en/knowledge?q=65B%20certificate');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 65B');

  await page.goto('/en/knowledge?q=gst%20summons');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 70');

  await page.goto('/en/knowledge?q=leave%20and%20licence%20eviction');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 24');
});

test('multilingual and transliterated queries resolve through the dedicated search index', async ({
  page,
}) => {
  await routeAnonymousSession(page);

  await page.goto('/en/knowledge?q=%E0%A4%8F%E0%A4%AB%E0%A4%86%E0%A4%88%E0%A4%86%E0%A4%B0');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 173');

  await page.goto('/en/knowledge?q=girftari');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 35');

  await page.goto('/en/knowledge?q=mutual%20consent%20divorce');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 13B');

  await page.goto('/en/knowledge?q=sale%20deed');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 54');

  await page.goto('/en/knowledge?q=IPC%20420');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 318');

  await page.goto('/en/knowledge?q=CrPC%20154');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 173');

  await page.goto('/en/knowledge?q=mutul%20consent%20divorse');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 13B');

  await page.goto('/en/knowledge?q=chek%20bounce');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 138');
});

test('knowledge search shows cross-type results and links into law content', async ({ page }) => {
  await routeAnonymousSession(page);
  await page.route('**/api/knowledge?locale=*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        categories: [
          {
            id: 'faq-cyber',
            name: 'Cyber Law',
            faqs: [
              {
                id: 'faq-1',
                question: 'How do I report cyber fraud?',
                answer: 'Preserve screenshots and file a cyber complaint quickly.',
              },
            ],
          },
        ],
      }),
    });
  });
  await page.route('**/api/discovery/search?q=*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        guides: [
          {
            href: '/guides/how-to-file-fir',
            title: 'How to File an FIR',
            description: 'Criminal Law',
          },
        ],
        rights: [
          {
            href: '/rights/cybercrime',
            title: 'Cybercrime Support',
            description: 'Reviewed rights summary',
          },
        ],
        laws: [
          {
            href: '/laws/information-technology-act-2000/Section%2066D',
            title: 'Section 66D: Cheating by personation using computer resources',
            description: 'Information Technology Act, 2000 - fraud and impersonation guidance.',
          },
        ],
      }),
    });
  });

  await page.goto('/en/knowledge?q=cyber');
  await expect(page.locator('#knowledge-search')).toHaveValue('cyber');
  await expect(page.getByTestId('knowledge-search-group-guides')).toContainText('How to File an FIR');
  await expect(page.getByTestId('knowledge-search-group-rights')).toContainText('Cybercrime Support');
  await expect(page.getByTestId('knowledge-search-group-laws')).toContainText('Section 66D');

  await page.getByRole('link', { name: /Section 66D: Cheating by personation/i }).click();
  await expect(page).toHaveURL(/\/en\/laws\/information-technology-act-2000\/Section%2066D$/);
  await expect(
    page.getByRole('heading', { name: 'Cheating by personation using computer resources' })
  ).toBeVisible();
});
