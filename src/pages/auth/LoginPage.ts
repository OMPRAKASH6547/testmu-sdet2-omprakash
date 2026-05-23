import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loginContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.getByTestId('username');
    this.passwordInput = this.getByTestId('password');
    this.loginButton = this.getByTestId('login-button');
    this.errorMessage = this.page.locator('[data-test="error"]');
    this.loginContainer = this.getByTestId('login-container');
  }

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return this.loginContainer.isVisible();
  }

  getLoginButton(): Locator {
    return this.loginButton;
  }
}
