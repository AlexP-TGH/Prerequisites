import {Locator, Page} from "@playwright/test";

export class StoreCPanelLicenses {
    private page: Page;

    private nameLocator = (productName: string): string => `//span[normalize-space(text())="${productName}"]`;
    private priceLocator = (productName: string): string => `${this.nameLocator(productName)}/../..//span[@class="price"]`;
    private orderButtonLocator = (productName: string): string => `${this.nameLocator(productName)}/../..//a[normalize-space()="Order Now"]`;

    constructor(page: Page) {
        this.page = page;
    }

    private createProductLocators(productName: string): { name: Locator; price: Locator; orderButton: Locator } {
        const name = this.page.locator(this.nameLocator(productName));
        const price = this.page.locator(this.priceLocator(productName));
        const orderButton = this.page.locator(this.orderButtonLocator(productName));

        return {orderButton, name, price};
    }

    async clickOrder(productName: string) {
        const locators = this.createProductLocators(productName);
        await this.page.waitForSelector(this.orderButtonLocator(productName));
        await locators.orderButton.click();
    }

    async getProductName(productName: string): Promise<string | null> {
        const locators = this.createProductLocators(productName);
        return await locators.name.textContent();
    }

    async getProductPrice(productName: string): Promise<string> {
        const locators = this.createProductLocators(productName);
        const priceText = await locators.price.textContent();
        return priceText ? priceText.replace(/[^\d.]/g, '') : '';
    }
}
