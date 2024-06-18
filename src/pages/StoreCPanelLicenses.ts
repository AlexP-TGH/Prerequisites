import {Locator, Page} from "@playwright/test";
import dataProducts from "../data/products";

export class StoreCPanelLicenses {
    private page: Page;

    private static nameLocator = (productName: string): string => `//span[normalize-space(text())="${productName}"]`;
    private static priceLocator = (productName: string): string => `${StoreCPanelLicenses.nameLocator(productName)}/../..//span[@class="price"]`;
    private static orderButtonLocator = (productName: string): string => `${StoreCPanelLicenses.nameLocator(productName)}/../..//a[normalize-space()="Order Now"]`;

    private readonly products: { [key: string]: { [key: string]: Locator } };
    private static readonly productNames: string[] = Object.values(dataProducts);

    constructor(page: Page) {
        this.page = page;
    }

    private createProductLocators(productName: string): { [key: string]: Locator } {
        const name = this.page.locator(StoreCPanelLicenses.nameLocator(productName));
        const price = this.page.locator(StoreCPanelLicenses.priceLocator(productName));
        const orderButton = this.page.locator(StoreCPanelLicenses.orderButtonLocator(productName));

        return {orderButton, name, price};
    }

    async clickOrder(productName: string) {
        const locators = this.createProductLocators(productName);
        await this.page.waitForSelector(StoreCPanelLicenses.orderButtonLocator(productName));
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
