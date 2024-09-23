import { sql } from 'drizzle-orm';

export const sqlGetMonth = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'YYYY-MM')`;
export const sqlGetDate = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'YYYY-MM-DD')`;
export const sqlGetHour = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'HH24')`;
