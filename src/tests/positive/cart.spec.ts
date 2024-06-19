import {expect, test} from "../../fixture/base.fixture"
import products from "../../data/products";
import addons from "../../data/addons";

test.describe('Positive Scenario: Add products to the cart', () => {

    test('Check product\'s prices', async ({
                                               homePage,
                                               storeCPanelLicensePage,
                                               storeConfigurePage,
                                               storeReviewPage,
                                               storeCheckoutPage
                                           }) => {
        let product = products.CPANEL_ADMIN_CLOUD_FIVE;
        let addon = addons.LITTLE_SPEED_8_GB;
        let ipAddress = '2.2.2.2';


        await homePage.clickGotoHomePage();
        await homePage.assertLoginButtonVisible();

        await homePage.clickBrowseCPanelLicense();
        let productName = await storeCPanelLicensePage.getProductName(product);
        let productMonthlyPrice = await storeCPanelLicensePage.getProductPrice(product);
        await storeCPanelLicensePage.clickOrder(product);

        await storeConfigurePage.fillIPAddressInput(ipAddress);

        let addonMonthlyPrice = await storeConfigurePage.getAddonPrice(addon);
        await storeConfigurePage.clickAddonCheckbox(addon);

        const totalAmount = parseFloat(productMonthlyPrice) + parseFloat(addonMonthlyPrice);
        const roundedTotal = totalAmount.toFixed(2);

        expect(roundedTotal).not.toEqual(storeConfigurePage.getOrderPrice('Monthly'));
        await storeConfigurePage.clickSummaryContinue();

        await storeReviewPage.assertProductNameVisible(productName);
        await storeReviewPage.assertProductNameVisible(addon);

        await storeReviewPage.calculatePriceRemainingDays(productName);
        await storeReviewPage.calculatePriceRemainingDays(addon);

        let productDuePrice = await storeReviewPage.getProductDuePrice(product);
        expect(productDuePrice).toEqual(await storeReviewPage.getProductDuePrice(product));
        expect(roundedTotal).toEqual(await storeReviewPage.getProductMonthlyPrice(product));

        let addonDuePrice = await storeReviewPage.calculatePriceRemainingDays(addon);
        expect(addonDuePrice).toEqual(await storeReviewPage.calculatePriceRemainingDays(addon));
        expect(addonMonthlyPrice).toEqual(await storeReviewPage.getProductMonthlyPrice(addon));

        let orderSummarySubtitle = await storeReviewPage.getSummarySubtotal();
        expect(orderSummarySubtitle)
            .toEqual((parseFloat(productDuePrice) + parseFloat(addonDuePrice)).toFixed(2));

        await storeReviewPage.clickOrderCheckoutButton();

        expect(productName).toEqual(await storeCheckoutPage.getProductName(product));
        expect(ipAddress).toEqual(await storeCheckoutPage.getProductIPAddress(product));
        expect(roundedTotal).toEqual(await storeCheckoutPage.getProductMonthlyPrice(product));
        expect(productDuePrice).toEqual(await storeCheckoutPage.getProductDuePrice(product));

        expect(addon).toEqual(await storeCheckoutPage.getProductName(addon));
        expect(ipAddress).toEqual(await storeCheckoutPage.getProductIPAddress(addon));
        expect(addonMonthlyPrice).toEqual(await storeCheckoutPage.getProductMonthlyPrice(addon));
        expect(parseFloat(addonDuePrice)).toEqual(parseFloat(await storeCheckoutPage.getProductDuePrice(addon)));

        expect(await storeCheckoutPage.areElementsVisible()).toBe(true);
        expect(await storeCheckoutPage.isCompleteOrderButtonDisabled()).toBe(true);
    })
})
