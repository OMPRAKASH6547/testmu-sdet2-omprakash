import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';

const SUPPORT = {
  url: 'https://reqres.in/#support-heading',
  text: 'Contact ReqRes for support',
};

const SAMPLE_USERS = [
  {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  },
  {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
  {
    id: 3,
    email: 'emma.wong@reqres.in',
    first_name: 'Emma',
    last_name: 'Wong',
    avatar: 'https://reqres.in/img/faces/3-image.jpg',
  },
  {
    id: 4,
    email: 'eve.holt@reqres.in',
    first_name: 'Eve',
    last_name: 'Holt',
    avatar: 'https://reqres.in/img/faces/4-image.jpg',
  },
  {
    id: 5,
    email: 'charles.morris@reqres.in',
    first_name: 'Charles',
    last_name: 'Morris',
    avatar: 'https://reqres.in/img/faces/5-image.jpg',
  },
  {
    id: 6,
    email: 'tracey.ramos@reqres.in',
    first_name: 'Tracey',
    last_name: 'Ramos',
    avatar: 'https://reqres.in/img/faces/6-image.jpg',
  },
];

export function shouldUseApiMock(): boolean {
  if (process.env.USE_API_MOCK === 'false') return false;
  if (process.env.USE_API_MOCK === 'true') return true;
  const key = process.env.API_KEY?.trim();
  return !key || key === 'reqres-free-v1';
}

export function setupReqresMocks(client: AxiosInstance): MockAdapter {
  const mock = new MockAdapter(client, { delayResponse: 50 });

  mock.onPost('/login').reply((config) => {
    const body = JSON.parse(config.data || '{}');
    if (!body.password) {
      return [400, { error: 'Missing password' }];
    }
    if (body.email === 'eve.holt@reqres.in' && body.password === 'cityslicka') {
      return [200, { token: 'mock-jwt-token-reqres-login' }];
    }
    return [400, { error: 'Invalid credentials' }];
  });

  mock.onPost('/register').reply((config) => {
    const body = JSON.parse(config.data || '{}');
    if (!body.email?.includes('@') || !body.password) {
      return [400, { error: 'Note: Only defined users succeed registration' }];
    }
    return [200, { id: 4, token: 'mock-jwt-token-register' }];
  });

  mock.onGet(/\/users\?delay=/).reply(200, {
    page: 1,
    per_page: 6,
    total: 12,
    total_pages: 2,
    data: SAMPLE_USERS,
    support: SUPPORT,
  });

  mock.onGet('/users', { params: { page: 2 } }).reply(200, {
    page: 2,
    per_page: 6,
    total: 12,
    total_pages: 2,
    data: SAMPLE_USERS,
    support: SUPPORT,
  });

  mock.onGet('/users', { params: { page: 1 } }).reply(200, {
    page: 1,
    per_page: 6,
    total: 12,
    total_pages: 2,
    data: SAMPLE_USERS,
    support: SUPPORT,
  });

  mock.onGet('/users').reply((config) => {
    const page = Number(config.params?.page ?? 1);
    return [
      200,
      {
        page,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: SAMPLE_USERS,
        support: SUPPORT,
      },
    ];
  });

  mock.onGet(/\/users\/9999/).reply(404, {});

  mock.onGet(/\/users\/\d+/).reply((config) => {
    const id = Number(config.url?.split('/').pop());
    const user = SAMPLE_USERS.find((u) => u.id === id) ?? SAMPLE_USERS[1];
    return [200, { data: user }];
  });

  mock.onPost('/users').reply((config) => {
    const body = JSON.parse(config.data || '{}');
    return [
      201,
      {
        name: body.name,
        job: body.job,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      },
    ];
  });

  mock.onPut(/\/users\/\d+/).reply((config) => {
    const body = JSON.parse(config.data || '{}');
    return [
      200,
      {
        name: body.name,
        job: body.job,
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  mock.onPatch(/\/users\/\d+/).reply((config) => {
    const body = JSON.parse(config.data || '{}');
    return [
      200,
      {
        name: body.name ?? 'Janet Weaver',
        job: body.job,
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  mock.onDelete(/\/users\/\d+/).reply(204);

  return mock;
}
