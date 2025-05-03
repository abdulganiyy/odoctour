import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  date: Date | string | undefined;
  setDate: (date: Date | undefined | string) => void;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
  disabled: boolean | undefined;
}

// Format date for display as MM-dd-yyyy... this is not coming in in the regular ISO format.
const formatDateForDisplay = (date: Date): string => format(date, 'MM-dd-yyyy');

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  className,
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // default to one year from current date
  minDate,
  placeholder = 'Pick a date',
  disabled,
}) => {
  // Ensure `date` is parsed correctly as a Date object even if it’s a string
  const parsedDate = date ? (typeof date === 'string' ? parseISO(date) : date) : undefined;
  const displayDate = parsedDate ? formatDateForDisplay(parsedDate) : undefined;

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant='outline'
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {displayDate || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={parsedDate}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate.toISOString());
            }
          }}
          toDate={maxDate}
          fromDate={minDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
