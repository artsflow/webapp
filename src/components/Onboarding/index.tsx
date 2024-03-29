import { useEffect } from 'react'
import { Text, Button, List, ListItem, ListIcon, Box } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Card } from 'components/UI'
import { checkUserFirstTime } from 'api'
import { useUserData, useOnboarding } from 'hooks'
import { trackAddActivityButton } from 'analytics'
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'
import { AccountVerification } from './AccountVerification'

export function Onboarding(): JSX.Element {
  const { user } = useUserData()
  const [, , isStep2Completed, isStep3Completed, isStep4Completed] = useOnboarding()

  useEffect(() => {
    checkUserFirstTime()
  }, [])

  return (
    <>
      <Text py="1rem">
        Here are some steps that you’ll need to complete to set-up your account:
      </Text>
      <Card>
        <List spacing="1.5rem">
          <OnboardingStep isCompleted title="1. Successfully register to the platform" />
          <OnboardingStep
            isCompleted={isStep2Completed}
            title="2. Verify your account"
            children={<AccountVerification />}
          />
          <OnboardingStep
            isCompleted={isStep3Completed}
            title="3. Create your first activity (or event)"
            children={
              <NextLink as="/activities/add" href="/activities/add" passHref>
                <Button
                  as="a"
                  variant="primary"
                  cursor="pointer"
                  onClick={() => trackAddActivityButton('Onboarding')}
                >
                  Create an activity or event
                </Button>
              </NextLink>
            }
          />
          <OnboardingStep
            isCompleted={isStep4Completed}
            title="4. Import your audience and send your first newsletter to announce your activity!"
            children={
              <NextLink as="/newsletters" href="/newsletters" passHref>
                <Button as="a" variant="primary" cursor="pointer" isDisabled={!user.isVerified}>
                  Send newsletters
                </Button>
              </NextLink>
            }
          />
        </List>
      </Card>
    </>
  )
}

const OnboardingStep = ({ isCompleted, title, children }: any) => (
  <ListItem>
    {isCompleted ? (
      <ListIcon as={MdCheckCircle} color="af.teal" fontSize="1.2rem" />
    ) : (
      <ListIcon as={MdRadioButtonUnchecked} color="af.teal" fontSize="1.2rem" />
    )}
    <Text as="span" textDecoration={isCompleted ? 'line-through gray' : 'none'}>
      {title}
    </Text>
    {children && (
      <Box pl="44px" pt="0.5rem">
        {children}
      </Box>
    )}
  </ListItem>
)
