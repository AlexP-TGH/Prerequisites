import {expect, Locator, Page} from '@playwright/test';

export class StoreReviewPage {
    private page: Page;

    private static orderSummarySubtotalSelector = () => '//span[@id="subtotal"]';
    private static orderCheckoutButtonSelector = () => '//a[@id="checkout"]';
    private static productNameSelector = (productName: string) => `//div[@class="item"]//span[normalize-space(text())="${productName}"]`;

    private static productPriceSelector = (productName: string): string => `${StoreReviewPage.productNameSelector(productName)}/ancestor::div[@class="item"]//div[contains(@class, "item-price")]/span[1]`;
    private static productPriceMonthlySelector = (productName: string): string => `${StoreReviewPage.productNameSelector(productName)}/ancestor::div[@class="item"]//div[contains(@class, "item-price")]/span[2]`;

    constructor(page: Page) {
        this.page = page;
    }

    private getProductLocators(productName: string): { [key: string]: Locator } {
        const name = this.page.locator(StoreReviewPage.productNameSelector(productName));
        const price = this.page.locator(StoreReviewPage.productPriceSelector(productName));
        const priceMonthly = this.page.locator(StoreReviewPage.productPriceMonthlySelector(productName));

        return {name, price, priceMonthly};
    }

    async checkPriceRemainingDays(productName: string): Promise<string> {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const totalDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        const productLocators = this.getProductLocators(productName);
        const monthlyPriceText = await productLocators.priceMonthly.innerText();
        const monthlyPrice = parseFloat(monthlyPriceText.replace(/[^\d.]/g, ''));

        const remainingDays = totalDaysInMonth - currentDay + 1;
        const remainingPrice = (monthlyPrice / totalDaysInMonth * remainingDays);

        return remainingPrice.toFixed(2);
    }

    async assertProductNameVisible(productName: string) {
        await expect(this.getProductLocators(productName).name).toBeVisible();
    }

    async getProductDuePrice(productName: string): Promise<string> {
        const priceDueText = await this.getProductLocators(productName).price.textContent();

        return priceDueText ? priceDueText.replace(/[^\d.]/g, '') : '';
    }

    async getProductMonthlyPrice(productName: string): Promise<string> {
        const priceMonthlyText = await this.getProductLocators(productName).priceMonthly.textContent();

        return priceMonthlyText ? priceMonthlyText.replace(/[^\d.]/g, '') : '';
    }

    async getSummarySubtotal(): Promise<string> {
        const subtotalText = await this.page.locator(StoreReviewPage.orderSummarySubtotalSelector()).textContent();

        return subtotalText ? subtotalText.replace(/[^\d.]/g, '') : '';
    }

    async clickOrderCheckoutButton() {
        await this.page.waitForSelector(StoreReviewPage.orderCheckoutButtonSelector());
        await this.page.locator(StoreReviewPage.orderCheckoutButtonSelector()).click();
    }
}
