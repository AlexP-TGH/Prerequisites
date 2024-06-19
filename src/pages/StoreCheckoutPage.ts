import {Locator, Page} from '@playwright/test';

export class StoreCheckoutPage {
    private page: Page;
    private completeOrderButton = (): string => '//button[@id="btnCompleteOrder"]';

    private siblingLocator = (baseLocator: string, index: number): string => `${baseLocator}/following-sibling::td[${index}]`;
    private duePrice = (baseLocator: string): string => `${baseLocator}/../td[div/small[contains(text(), "Prorata charge to")]]`;
    private productName = (productName: string): string => `//tr[@class]/td[contains(text(), "${productName}")]`;

    private personalInfoFirstNameInput = (): string => '//input[@id="inputFirstName"]';
    private personalInfoLastNameInput = (): string => '//input[@id="inputLastName"]';
    private personalInfoEmailInput = (): string => '//input[@id="inputEmail"]';
    private personalInfoPhoneInput = (): string => '//input[@id="inputPhone"]';

    private billingAddressCompanyNameInput = (): string => '//input[@id="inputCompanyName"]';
    private billingAddressAddress1Input = (): string => '//input[@id="inputAddress1"]';
    private billingAddressAddress2Input = (): string => '//input[@id="inputAddress2"]';
    private billingAddressCityInput = (): string => '//input[@id="inputCity"]';
    private billingAddressStateSelect = (): string => '//select[@id="stateselect"]';
    private billingAddressPostcodeInput = (): string => '//input[@id="inputPostcode"]';
    private billingAddressCountrySelect = (): string => '//select[@id="inputCountry"]';
    private billingAddressTaxIdInput = (): string => '//input[@id="inputTaxId"]';

    private accountSecurityPasswordInput = (): string => '//input[@id="inputNewPassword1"]';
    private accountSecurityConfirmPasswordInput = (): string => '//input[@id="inputNewPassword2"]';

    constructor(page: Page) {
        this.page = page;
    }

    private createProductLocators(productName: string): {
        name: Locator;
        ipAddress: Locator;
        monthlyPrice: Locator;
        duePrice: Locator
    } {
        const baseLocator = this.productName(productName);
        const siblingLocator = (index: number): string => this.siblingLocator(baseLocator, index);

        return {
            name: this.page.locator(baseLocator),
            ipAddress: this.page.locator(siblingLocator(2)),
            monthlyPrice: this.page.locator(siblingLocator(3)),
            duePrice: this.page.locator(this.duePrice(baseLocator))
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
            this.personalInfoFirstNameInput,
            this.personalInfoLastNameInput,
            this.personalInfoEmailInput,
            this.personalInfoPhoneInput
        ];

        const billingAddressLocators = [
            this.billingAddressCompanyNameInput,
            this.billingAddressAddress1Input,
            this.billingAddressAddress2Input,
            this.billingAddressCityInput,
            this.billingAddressStateSelect,
            this.billingAddressPostcodeInput,
            this.billingAddressCountrySelect,
            this.billingAddressTaxIdInput
        ];

        const accountSecurityLocators = [
            this.accountSecurityPasswordInput,
            this.accountSecurityConfirmPasswordInput
        ];

        const allLocators = [
            ...personalInfoLocators,
            ...billingAddressLocators,
            ...accountSecurityLocators,
            this.completeOrderButton
        ];

        const allElementsVisible = await Promise.all(allLocators.map(async locator => {
            return this.page.locator(locator()).isVisible();
        }));

        return allElementsVisible.every(isVisible => isVisible);
    }

    async isCompleteOrderButtonDisabled(): Promise<boolean> {
        return await this.page.locator(this.completeOrderButton()).isDisabled();
    }
}
