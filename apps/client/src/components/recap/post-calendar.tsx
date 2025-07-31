import { Skeleton, Tooltip } from '@mantine/core';
import type { MessagesQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, useCallback, useMemo } from 'react';
import { type CommonRecapComponentProps, yearToQuery } from '@/components/recap/common';
import { msInDay } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';

const formatDate = (date: Date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export const PostCalendar: FC<CommonRecapComponentProps> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        userId,
        target: 'count',
        groupBy: 'day',
        orderBy: 'date',
        order: 'asc',
      }) satisfies MessagesQuery,
    [year, userId],
  );
  const { messages, loading } = useMessages(query);

  const initialDate = new Date(`${year}-01-01T00:00:00+09:00`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00+09:00`);
  const offset = initialDate.getDay();
  const dateToWeek = useCallback(
    (date: Date) => Math.floor(((date.getTime() - initialDate.getTime()) / msInDay + offset) / 7),
    [initialDate, offset],
  );
  const messagesMap = useMemo(() => {
    const arr = [...new Array(7)].map((_, day) =>
      [...new Array(53)].map((_, week) => ({
        date: new Date(initialDate.getTime() + (week * 7 + day - initialDate.getDay()) * msInDay),
        count: 0,
      })),
    );
    for (const m of messages) {
      const date = new Date(`${m.day}T00:00:00+09:00`);
      const week = dateToWeek(date);
      arr[date.getDay()][week] = { date, count: m.count };
    }
    return arr;
  }, [messages, initialDate, dateToWeek]);

  const months = [...new Array(12)].map((_, i) => {
    const date = new Date(`${year}-${(i + 1).toString().padStart(2, '0')}-01T00:00:00+09:00`);
    const nextDate = new Date(`${year}-${(i + 1).toString().padStart(2, '0')}-01T00:00:00+09:00`);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const diff = dateToWeek(nextDate) - dateToWeek(date);
    return { date, diff };
  });

  if (loading) {
    return <Skeleton height="calc(100cqw / 53 * 7 + 1rem)" />;
  }

  return (
    <div className="@container w-full overflow-x-auto">
      <table>
        <thead>
          <tr>
            {months.map(({ date, diff }) => (
              <th key={date.toString()} colSpan={diff} className="text-left">
                {date.getMonth() + 1}月
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messagesMap.map((week, i) => (
            <tr key={i}>
              {week.map(({ count, date }, j) =>
                initialDate <= date && date < endDate ? (
                  <td key={j}>
                    <Tooltip withArrow label={`${formatDate(date)} (${count}投稿)`}>
                      <span
                        className={clsx(
                          'block p-px size-[max(12px,calc(100cqw/53-2px))] border border-gray-300 rounded',
                          count === 0 && 'bg-gray-50',
                          0 < count && count <= 3 && 'bg-blue-100',
                          3 < count && count <= 5 && 'bg-sky-100',
                          5 < count && count <= 10 && 'bg-cyan-100',
                          10 < count && count <= 20 && 'bg-teal-100',
                          20 < count && count <= 30 && 'bg-emerald-100',
                          30 < count && count <= 50 && 'bg-green-200',
                          50 < count && count <= 100 && 'bg-lime-200',
                          100 < count && count <= 200 && 'bg-yellow-300',
                          200 < count && count <= 300 && 'bg-amber-300',
                          300 < count && count <= 500 && 'bg-orange-300',
                          500 < count && 'bg-red-300',
                        )}
                      />
                    </Tooltip>
                  </td>
                ) : (
                  <td key={j} className="size-[max(12px,calc(100cqw/53-2px))]" />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
