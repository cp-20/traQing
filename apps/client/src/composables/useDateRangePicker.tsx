import { Button, type ButtonProps, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useEffect, useId, useState } from 'react';

export type DateRange = [Date, Date];

export const dateRangeToQuery = (range: DateRange) => ({
  after: range[0],
  before: range[1],
});

const formatDate = (date: Date) => {
  const thisYear = new Date().getFullYear();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  return `${year === thisYear ? '' : `${year}/`}${month}/${day}`;
};

export const msInDay = 24 * 60 * 60 * 1000;

export const adjustDate = (range: DateRange): DateRange => {
  const start = new Date(range[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999);
  return [start, end];
};

export const daysBeforeNow = (days: number) => new Date(Date.now() - msInDay * days);

export const dateRangeKinds = {
  custom: {
    label: 'カスタム',
    getRange: () => null,
  },
  'last-24-hours': {
    label: '過去24時間',
    getRange: () => [daysBeforeNow(1), new Date()],
  },
  yesterday: {
    label: '昨日',
    getRange: () => adjustDate([daysBeforeNow(1), daysBeforeNow(1)]),
  },
  'last-7-days': {
    label: '過去7日間',
    getRange: () => [daysBeforeNow(7), new Date()],
  },
  'last-week': {
    label: '先週',
    getRange: () => adjustDate([daysBeforeNow(new Date().getDay() + 7), daysBeforeNow(new Date().getDay() + 1)]),
  },
  'last-30-days': {
    label: '過去1か月',
    getRange: () => [daysBeforeNow(28), new Date()],
  },
  'last-month': {
    label: '先月',
    getRange: () =>
      adjustDate([
        daysBeforeNow(daysBeforeNow(new Date().getDate()).getDate() + new Date().getDate() - 1),
        daysBeforeNow(new Date().getDate()),
      ]),
  },
  'last-1-year': {
    label: '過去1年間',
    getRange: () => [daysBeforeNow(365), new Date()],
  },
} satisfies Record<string, { label: string; getRange: () => DateRange | null }>;

export type DateRangeType = keyof typeof dateRangeKinds;

const getFallbackRange = (): DateRange => dateRangeKinds['last-7-days'].getRange();

export const useDateRangePicker = (defaultType: DateRangeType, defaultRange?: DateRange) => {
  const id = useId();
  const [opened, setOpened] = useState(false);
  const [type, setType] = useState<DateRangeType>(defaultType);
  const [settingType, setSettingType] = useState<DateRangeType>(defaultType);
  const label = dateRangeKinds[type].label;
  const [value, setValue] = useState<DateRange>(defaultRange ?? dateRangeKinds[type].getRange() ?? getFallbackRange());
  const [settingValue, setSettingValue] = useState<[Date | null, Date | null]>(
    defaultRange ?? dateRangeKinds[settingType].getRange() ?? [null, null],
  );

  const actions = {
    setType,
    setValue,
  };

  useEffect(() => {
    const range = dateRangeKinds[type].getRange();
    if (range !== null) {
      setValue(range);
      setSettingValue(range);
    }
  }, [type]);

  const render = (props?: { buttonProps: ButtonProps }) => (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
      onClose={() => {
        setSettingType(type);
        setSettingValue(value);
      }}
    >
      <Popover.Target>
        <Button variant="default" onClick={() => setOpened((o) => !o)} {...props?.buttonProps}>
          <span className="inline-flex gap-2 items-center text-text-primary">
            <span className="text-xs font-bold">{label}</span>
            <span>
              {formatDate(value[0])}～{formatDate(value[1])}
            </span>
          </span>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex flex-col w-32">
              {Object.entries(dateRangeKinds).map(([key, { label, getRange }]) => (
                <div key={key}>
                  <input
                    className="peer"
                    type="radio"
                    id={`date-range-picker${id}${key}`}
                    name={`date-range-picker${id}`}
                    hidden
                    checked={settingType === key}
                    onChange={() => {
                      setSettingType(key as DateRangeType);
                      const range = getRange();
                      if (range) setSettingValue(range);
                    }}
                  />
                  <label
                    htmlFor={`date-range-picker${id}${key}`}
                    className="peer-checked:font-bold peer-checked:text-blue-500 peer-checked:bg-blue-100 px-2 py-1 rounded-sm w-full block"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
            <DatePicker
              value={settingValue}
              onChange={(v) => {
                // YYYY-MM-DD format
                // FIXME: https://github.com/mantinedev/mantine/issues/7937
                const realValue = v as [string | null, string | null];

                setSettingType('custom');
                setSettingValue([
                  realValue[0] ? new Date(`${realValue[0]}:00:00:00`) : null,
                  realValue[1] ? new Date(`${realValue[1]}:00:00:00`) : null,
                ] as DateRange);
              }}
              type="range"
              allowSingleDateInRange
              firstDayOfWeek={0}
              maxDate={new Date()}
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="subtle"
              onClick={() => {
                setOpened(false);
                setSettingType(type);
                setSettingValue(value);
              }}
            >
              キャンセル
            </Button>
            <Button
              variant="subtle"
              disabled={!settingValue[0]}
              onClick={() => {
                if (!settingValue[0]) return;
                setOpened(false);
                setType(settingType);
                if (settingValue[1] === null) {
                  setValue(adjustDate([settingValue[0], settingValue[0]]));
                  return;
                }
                if (settingType === 'custom') {
                  setValue(adjustDate(settingValue as DateRange));
                  return;
                }
                setValue(settingValue as DateRange);
              }}
            >
              変更
            </Button>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );

  return { value, type, actions, render };
};
