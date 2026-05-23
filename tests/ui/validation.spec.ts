import { test, expect } from '../../src/fixtures/testFixtures';
import forms from '../../src/test-data/forms.json';

test.describe('Form Validation @ui', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const { inventoryPage } = authenticatedPage;
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
  });

  test('should complete checkout with valid form data', async ({
    cartPage,
    checkoutPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await cartPage.proceedToCheckout();
    expect(await checkoutPage.isCheckoutFormVisible()).toBe(true);
    await checkoutPage.fillCheckoutForm(forms.checkout.valid);
    await checkoutPage.submit();
    expect(await checkoutOverviewPage.isDisplayed()).toBe(true);
    await checkoutOverviewPage.finishCheckout();
    expect(await checkoutCompletePage.isDisplayed()).toBe(true);
    expect(await checkoutCompletePage.getHeaderText()).toBe('Thank you for your order!');
  });

  forms.checkout.invalid.forEach((invalidForm, index) => {
    test(`should show validation error for invalid checkout form #${index + 1}`, async ({
      cartPage,
      checkoutPage,
    }) => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCheckoutForm(invalidForm);
      await checkoutPage.submit();
      expect(await checkoutPage.hasValidationError()).toBe(true);
      const errorText = await checkoutPage.getValidationError();
      expect(errorText).toContain(invalidForm.expectedError);
    });
  });
});
