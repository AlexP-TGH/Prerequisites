import {expect, Locator, Page} from '@playwright/test';

export class StoreReviewPage {
    private page: Page;

    private orderSummarySubtotalSelector = () => '//span[@id="subtotal"]';
    private orderCheckoutButtonSelector = () => '//a[@id="checkout"]';
    private productNameSelector = (productName: string) => `//div[@class="item"]//span[normalize-space(text())="${productName}"]`;

    private productPriceSelector = (productName: string): string => `${this.productNameSelector(productName)}/ancestor::div[@class="item"]//div[contains(@class, "item-price")]/span[1]`;
    private productPriceMonthlySelector = (productName: string): string => `${this.productNameSelector(productName)}/ancestor::div[@class="item"]//div[contains(@class, "item-price")]/span[2]`;

    constructor(page: Page) {
        this.page = page;
    }

    private getProductLocators(productName: string): { name: Locator; price: Locator; priceMonthly: Locator } {
        const name = this.page.locator(this.productNameSelector(productName));
        const price = this.page.locator(this.productPriceSelector(productName));
        const priceMonthly = this.page.locator(this.productPriceMonthlySelector(productName));

        return {name, price, priceMonthly};
    }

    async calculatePriceRemainingDays(productName: string): Promise<string> {
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
        const subtotalText = await this.page.locator(this.orderSummarySubtotalSelector()).textContent();

        return subtotalText ? subtotalText.replace(/[^\d.]/g, '') : '';
    }

    async clickOrderCheckoutButton() {
        await this.page.waitForSelector(this.orderCheckoutButtonSelector());
        await this.page.locator(this.orderCheckoutButtonSelector()).click();
    }
}
