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

export const trackUpdateAvatar = (userId: string) => {
  window.analytics.identify(userId)
  window.analytics.track('Avatar Updated')
}

export const trackStartVerification = (userId: string) => {
  window.analytics.identify(userId)
  window.analytics.track('Verification Started')
}
