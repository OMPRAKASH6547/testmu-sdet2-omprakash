import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.getByTestId('firstName');
    this.lastNameInput = this.getByTestId('lastName');
    this.postalCodeInput = this.getByTestId('postalCode');
    this.continueButton = this.getByTestId('continue');
    this.cancelButton = this.getByTestId('cancel');
    this.errorMessage = this.page.locator('[data-test="error"]');
  }

  async fillCheckoutForm(data: CheckoutFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.postalCodeInput.fill(data.postalCode);
  }

  async submit(): Promise<void> {
    await this.continueButton.click();
  }

  async getValidationError(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async hasValidationError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async isCheckoutFormVisible(): Promise<boolean> {
    return this.firstNameInput.isVisible();
  }
}
