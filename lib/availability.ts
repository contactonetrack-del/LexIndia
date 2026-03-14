export const INDIA_TIME_ZONE = 'Asia/Kolkata';

export const AVAILABILITY_WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export const AVAILABILITY_TIME_OPTIONS = [
  '09:00',
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
] as const;

export type AvailabilitySlotValue = {
  weekday: number;
  time: string;
};

export type AvailabilityExceptionValue = {
  dateKey: string;
};

export const AVAILABILITY_SLOT_OVERRIDE_ACTIONS = ['BLOCK_SLOT', 'OPEN_SLOT'] as const;

export type AvailabilitySlotOverrideAction =
  (typeof AVAILABILITY_SLOT_OVERRIDE_ACTIONS)[number];

export type AvailabilitySlotOverrideValue = {
  dateKey: string;
  time: string;
  action: AvailabilitySlotOverrideAction;
};

const INDIA_TIME_KEY_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: INDIA_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const INDIA_DATE_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: INDIA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function isAvailabilityWeekday(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6;
}

export function isAvailabilityTime(value: unknown): value is (typeof AVAILABILITY_TIME_OPTIONS)[number] {
  return (
    typeof value === 'string' &&
    AVAILABILITY_TIME_OPTIONS.includes(value as (typeof AVAILABILITY_TIME_OPTIONS)[number])
  );
}

export function isAvailabilityDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isAvailabilitySlotOverrideAction(
  value: unknown
): value is AvailabilitySlotOverrideAction {
  return (
    typeof value === 'string' &&
    AVAILABILITY_SLOT_OVERRIDE_ACTIONS.includes(
      value as AvailabilitySlotOverrideAction
    )
  );
}

export function serializeAvailabilitySlot(slot: AvailabilitySlotValue): string {
  return `${slot.weekday}:${slot.time}`;
}

export function parseAvailabilitySlotKey(key: string): AvailabilitySlotValue | null {
  const match = key.match(/^([0-6]):(\d{2}:\d{2})$/);
  if (!match) {
    return null;
  }

  const weekday = Number.parseInt(match[1], 10);
  const time = match[2];
  if (!isAvailabilityWeekday(weekday) || !isAvailabilityTime(time)) {
    return null;
  }

  return { weekday, time };
}

export function sortAvailabilitySlots<T extends AvailabilitySlotValue>(slots: T[]): T[] {
  return [...slots].sort((left, right) => {
    if (left.weekday !== right.weekday) {
      return left.weekday - right.weekday;
    }

    return left.time.localeCompare(right.time);
  });
}

export function sortAvailabilityExceptions<T extends AvailabilityExceptionValue>(exceptions: T[]): T[] {
  return [...exceptions].sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

export function sortAvailabilitySlotOverrides<T extends AvailabilitySlotOverrideValue>(
  overrides: T[]
): T[] {
  return [...overrides].sort((left, right) => {
    if (left.dateKey !== right.dateKey) {
      return left.dateKey.localeCompare(right.dateKey);
    }

    if (left.time !== right.time) {
      return left.time.localeCompare(right.time);
    }

    return left.action.localeCompare(right.action);
  });
}

export function getIndiaWeekday(dateKey: string): number {
  return new Date(`${dateKey}T12:00:00+05:30`).getUTCDay();
}

export function getIndiaDateRange(dateKey: string): { start: Date; end: Date } {
  return {
    start: new Date(`${dateKey}T00:00:00+05:30`),
    end: new Date(`${dateKey}T23:59:59.999+05:30`),
  };
}

export function getIndiaDateKey(date: Date): string {
  return INDIA_DATE_KEY_FORMATTER.format(date);
}

export function getIndiaTimeKey(date: Date): string {
  return INDIA_TIME_KEY_FORMATTER.format(date);
}
