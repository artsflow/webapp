import {
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  HStack,
  Spacer,
} from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { update } from '../utils'
import { Navigation } from '../Navigation'
import { Editor } from '../Editor'

const TITLE_MIN_LENGTH = 20
const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MIN_LENGTH = 500
const DESCRIPTION_MAX_LENGTH = 5000

export function Details() {
  const { state, actions } = useStateMachine({ update }) as any

  const {
    getValues,
    formState: { errors, isValid },
    trigger,
    control,
  } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })

  const handleChange = (field: string) => {
    actions.update({ [field]: getValues(field) })
  }

  const handleTrigger = async () => {
    await trigger()
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start" w="640px">
          <Heading size="md" mb="1rem">
            Add Details
          </Heading>
          <Text color="#616167" mb="2rem">
            Please add your activity details.
          </Text>

          <Container>
            <Text fontWeight="bold" alignItems="center" mb="0.5rem">
              Activity Title
            </Text>
            <InputGroup>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: true,
                  minLength: TITLE_MIN_LENGTH,
                  maxLength: TITLE_MAX_LENGTH,
                }}
                defaultValue={state.title}
                render={({ field }) => (
                  <Input
                    mb="4"
                    pr="65px"
                    {...field}
                    placeholder="Add activity title..."
                    autoFocus
                    onChange={(e) => {
                      field.onChange(e)
                      handleChange('title')
                    }}
                  />
                )}
              />
              <InputRightElement
                mr="2"
                w="50px"
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
            <HStack mb="0.5rem" alignItems="center" justifyContent="space-between" w="full">
              <Text fontWeight="bold">Description</Text>
              <Text fontSize="xs" color="gray.400">
                {state.description?.replace(/<[^>]+>/g, '')?.length} / {DESCRIPTION_MAX_LENGTH}
              </Text>
            </HStack>
            <Controller
              control={control}
              name="description"
              rules={{
                required: true,
                minLength: DESCRIPTION_MIN_LENGTH,
                maxLength: DESCRIPTION_MAX_LENGTH,
              }}
              defaultValue={state.description}
              render={({ field }) => (
                <Editor
                  {...field}
                  onChange={(e: any) => {
                    field.onChange(e)
                    handleChange('description')
                    field.onBlur()
                  }}
                />
              )}
            />
            <Spacer mb="1rem" />
            <Error
              errors={errors}
              name="description"
              message={`Description between ${DESCRIPTION_MIN_LENGTH} and ${DESCRIPTION_MAX_LENGTH} characters`}
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
    mb="1.5rem"
  />
)

const Error = (props: any) => (
  <ErrorMessage
    as={<Text color="red.400" fontSize="xs" pos="absolute" bottom="0" right="0" />}
    {...props}
  />
)
