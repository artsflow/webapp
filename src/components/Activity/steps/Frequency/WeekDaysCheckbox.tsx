import React, { useState, useEffect } from 'react'
import { HStack, useCheckboxGroup, CheckboxGroup } from '@chakra-ui/react'

import { CheckboxCard } from 'components'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface WDCProps {
  value?: string[]
  onChange: (d: string[]) => any
}

export const WeekDaysCheckbox = (props: WDCProps) => {
  const { value = [], onChange } = props
  const [allIsChecked, setAllCheched] = useState(false)

  const { setValue, getCheckboxProps } = useCheckboxGroup({
    defaultValue: value,
    onChange,
  })

  const toggleDays = () => {
    if (!allIsChecked) {
      setValue(WEEKDAYS)
      setAllCheched(true)
    } else {
      setValue([])
      setAllCheched(false)
    }
  }

  useEffect(() => {
    if (value.length === 7) {
      setAllCheched(true)
    } else if (value.length !== 0) {
      setAllCheched(false)
    }
  }, [value])

  return (
    <HStack my="1rem" spacing="1rem">
      <CheckboxCard isChecked={allIsChecked} onChange={toggleDays}>
        All
      </CheckboxCard>
      <CheckboxGroup isNative>
        {WEEKDAYS.map((day) => {
          const checkbox = getCheckboxProps({ value: day })
          return (
            <CheckboxCard {...checkbox} key={day}>
              {day}
            </CheckboxCard>
          )
        })}
      </CheckboxGroup>
    </HStack>
  )
}
