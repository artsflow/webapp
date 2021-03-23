import {
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Textarea,
  Tooltip,
  HStack,
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { useStateMachine } from 'little-state-machine'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { update } from '../utils'
import { Navigation } from '../Navigation'

const TITLE_MIN_LENGTH = 20
const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MIN_LENGTH = 200
const DESCRIPTION_MAX_LENGTH = 5000
const WHATTOBRING_MAX_LENGTH = 1000

export function Details() {
  const { state, actions } = useStateMachine({ update }) as any
  const { register, formState, getValues, errors, trigger } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })
  const { isValid } = formState

  const handleChange = (field: string) => actions.update({ [field]: getValues(field) })

  const handleTrigger = async () => {
    await trigger()
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start" w="460px">
          <Heading size="md" mb="1rem">
            Add Details
          </Heading>
          <Text color="#616167" mb="2rem">
            Add your activity details.
          </Text>

          <Container>
            <Text fontWeight="bold" alignItems="center">
              Activity Title
            </Text>
            <InputGroup>
              <Input
                my="4"
                pr="60px"
                placeholder="Add activity title..."
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                autoFocus
                name="title"
                ref={register({
                  required: true,
                  minLength: TITLE_MIN_LENGTH,
                  maxLength: TITLE_MAX_LENGTH,
                })}
                onChange={() => handleChange('title')}
              />
              <InputRightElement
                my="4"
                mr="2"
                fontSize="xs"
                children={`${state.title?.length} / ${TITLE_MAX_LENGTH}`}
                color="gray.400"
              />
            </InputGroup>
            <Error
              errors={errors}
              name="title"
              message={`Title must have between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`}
            />
          </Container>

          <Container>
            <Text fontWeight="bold" alignItems="center">
              Description
            </Text>
            <InputGroup>
              <Textarea
                my="4"
                placeholder="Enter description..."
                rows={7}
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                name="description"
                ref={register({
                  required: true,
                  minLength: DESCRIPTION_MIN_LENGTH,
                  maxLength: DESCRIPTION_MAX_LENGTH,
                })}
                onChange={() => handleChange('description')}
              />
              <InputRightElement
                mt="-2rem"
                w="80px"
                color="gray.400"
                fontSize="xs"
                children={`${state.description?.length} / ${DESCRIPTION_MAX_LENGTH}`}
              />
            </InputGroup>
            <Error
              errors={errors}
              name="description"
              message={`Description hast have between ${DESCRIPTION_MIN_LENGTH} and ${DESCRIPTION_MAX_LENGTH} characters`}
            />
          </Container>

          <Container>
            <HStack>
              <Text fontWeight="bold" alignItems="center">
                What to bring
              </Text>
              <Tooltip label="More info here about what what to bring..." fontSize="md">
                <QuestionOutlineIcon color="gray.400" />
              </Tooltip>
            </HStack>
            <InputGroup>
              <Textarea
                my="4"
                placeholder="List what to bring..."
                rows={7}
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                name="whatToBring"
                ref={register({
                  required: false,
                  maxLength: DESCRIPTION_MAX_LENGTH,
                })}
                onChange={() => handleChange('whatToBring')}
              />
              <InputRightElement
                mt="-2rem"
                w="80px"
                color="gray.400"
                fontSize="xs"
                children={`${state.whatToBring?.length} / ${WHATTOBRING_MAX_LENGTH}`}
              />
            </InputGroup>
            <Error
              errors={errors}
              name="whatToBring"
              message={`What to bring no more than ${WHATTOBRING_MAX_LENGTH} characters`}
            />
          </Container>
        </Flex>
      </Flex>
      <Navigation isValid={isValid} onClick={handleTrigger} />
    </>
  )
}

const Container = ({ children }: any) => (
  <Flex
    direction="column"
    alignItems="flex-start"
    w="full"
    pos="relative"
    pb="1rem"
    children={children}
  />
)

const Error = (props: any) => (
  <ErrorMessage
    as={<Text color="red.400" fontSize="xs" pos="absolute" bottom="0" right="0" />}
    {...props}
  />
)
