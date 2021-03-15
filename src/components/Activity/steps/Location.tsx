import { useState, useEffect } from 'react'
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete'
import { Flex, Text, Box, Textarea, Heading, Image } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import GoogleMap from 'google-map-react'
import { components } from 'react-select'
import { SearchIcon } from '@chakra-ui/icons'

import { GCP_MAPS_KEY } from 'lib/config'
import { update } from '../utils'
import { Navigation } from '../Navigation'

export function Location() {
  const { state, actions } = useStateMachine({ update }) as any
  const { register, formState, getValues, errors, trigger } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })
  const [place, setPlace] = useState(null) as any
  const { isValid } = formState

  const {
    locationAddress,
    locationGeocode: { lat, lng },
    locationDetails,
  } = state

  useEffect(() => {
    if (place?.value) {
      geocodeByPlaceId(place.value.place_id)
        .then((results) => {
          actions.update({
            locationAddress: place?.value.description,
            locationPlaceId: place.value.place_id,
            locationGeocode: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            },
          })
          trigger()
        })
        .catch((error) => console.error(error))
    }
  }, [place])

  const handleChange = (field: string) => actions.update({ [field]: getValues(field) })

  const handleTrigger = async () => {
    await trigger()
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px" w="full">
        <Flex direction="column" alignItems="flex-start" w="full">
          <Heading size="md" mb="1rem">
            Add Location
          </Heading>
          <Text color="#616167" mb="2rem">
            Please enter the full location information below.
            <br />
            The location address will not be public and only shared with users who joined.
          </Text>

          <Container w="520px">
            <Text fontWeight="bold" alignItems="center">
              Search for location
            </Text>
            <Box my="4" w="full" borderRadius="6px" shadow="0px 3px 8px rgba(50, 50, 71, 0.05)">
              <GooglePlacesAutocomplete
                apiKey={GCP_MAPS_KEY}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ['uk'],
                  },
                }}
                selectProps={{
                  place,
                  onChange: setPlace,
                  components: {
                    DropdownIndicator,
                    Menu,
                    IndicatorSeparator: () => null,
                  },
                  styles: {
                    control: (base, { isFocused }) => ({
                      ...base,
                      border: '0px',
                      padding: '5px',
                      boxShadow: isFocused
                        ? '0px 0px 0px 1px #47BCC8'
                        : '0px 3px 8px rgba(50, 50, 71, 0.05)',
                    }),
                    menu: (base) => ({
                      ...base,
                      boxShadow: '0px 3px 8px rgba(50, 50, 71, 0.05)',
                    }),
                  },
                }}
              />
            </Box>
            {lat && lng && (
              <Box
                bg="white"
                position="relative"
                maxW="full"
                w="520px"
                h="220px"
                mt="2"
                borderRadius="6px"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                overflow="hidden"
              >
                <GoogleMap
                  center={{ lat, lng }}
                  defaultZoom={16}
                  bootstrapURLKeys={{ key: GCP_MAPS_KEY as string }}
                  options={{
                    fullscreenControl: false,
                  }}
                >
                  <Marker lat={lat} lng={lng} />
                </GoogleMap>
              </Box>
            )}
            <Box w="full" py="1rem" pos="relative" display={locationAddress ? 'block' : 'none'}>
              <Text fontWeight="bold" alignItems="center">
                Activity address
              </Text>
              <Textarea
                my="4"
                placeholder="Update address location..."
                rows={2}
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                name="locationAddress"
                value={locationAddress}
                ref={register({
                  required: true,
                  minLength: 20,
                  maxLength: 200,
                })}
                onChange={() => handleChange('locationAddress')}
              />
              <Box marginTop={locationAddress ? '-10px' : '40px'}>
                <Error
                  errors={errors}
                  name="locationAddress"
                  message="Address between 20 and 200 characters"
                />
              </Box>
            </Box>

            <Box w="full" pos="relative" display={locationAddress ? 'block' : 'none'}>
              <Text fontWeight="bold" alignItems="center">
                Additional details (optional)
              </Text>
              <Textarea
                mt="1rem"
                placeholder="Additional location details..."
                rows={2}
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                value={locationDetails}
                name="locationDetails"
                ref={register({
                  required: false,
                  maxLength: 200,
                })}
                onChange={() => handleChange('locationDetails')}
              />
              <Box mt="20px">
                <Error
                  errors={errors}
                  name="locationDetails"
                  message="Additional details longer than 200 characters"
                />
              </Box>
            </Box>
          </Container>
        </Flex>
      </Flex>
      <Navigation isValid={isValid} onClick={handleTrigger} />
    </>
  )
}

const Menu = ({ children, ...rest }: any) => (
  <>
    <components.Menu {...rest}>
      {children}
      <Flex justifyContent="flex-end" p="0.7rem">
        <Image h="1rem" src="/img/powered-by-google.png" />
      </Flex>
    </components.Menu>
  </>
)

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <SearchIcon />
  </components.DropdownIndicator>
)

const Marker: React.FC<any> = () => (
  <Box
    w="2rem"
    h="2rem"
    borderWidth="0.5rem"
    borderColor="af.teal"
    borderRadius="full"
    bg="white"
    boxShadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
  />
)

const Container = ({ children, ...rest }: any) => (
  <Flex
    direction="column"
    alignItems="flex-start"
    pos="relative"
    pb="1rem"
    children={children}
    {...rest}
  />
)

const Error = (props: any) => (
  <ErrorMessage
    as={<Text color="red.400" fontSize="xs" pos="absolute" bottom="0px" right="0" />}
    {...props}
  />
)
