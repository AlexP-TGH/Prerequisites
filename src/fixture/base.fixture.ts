import {test as base} from "@playwright/test";
import {HomePage} from "../pages/HomePage";
import {StoreCPanelLicenses} from "../pages/StoreCPanelLicenses";
import {StoreConfigurePage} from "../pages/StoreConfigurePage";
import {StoreReviewPage} from "../pages/StoreReviewPage";
import {StoreCheckoutPage} from "../pages/StoreCheckoutPage";

type pages = {
    homePage: HomePage;
    storeCPanelLicensePage: StoreCPanelLicenses;
    storeConfigurePage: StoreConfigurePage;
    storeReviewPage: StoreReviewPage;
    storeCheckoutPage: StoreCheckoutPage;
}

const testPages = base.extend<pages>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },
    storeCPanelLicensePage: async ({page}, use) => {
        await use(new StoreCPanelLicenses(page));
    },
    storeConfigurePage: async ({page}, use) => {
        await use(new StoreConfigurePage(page));
    },
    storeReviewPage: async ({page}, use) => {
        await use(new StoreReviewPage(page));
    },
    storeCheckoutPage: async ({page}, use) => {
        await use(new StoreCheckoutPage(page));
    }
})

base.beforeEach(async ({page}) => {
    await page.goto('store/cpanel-licenses/');
});

export const test = testPages;
export const expect = testPages.expect;
