'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/common/libs';
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/elements';

import { useTheme } from 'next-themes';

type DatePickerWithRangeProps = {
  className?: string;
  date?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onSelect?: (date: { from: Date; to: Date }) => void;
};

export function DatePickerWithRange({
  className,
  date,
  onSelect,
}: DatePickerWithRangeProps) {
  const { theme: mode } = useTheme();

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            color={mode === 'dark' ? 'secondary' : 'default'}
            className={cn(' font-normal', {
              ' bg-white text-default-600': mode !== 'dark',
            })}
          >
            <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            // @ts-ignore
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
