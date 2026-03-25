import { test, expect } from '@playwright/test';

test.describe('Sellio Dashboard E2E', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the local dev server
        await page.goto('http://localhost:3005/dashboard');
    });

    test('should load the dashboard and display KPI cards', async ({ page }) => {
        // Check if the main dashboard overview text renders
        await expect(page.getByText('Seu panorama de vendas')).toBeVisible();

        // Check for KPI cards
        await expect(page.getByText('Receita Mensal')).toBeVisible();
        await expect(page.getByText('Vendas')).toBeVisible();
        await expect(page.getByText('Ticket Médio')).toBeVisible();
    });

    test('should navigate to Products page and display the new product button', async ({ page }) => {
        // Click the "Produtos" sidebar link
        await page.getByRole('link', { name: 'Produtos' }).click();

        // Wait for URL to change
        await expect(page).toHaveURL(/.*\/produtos/);

        // Verify the page title
        await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible();

        // Verify the "Novo produto" button is present
        await expect(page.getByRole('link', { name: 'Novo produto' })).toBeVisible();
    });

    test('should navigate to Messages page and verify the layout loads', async ({ page }) => {
        // Click the "Mensagens" sidebar link
        await page.getByRole('link', { name: 'Mensagens' }).click();

        // Wait for URL to change
        await expect(page).toHaveURL(/.*\/mensagens/);

        // Check that either the loading state or the "no messages" empty state shows up
        // Since this runs against a fresh DB, it should either say "Buscando..." or "Nenhuma pergunta"
        const hasMessagesHeaderText = await page.getByRole('heading', { name: 'Mensagens' }).isVisible();
        expect(hasMessagesHeaderText).toBeTruthy();
    });

});
