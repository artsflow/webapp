import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { getDay, format, parse, startOfWeek, startOfToday, addHours } from 'date-fns'
import * as ukLocale from 'date-fns/locale/uk/index.js'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { trackClickCalendarActivity } from 'analytics'
import { Toolbar } from './Toolbar'

const locales = {
  'en-GB': ukLocale,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const formats = {
  dateFormat: 'dd',
  dayFormat: (date: Date) => format(date, 'dd MMMM'),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'dd')} - ${format(end, 'dd MMMM')}`,
  agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'dd')} - ${format(end, 'dd MMMM')}`,
  agendaDateFormat: (date: Date) => format(date, 'EE, dd MMMM'),
  agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
  timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
}

export function Calendar(props: any) {
  return (
    <BigCalendar
      localizer={localizer}
      onSelectEvent={(activity) => trackClickCalendarActivity(activity)}
      defaultView="week"
      startAccessor="start"
      views={['week', 'month', 'agenda']}
      formats={formats}
      endAccessor="end"
      style={{ height: '700px' }}
      eventPropGetter={eventPropGetter}
      min={addHours(startOfToday(), 8)}
      max={addHours(startOfToday(), 21)}
      components={{
        toolbar: Toolbar,
      }}
      {...props}
    />
  )
}

const eventPropGetter = () => {
  const style = {
    backgroundColor: '#e0f4f7',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'black',
    border: '1px solid #F3F3F3',
  }
  return {
    style,
  }
}
