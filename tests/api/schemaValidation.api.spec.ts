import { test, expect } from '@playwright/test';
import { userService } from '../../src/api/services/userService';
import { validateSchema } from '../../src/api/utils/schemaValidator';
import { userListSchema, userSchema, createUserResponseSchema } from '../../src/api/schemas/user.schema';
import apiPayloads from '../../src/test-data/apiPayloads.json';
import { faker } from '@faker-js/faker';

test.describe('API Schema Validation @api', () => {
  test('should validate user list response schema', async () => {
    const response = await userService.listUsers(1);
    const result = validateSchema(userListSchema, response.data);
    expect(result.valid).toBe(true);
    if (!result.valid) {
      throw new Error(JSON.stringify(result.errors));
    }
  });

  test('should validate single user response schema', async () => {
    const response = await userService.getUser(1);
    const result = validateSchema(userSchema, response.data.data);
    expect(result.valid).toBe(true);
  });

  test('should validate create user response with dynamic faker data', async () => {
    const payload = {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
    };
    const response = await userService.createUser(payload);
    const result = validateSchema(createUserResponseSchema, response.data);
    expect(result.valid).toBe(true);
    expect(response.data.name).toBe(payload.name);
  });

  test('should reject invalid schema shape', async () => {
    const invalidData = { id: 'not-a-number', email: 'bad' };
    const result = validateSchema(userSchema, invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  test('should validate paginated list metadata', async () => {
    const response = await userService.listUsers(apiPayloads.listPagination.page);
    expect(response.data.page).toBe(apiPayloads.listPagination.page);
    expect(response.data.per_page).toBe(apiPayloads.listPagination.perPage);
    expect(response.data.total_pages).toBeGreaterThan(0);
  });
});
