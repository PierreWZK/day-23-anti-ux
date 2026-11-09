import { test, expect, type Page } from '@playwright/test';
import specimens from './specimens.json';

const TOTAL = specimens.length;

async function fresh(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('Accueil', () => {
  test('présente le musée, la pièce maîtresse et les 37 salles', async ({ page }) => {
    await fresh(page, '/');
    await expect(page).toHaveTitle('Anti-UX · Le musée des erreurs d’interface');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Le musée des erreurs d’interface');
    await expect(page.locator('#piece-maitresse a[href="coiffeur/sans-ux.html"]')).toBeVisible();
    await expect(page.locator('#piece-maitresse a[href="coiffeur/avec-ux.html"]')).toBeVisible();
    await expect(page.locator('.salle-card')).toHaveCount(TOTAL);
    await expect(page.locator('.aile')).toHaveCount(6);
    await expect(page.locator('.progress-home')).toHaveText(`0 salle visitée sur ${TOTAL}`);
  });

  test('« Entrer dans le musée » ouvre la salle 01', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Entrer dans le musée/ }).click();
    await expect(page).toHaveURL(new RegExp(`salles/${specimens[0].slug}(\\.html)?$`));
  });

  test('une salle visitée est marquée sur le plan', async ({ page }) => {
    const first = specimens[0];
    await fresh(page, `salles/${first.slug}.html`);
    await page.click(`#reveal-btn-${first.slug}`);
    await page.goto('/');
    await expect(page.locator(`.salle-card[data-slug="${first.slug}"]`)).toHaveClass(/is-visited/);
    await expect(page.locator('.progress-home')).toHaveText(`1 salle visitée sur ${TOTAL}`);
  });

  test('le lien d’évitement mène au contenu', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenu$/);
  });

  test('le pied de page renvoie à ProjectP', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="https://projectp.fr/"]')).toHaveText('30 jours, 30 projets');
  });

  test('aucun défilement horizontal en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});

test.describe('Salles', () => {
  for (const [i, salle] of specimens.entries()) {
    test(`${salle.num} ${salle.title} : le piège ouvre la vitrine réparée`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await fresh(page, salle.path);

      const good = page.locator(`#col-bien-${salle.slug}`);
      await expect(good).toHaveClass(/blurred/);
      await expect(page.locator(`#overlay-${salle.slug}`)).toBeVisible();

      for (const [action, selector, value] of salle.steps as [string, string | number, string?][]) {
        if (action === 'wait') { await page.waitForTimeout(selector as number); continue; }
        const el = page.locator(`#col-mal-${salle.slug}`).locator(selector as string).first();
        if (action === 'click') await el.click();
        else if (action === 'fill') await el.fill(value!);
        else if (action === 'type') await el.pressSequentially(value!);
        else if (action === 'select') await el.selectOption(value!);
        else if (action === 'press') await el.press(value!);
      }

      await expect(good).not.toHaveClass(/blurred/, { timeout: 8000 });
      await expect(page.locator(`#overlay-${salle.slug}`)).toBeHidden();
      await expect(page.locator(`#status-${salle.slug}`)).toContainText('Piège subi');
      expect(errors).toEqual([]);
    });

    test(`${salle.num} ${salle.title} : « Ouvrir quand même » reste une sortie`, async ({ page }) => {
      await fresh(page, salle.path);
      await page.click(`#reveal-btn-${salle.slug}`);
      await expect(page.locator(`#col-bien-${salle.slug}`)).not.toHaveClass(/blurred/);
      await expect(page.locator(`#reveal-btn-${salle.slug}`)).toBeDisabled();
      await expect(page.locator(`#progress-${salle.slug}`)).toHaveText(`1 salle visitée sur ${TOTAL}`);
      const next = specimens[i + 1];
      await expect(page.locator('.pager-link.next')).toHaveAttribute('href', next ? `${next.slug}.html` : '../index.html#piece-maitresse');
    });
  }
});

test('le menu corrigé se ferme avec Échap', async ({ page }) => {
  await page.goto('salles/navigation.html');
  await page.click('#reveal-btn-navigation');
  const toggle = page.locator('#menu-toggle-good');
  await toggle.click();
  await expect(page.locator('#menu-good')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-good')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test.describe('Coiffeur Antique', () => {
  for (const page_ of ['coiffeur/sans-ux.html', 'coiffeur/avec-ux.html']) {
    test(`${page_} se charge sans erreur et ramène au musée`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(page_);
      await expect(page.locator('.musee-bar a[href="../index.html#piece-maitresse"]')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
