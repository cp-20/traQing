import type { AppType } from '@traq-ing/server';
import { hc } from 'hono/client';

export const client = hc<AppType>('/api');
