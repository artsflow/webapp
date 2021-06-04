import { useUserData } from './user'
import { useActivities } from './activities'
import { useSentNewsletters, useAudience } from './newsletters'

export const useOnboarding = () => {
  const { user } = useUserData()
  const [activities] = useActivities()
  const [newsletters] = useSentNewsletters()
  const [audience] = useAudience()

  const step1 = true
  const step2 = user.isVerified
  const step3 = activities?.length > 0
  const step4 = user.isVerified && newsletters.length > 0 && audience.length > 0

  const completed = step1 && step2 && step3 && step4

  return [completed, step1, step2, step3, step4]
}
