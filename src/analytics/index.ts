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
  const { userId, provider } = props
  window.analytics.identify(userId, { ...props, isCreative: true })
  window.analytics.track('Creative Signed In', { provider })
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
