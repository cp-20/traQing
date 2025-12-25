import { sql } from 'drizzle-orm';

export const sqlGetYear = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'YYYY')`;
export const sqlGetMonth = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'YYYY-MM')`;
export const sqlGetDate = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'YYYY-MM-DD')`;
export const sqlGetHour = <T>(date: T) => sql<string>`TO_CHAR(${date}, 'HH24')`;

export const isYearQuery = (query: { after?: Date; before?: Date }) => {
  if (!query.after || !query.before) return false;

  const afterStr = query.after.toISOString();
  const beforeStr = query.before.toISOString();

  return (
    afterStr.slice(5) === '01-01T00:00:00.000Z' &&
    beforeStr.slice(5) === '12-31T23:59:59.999Z' &&
    beforeStr.slice(0, 4) === afterStr.slice(0, 4)
  );
};
