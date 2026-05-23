export const userSchema = {
  type: 'object',
  required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    avatar: { type: 'string', format: 'uri' },
  },
  additionalProperties: false,
};

export const userListSchema = {
  type: 'object',
  required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
  properties: {
    page: { type: 'number' },
    per_page: { type: 'number' },
    total: { type: 'number' },
    total_pages: { type: 'number' },
    data: { type: 'array', items: userSchema },
    support: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        text: { type: 'string' },
      },
    },
  },
};

export const createUserResponseSchema = {
  type: 'object',
  required: ['name', 'job', 'id', 'createdAt'],
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    id: { type: 'string' },
    createdAt: { type: 'string' },
  },
};

export const loginResponseSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};
