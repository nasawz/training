import { generator } from 'graphfront';

const { getSchema } = generator(dbPool, apiKeyValidator);