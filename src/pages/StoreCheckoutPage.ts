import {Locator, Page} from '@playwright/test';
import dataProducts from '../data/products';
import dataAddons from '../data/addons';

export class StoreCheckoutPage {
    private page: Page;
    private readonly products: { [key: string]: { [key: string]: Locator } };

    private static completeOrderButton = (): string => '//button[@id="btnCompleteOrder"]';

    private static siblingLocator = (baseLocator: string, index: number): string => `${baseLocator}/following-sibling::td[${index}]`;
    private static duePrice = (baseLocator: string): string => `${baseLocator}/../td[div/small[contains(text(), "Prorata charge to")]]`;
    private static productName = (productName: string): string => `//tr[@class]/td[contains(text(), "${productName}")]`;

    private static readonly productNames: string[] = [
        ...Object.values(dataProducts),
        ...Object.values(dataAddons)
    ];

    private static personalInfoFirstNameInput = (): string => '//input[@id="inputFirstName"]';
    private static personalInfoLastNameInput = (): string => '//input[@id="inputLastName"]';
    private static personalInfoEmailInput = (): string => '//input[@id="inputEmail"]';
    private static personalInfoPhoneInput = (): string => '//input[@id="inputPhone"]';

    private static billingAddressCompanyNameInput = (): string => '//input[@id="inputCompanyName"]';
    private static billingAddressAddress1Input = (): string => '//input[@id="inputAddress1"]';
    private static billingAddressAddress2Input = (): string => '//input[@id="inputAddress2"]';
    private static billingAddressCityInput = (): string => '//input[@id="inputCity"]';
    private static billingAddressStateSelect = (): string => '//select[@id="stateselect"]';
    private static billingAddressPostcodeInput = (): string => '//input[@id="inputPostcode"]';
    private static billingAddressCountrySelect = (): string => '//select[@id="inputCountry"]';
    private static billingAddressTaxIdInput = (): string => '//input[@id="inputTaxId"]';

    private static accountSecurityPasswordInput = (): string => '//input[@id="inputNewPassword1"]';
    private static accountSecurityConfirmPasswordInput = (): string => '//input[@id="inputNewPassword2"]';

    constructor(page: Page) {
        this.page = page;
    }

    private createProductLocators(productName: string): { [key: string]: Locator } {
        const baseLocator = StoreCheckoutPage.productName(productName);
        const siblingLocator = (index: number): string => StoreCheckoutPage.siblingLocator(baseLocator, index);

        return {
            name: this.page.locator(baseLocator),
            ipAddress: this.page.locator(siblingLocator(2)),
            monthlyPrice: this.page.locator(siblingLocator(3)),
            duePrice: this.page.locator(StoreCheckoutPage.duePrice(baseLocator))
        };
    }

    async getProductName(productName: string): Promise<string> {
        const locators = this.createProductLocators(productName);
        const name = await locators.name.textContent();

        return name ? name.trim() : '';
    }

    async getProductIPAddress(productName: string): Promise<string> {
        const locators = this.createProductLocators(productName);
        const ipAddress = await locators.ipAddress.textContent();

        return ipAddress ? ipAddress.trim() : '';
    }

    async getProductMonthlyPrice(productName: string): Promise<string> {
        const locators = this.createProductLocators(productName);
        const monthlyPrice = await locators.monthlyPrice.textContent();

        return monthlyPrice ? monthlyPrice.replace(/[^\d.]/g, '') : '';
    }

    async getProductDuePrice(productName: string): Promise<string> {
        const locators = this.createProductLocators(productName);
        const duePrice = await locators.duePrice.textContent();

        return duePrice ? duePrice.match(/[\d,]+\.\d{2}/)[0] : '';
    }

    async areElementsVisible(): Promise<boolean> {
        const personalInfoLocators = [
            StoreCheckoutPage.personalInfoFirstNameInput,
            StoreCheckoutPage.personalInfoLastNameInput,
            StoreCheckoutPage.personalInfoEmailInput,
            StoreCheckoutPage.personalInfoPhoneInput
        ];

        const billingAddressLocators = [
            StoreCheckoutPage.billingAddressCompanyNameInput,
            StoreCheckoutPage.billingAddressAddress1Input,
            StoreCheckoutPage.billingAddressAddress2Input,
            StoreCheckoutPage.billingAddressCityInput,
            StoreCheckoutPage.billingAddressStateSelect,
            StoreCheckoutPage.billingAddressPostcodeInput,
            StoreCheckoutPage.billingAddressCountrySelect,
            StoreCheckoutPage.billingAddressTaxIdInput
        ];

        const accountSecurityLocators = [
            StoreCheckoutPage.accountSecurityPasswordInput,
            StoreCheckoutPage.accountSecurityConfirmPasswordInput
        ];

        const allLocators = [
            ...personalInfoLocators,
            ...billingAddressLocators,
            ...accountSecurityLocators,
            StoreCheckoutPage.completeOrderButton
        ];

        const allElementsVisible = await Promise.all(allLocators.map(async locator => {
            return this.page.locator(locator()).isVisible();
        }));

        return allElementsVisible.every(isVisible => isVisible);
    }

    async isCompleteOrderButtonDisabled(): Promise<boolean> {
        return await this.page.locator(StoreCheckoutPage.completeOrderButton()).isDisabled();
    }
}
