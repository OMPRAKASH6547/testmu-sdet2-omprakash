import { test, expect } from '@playwright/test';
import { userService } from '../../src/api/services/userService';
import { authService } from '../../src/api/services/authService';
import { assertStatusCode } from '../../src/utils/assertions';
import apiPayloads from '../../src/test-data/apiPayloads.json';

test.describe('API Error Handling @api', () => {
  test('should return 404 for non-existent user', async () => {
    const response = await userService.getUserNotFound(apiPayloads.notFoundUserId);
    assertStatusCode(response, 404);
  });

  test('should return 400 for invalid registration payload', async () => {
    const response = await authService.register(
      apiPayloads.register.invalid as { email: string; password: string }
    );
    assertStatusCode(response, 400);
    expect((response.data as { error?: string }).error).toBeDefined();
  });

  test('should return 400 for login without password', async () => {
    const response = await authService.login({ email: 'test@reqres.in' });
    assertStatusCode(response, 400);
    expect((response.data as unknown as { error: string }).error).toContain('password');
  });

  test('should handle delayed response endpoint within timeout', async () => {
    const { httpClient } = await import('../../src/api/clients/httpClient');
    const response = await httpClient.get('/users?delay=2');
    assertStatusCode(response, 200);
    expect(response.status).toBe(200);
  });
});
