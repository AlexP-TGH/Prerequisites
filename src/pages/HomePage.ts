import {expect, Page} from '@playwright/test';

export class HomePage {
    private page: Page;

    private gotoHomePage = (): string => '//a[@class="navbar-brand mr-3"]';
    private accountDropdown = (): string => '//a[@class=" dropdown-toggle"]';
    private loginButton = (): string => '//a[@class="dropdown-item px-2 py-0"][normalize-space(text())="Login"]';
    private browseCPanelLicenseButton = (): string => '//h3[normalize-space(text())="cPanel Licenses"]/..//a[@class="btn btn-block btn-outline-primary"]';

    constructor(page: Page) {
        this.page = page;
    }

    async clickGotoHomePage() {
        await this.page.locator(this.gotoHomePage()).click();
    }

    private async clickShowAccountDropdown() {
        await this.page.locator(this.accountDropdown()).click();
    }

    async assertLoginButtonVisible() {
        await this.clickShowAccountDropdown();
        await expect(this.page.locator(this.loginButton())).toBeVisible();
    }

    async clickBrowseCPanelLicense() {
        await this.page.waitForSelector(this.browseCPanelLicenseButton());
        await this.page.locator(this.browseCPanelLicenseButton()).click();
    }
}
