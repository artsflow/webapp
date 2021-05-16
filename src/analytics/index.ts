import { UserProps } from './types'

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
