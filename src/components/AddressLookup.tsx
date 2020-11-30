import { gql } from 'graphql-request'
import { useState, useCallback } from 'react'
import { Box, Text, Button, Input, HStack, FormLabel, List, ListItem } from '@chakra-ui/core'
import { SearchIcon } from '@chakra-ui/icons'
import GoogleMapReact from 'google-map-react'
import { isEmpty } from 'lodash'

import { GCP_MAPS_KEY } from 'lib/config'
import { client } from 'services/client'

const ALLOWED_COUNTRIES = ['GB']

const GET_ADDRESS = gql`
  query getAddress($input: String!) {
    getAddress(input: $input) {
      id
      streetNumber
      streetName
      municipality
      extendedPostalCode
      country
      countryCode
      freeformAddress
      position {
        lat
        lon
        geohash
      }
    }
  }
`

export const AddressLookup = ({ address = {}, onAddress }: any) => {
  const [selectedAddress, setSelectedAddress]: any = useState(address)
  const [lookupAddress, setLookupAddress] = useState(selectedAddress.freeformAddress)
  const [addresses, setAddresses] = useState([])
  const [isLoading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (!lookupAddress) return
    setLoading(true)
    const result = await client.request(GET_ADDRESS, { input: lookupAddress })
    setAddresses(result.getAddress)
    setSelectedAddress({})
    setLoading(false)
  }, [lookupAddress])

  const showList = addresses.length > 0 && isEmpty(selectedAddress)
  const isCountryAllowed = ALLOWED_COUNTRIES.includes(selectedAddress.countryCode)

  return (
    <Box w="full">
      <FormLabel htmlFor="address">Search for your address</FormLabel>
      <HStack>
        <Input
          placeholder="Search address"
          value={lookupAddress}
          onChange={(e) => setLookupAddress(e.target.value)}
          autoFocus
          size="md"
        />
        <Button onClick={handleClick} isLoading={isLoading}>
          <SearchIcon />
        </Button>
      </HStack>
      {!isEmpty(selectedAddress) && isCountryAllowed && (
        <Box mt="2" py="2">
          <AddressInfo {...selectedAddress} />
        </Box>
      )}
      {!isEmpty(selectedAddress) && !isCountryAllowed && (
        <Box mt="2" p="2">
          <Text>
            The service is not available in <b>{selectedAddress.country}</b>
          </Text>
        </Box>
      )}
      {showList && (
        <List spacing="2" mt="2" h="260px" overflowY="scroll">
          {addresses.map((a: any) => (
            <ListItem key={a.id}>
              <Button
                w="full"
                variant="outline"
                justifyContent="flex-start"
                onClick={() => {
                  setSelectedAddress(a)
                  onAddress(a)
                }}
              >
                {a.freeformAddress}
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

const Marker: React.FC<any> = () => <Box w="8" h="8" borderRadius="16px" bg="red.400" />

const AddressInfo = ({
  streetNumber,
  streetName,
  extendedPostalCode,
  municipality,
  countryCode,
  country,
  position: { lat, lon: lng },
}: any) => (
  <>
    <Text>
      {streetNumber} {streetName}, {municipality}, {extendedPostalCode}, {countryCode}, {country}
    </Text>
    <Box w="full" h="220px" border="1px" mt="2">
      <GoogleMapReact
        defaultCenter={{ lat, lng }}
        defaultZoom={16}
        bootstrapURLKeys={{ key: GCP_MAPS_KEY as string }}
      >
        <Marker lat={lat} lng={lng} />
      </GoogleMapReact>
    </Box>
  </>
)