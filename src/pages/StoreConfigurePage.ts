import {Locator, Page} from "@playwright/test";
import dataProducts from "../data/products";
import dataAddons from "../data/addons";

export class StoreConfigurePage {
    private page: Page;
    private static ipAddressInput = (): string => '//div[@class="form-group"]/input[@type="text"]';
    private static summaryContinueButton = (): string => '//button[@id="btnCompleteProductConfig"]';

    public static checkboxLocator = (name: string): string => `//label[normalize-space(.)="${name}"]`;
    public static priceLocator = (): string => '../..//div[@class="panel-price"]';
    public static addButtonLocator = (): string => '../..//div[@class="panel-add"]';

    public static createProduct = (name: string): string => `//span[contains(normalize-space(), "${name}")]`;
    public static createOrder = (name: string): string => `${StoreConfigurePage.createProduct(name)}/../span[@class="pull-right float-right"]`;

    private readonly addons: { [key: string]: { [key: string]: Locator } };
    private readonly products: { [key: string]: Locator };

    private readonly orderLocators: { [key: string]: Locator };

    private static readonly productNames: string[] = Object.values(dataProducts);
    private static readonly addonNames: string[] = Object.values(dataAddons);

    constructor(page: Page) {
        this.page = page;
    }

    private createAddonLocators(name: string): { [key: string]: Locator } {
        const checkbox = this.page.locator(StoreConfigurePage.checkboxLocator(name));
        const price = checkbox.locator(StoreConfigurePage.priceLocator());
        const addButton = checkbox.locator(StoreConfigurePage.addButtonLocator());

        return {checkbox, price, addButton};
    }

    async fillIPAddressInput(ip: string) {
        await this.page.waitForSelector(StoreConfigurePage.ipAddressInput(), {state: 'visible'});
        await this.page.fill(StoreConfigurePage.ipAddressInput(), ip);
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

    async clickAddonAddButton(name: string) {
        const locators = this.createAddonLocators(name);
        await locators.addButton.click();
    }

    async getOrderPrice(name: string): Promise<string> {
        const locator = this.page.locator(StoreConfigurePage.createOrder(name));

        return (await locator
            .waitFor({state: 'visible'})
            .then(() => locator
                .textContent()))?.replace(/[^\d.]/g, '') || '';
    }

    async clickSummaryContinue() {
        await this.page.locator(StoreConfigurePage.summaryContinueButton()).isEnabled();
        await this.page.locator(StoreConfigurePage.summaryContinueButton()).click();
    }
}
