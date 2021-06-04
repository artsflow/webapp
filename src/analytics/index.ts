import { capitalize } from 'lodash'
import * as Sentry from '@sentry/nextjs'
import { UserProps, ProfileProps } from './types'

export const trackSidepanelToggle = (isCollapsed: boolean) => {
  if (isCollapsed) {
    window.analytics.track('Sidepanel Collapsed')
  } else {
    window.analytics.track('Sidepanel Expanded')
  }
}

export const trackUserSignUp = ({ provider }: { provider: string }) => {
  window.analytics.track('Creative Signed Up', { provider })
}

export const trackUserSignOut = () => {
  window.analytics.track('Creative Signed Out')
}

export const trackUserSignIn = (props: UserProps) => {
  const { userId, provider, displayName, email } = props
  window.analytics.identify(userId, { ...props, isCreative: true })
  window.analytics.track('Creative Signed In', { provider })
  Sentry.setUser({ email, displayName, userId })
}

export const trackUpdateProfile = (userId: string, props: ProfileProps) => {
  window.analytics.track('Profile Updated')
  window.analytics.identify(userId, props)
}

export const trackUpdateAvatar = () => {
  window.analytics.track('Avatar Updated')
}

export const trackStartVerification = () => {
  window.analytics.track('Verification Started')
}

export const trackAddActivityButton = (source: string) => {
  window.analytics.track('Add Activity Clicked', { source })
}

export const trackEditActivityButton = (activityId: string, source: string) => {
  window.analytics.track('Edit Activity Clicked', { activityId, source })
}

export const trackUpdateActivity = (activity: any) => {
  window.analytics.track('Activity Updated', { activity })
}

export const trackPauseActivity = (id: string) => {
  window.analytics.track('Activity Paused', { id })
}

export const trackActivateActivity = (id: string) => {
  window.analytics.track('Activity Activated', { id })
}

export const trackDeleteActivity = (id: string) => {
  window.analytics.track('Activity Deleted', { id })
}

export const trackDownloadActivityBooking = (id: string, title: string) => {
  window.analytics.track('Activity Booking Downloaded', { id, title })
}

export const trackCalendarToday = () => {
  window.analytics.track('Calendar Today Clicked')
}

export const trackCalendarPrev = () => {
  window.analytics.track('Calendar Prev Clicked')
}

export const trackCalendarNext = () => {
  window.analytics.track('Calendar Next Clicked')
}

export const trackCalendarView = (view: string) => {
  window.analytics.track(`Calendar ${capitalize(view)} Clicked`)
}

export const trackClickCalendarActivity = (activity: any) => {
  window.analytics.track('Calendar Activity Clicked', { activity })
}

export const trackUpdateBankAccount = () => {
  window.analytics.track('Bank Account Updated')
}

export const trackNewsletterSent = (data: any) => {
  window.analytics.track('Newsletter Sent', data)
}

export const trackNewsletterDetailsViewed = () => {
  window.analytics.track('Newsletter Details Viewed')
}

export const trackAudienceAdded = () => {
  window.analytics.track('Audience Added')
}

export const trackAudienceRemoved = () => {
  window.analytics.track('Audience Removed')
}

export const trackAudienceImported = (data: any) => {
  window.analytics.track('Audience Imported', data)
}

export const trackSmallScreenUsed = () => {
  window.analytics.track('Small Screen Used')
}
