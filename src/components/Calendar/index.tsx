import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import * as ukLocale from 'date-fns/locale/uk/index.js'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Toolbar } from './Toolbar'

const locales = {
  'en-GB': ukLocale,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export function Calendar(props: any) {
  return (
    <BigCalendar
      localizer={localizer}
      defaultView="work_week"
      startAccessor="start"
      views={['day', 'work_week', 'month', 'agenda']}
      endAccessor="end"
      style={{ height: '700px' }}
      components={{
        toolbar: Toolbar,
      }}
      {...props}
    />
  )
}
