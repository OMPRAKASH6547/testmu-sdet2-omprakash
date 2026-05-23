import { test, expect } from '@playwright/test';
import { authService } from '../../src/api/services/authService';
import { assertStatusCode, assertResponseTime } from '../../src/utils/assertions';
import { assertValidSchema } from '../../src/api/utils/schemaValidator';
import { loginResponseSchema, errorResponseSchema } from '../../src/api/schemas/user.schema';
import users from '../../src/test-data/users.json';
import apiPayloads from '../../src/test-data/apiPayloads.json';

test.describe('Authentication API @api', () => {
  test('should authenticate with valid credentials', async () => {
    const response = await authService.login(apiPayloads.login.valid);
    assertStatusCode(response, 200);
    assertResponseTime(response);
    assertValidSchema(loginResponseSchema, response.data);
    expect(response.data.token).toBeTruthy();
  });

  test('should fail login with missing password', async () => {
    const response = await authService.login(apiPayloads.login.missingPassword);
    assertStatusCode(response, 400);
    assertValidSchema(errorResponseSchema, response.data);
    expect((response.data as unknown as { error: string }).error).toBe('Missing password');
  });

  test('should fail login with invalid credentials', async () => {
    const response = await authService.login(users.apiLogin.invalid);
    assertStatusCode(response, 400);
    expect((response.data as unknown as { error: string }).error).toBe('Invalid credentials');
  });

  test('should register a new user successfully', async () => {
    const response = await authService.register(apiPayloads.register.valid);
    assertStatusCode(response, 200);
    assertResponseTime(response);
    expect(response.data.id).toBeDefined();
    expect(response.data.token).toBeTruthy();
  });
});
