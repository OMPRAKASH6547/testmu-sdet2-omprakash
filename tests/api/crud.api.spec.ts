import { test, expect } from '@playwright/test';
import { userService } from '../../src/api/services/userService';
import { assertStatusCode, assertResponseTime } from '../../src/utils/assertions';
import { assertValidSchema } from '../../src/api/utils/schemaValidator';
import {
  userListSchema,
  userSchema,
  createUserResponseSchema,
} from '../../src/api/schemas/user.schema';
import apiPayloads from '../../src/test-data/apiPayloads.json';
import { retry } from '../../src/utils/retry';

test.describe('User CRUD API @api', () => {
  test('should list users with pagination', async () => {
    const response = await userService.listUsers(apiPayloads.listPagination.page);
    assertStatusCode(response, 200);
    assertResponseTime(response);
    assertValidSchema(userListSchema, response.data);
    expect(response.data.data.length).toBe(apiPayloads.listPagination.perPage);
  });

  test('should get user by id', async () => {
    const response = await retry(() => userService.getUser(2));
    assertStatusCode(response, 200);
    assertValidSchema(userSchema, response.data.data);
    expect(response.data.data.id).toBe(2);
  });

  test('should create a new user', async () => {
    const response = await userService.createUser(apiPayloads.createUser);
    assertStatusCode(response, 201);
    assertResponseTime(response);
    assertValidSchema(createUserResponseSchema, response.data);
    expect(response.data.name).toBe(apiPayloads.createUser.name);
    expect(response.data.job).toBe(apiPayloads.createUser.job);
  });

  test('should update user via PUT', async () => {
    const response = await userService.updateUser(2, apiPayloads.updateUser);
    assertStatusCode(response, 200);
    expect(response.data.name).toBe(apiPayloads.updateUser.name);
  });

  test('should partially update user via PATCH', async () => {
    const response = await userService.patchUser(2, { job: 'Lead SDET' });
    assertStatusCode(response, 200);
    expect(response.data.job).toBe('Lead SDET');
  });

  test('should delete user', async () => {
    const response = await userService.deleteUser(2);
    assertStatusCode(response, 204);
  });
});
