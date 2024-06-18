import {expect, Page} from '@playwright/test';

export class HomePage {
    private page: Page;

    private static gotoHomePage = (): string => '//a[@class="navbar-brand mr-3"]';
    private static accountDropdown = (): string => '//a[@class=" dropdown-toggle"]';
    private static loginButton = (): string => '//a[@class="dropdown-item px-2 py-0"][normalize-space(text())="Login"]';
    private static browseCPanelLicenseButton = (): string => '//h3[normalize-space(text())="cPanel Licenses"]/..//a[@class="btn btn-block btn-outline-primary"]';

    constructor(page: Page) {
        this.page = page;
    }

    async clockGotoHomePage() {
        await this.page.locator(HomePage.gotoHomePage()).click();
    }

    private async clickShowAccountDropdown() {
        await this.page.locator(HomePage.accountDropdown()).click();
    }

    async assertLoginButtonVisible() {
        await this.clickShowAccountDropdown();
        await expect(this.page.locator(HomePage.loginButton())).toBeVisible();
    }

    async clickBrowseCPanelLicense() {
        await this.page.waitForSelector(HomePage.browseCPanelLicenseButton());
        await this.page.locator(HomePage.browseCPanelLicenseButton()).click();
    }
}
