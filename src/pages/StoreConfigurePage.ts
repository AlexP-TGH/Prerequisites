import {Locator, Page} from "@playwright/test";

export class StoreConfigurePage {
    private page: Page;
    private ipAddressInput = (): string => '//div[@class="form-group"]/input[@type="text"]';
    private summaryContinueButton = (): string => '//button[@id="btnCompleteProductConfig"]';

    private checkboxLocator = (name: string): string => `//label[normalize-space(.)="${name}"]`;
    private priceLocator = (): string => '../..//div[@class="panel-price"]';

    private createProduct = (name: string): string => `//span[contains(normalize-space(), "${name}")]`;
    private createOrder = (name: string): string => `${this.createProduct(name)}/../span[@class="pull-right float-right"]`;

    constructor(page: Page) {
        this.page = page;
    }

    private createAddonLocators(name: string): { checkbox: Locator; price: Locator } {
        const checkbox = this.page.locator(this.checkboxLocator(name));
        const price = checkbox.locator(this.priceLocator());

        return {checkbox, price};
    }

    async fillIPAddressInput(ip: string) {
        await this.page.waitForSelector(this.ipAddressInput(), {state: 'visible'});
        await this.page.fill(this.ipAddressInput(), ip);
    }

    async clickAddonCheckbox(name: string) {
        const locators = this.createAddonLocators(name);
        await locators.checkbox.check();
    }

    async getAddonPrice(name: string): Promise<string> {
        const locators = this.createAddonLocators(name);
        const priceText = await locators.price.textContent();

        return priceText.replace(/[^\d.]/g, '');
    }

    async getOrderPrice(name: string): Promise<string> {
        const locator = this.page.locator(this.createOrder(name));
        await locator.waitFor({state: 'visible'});

        const textContent = await locator.textContent();
        return textContent ? textContent.replace(/[^\d.]/g, '') : '';
    }

    async clickSummaryContinue() {
        await this.page.locator(this.summaryContinueButton()).isEnabled();
        await this.page.locator(this.summaryContinueButton()).click();
    }
}
