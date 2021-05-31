import { useCallback, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { uniqBy, differenceBy } from 'lodash'

import { importCSV } from 'api'
import { showAlert, isEmailValid } from 'lib/utils'
import { useAudience } from 'hooks'
import CloudSvg from 'svg/icons/cloud.svg'

export const AUDIENCE_LIMIT = 500

export const CSVImport = ({ onClose, isOpen }: any) => {
  const [list, setList] = useState([] as unknown[])
  const [audience] = useAudience()
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async ([file]) => {
    if (!file) {
      showAlert({
        title: 'The file is not CSV',
        status: 'error',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => parse(reader.result)
    reader.readAsText(file)
  }, [])

  const parse = (csv: any) => {
    const parsed = Papa.parse(csv)

    if (parsed.errors.length) {
      showAlert({
        title: 'CSV Error!',
        description: parsed.errors.map((e) => e.message).join('\n'),
        status: 'error',
      })
      return
    }
    setList(parsed.data)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'text/csv, .txt',
  })

  const handleClose = () => {
    setList([])
    onClose()
  }

  const handleImport = async () => {
    setLoading(true)
    const res = await importCSV(list)
    if (res?.data?.ok) {
      showAlert({
        title: `List impored with success`,
        status: 'success',
      })
      handleClose()
    } else {
      showAlert({
        title: 'Error! Please try again.',
        status: 'error',
      })
    }
    setLoading(false)
  }

  const { total } = cleanList(audience, list)
  const contactsLeft = AUDIENCE_LIMIT - audience.length
  const isOveLimit = total > contactsLeft

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent minH="360px" maxW="640px" alignItems="center">
        <ModalCloseButton />
        <ModalBody>
          {!list.length ? (
            <VStack minH="300px" justifyContent="center" spacing="3" {...getRootProps()}>
              <Icon as={CloudSvg} w="32px" h="32px" />
              <Text fontSize="xs" color="#616167">
                Drag and drop your CSV file here, or
              </Text>
              <input {...getInputProps()} />
              <Button variant="primary">Browse files</Button>
              <Text fontSize="xs" color="#616167" textAlign="center">
                <b>Tip:</b> the CSV file should have two columns, first with the name
                <br />
                and second with email and no header
              </Text>
            </VStack>
          ) : (
            <VStack minH="300px" justifyContent="center" spacing="3">
              <Text fontWeight="bold">Import summary:</Text>
              <VStack h="160px" overflow="scroll" p="1rem" bg="gray.50">
                {list.map((item: any, k) => (
                  <HStack key={k} fontSize="xs" w="full">
                    <Text w="40px">{k + 1}</Text>
                    <Text w="full" maxW="120px">
                      {item[0]}
                    </Text>
                    <Text w="full">{item[1]}</Text>
                  </HStack>
                ))}
              </VStack>
              <Summary audience={audience} list={list} />
              <Text fontSize="xs" color="#616167">
                <b>Note:</b> we deduplicate and remove invalid emails for you
              </Text>
            </VStack>
          )}
        </ModalBody>
        {list.length > 0 && (
          <ModalFooter>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!total || !contactsLeft}
              isLoading={loading}
            >
              Import list ({isOveLimit ? contactsLeft : total})
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

const Summary = ({ list, audience }: any) => {
  const { duplicate, invalid, total } = cleanList(audience, list)

  const isOveLimit = total > AUDIENCE_LIMIT - audience.length
  const contactsLeft = AUDIENCE_LIMIT - audience.length

  return (
    <>
      <HStack fontSize="sm">
        <Text>
          List size: <b>{list.length}</b>,
        </Text>
        <Text>
          invalid emails: <b>{invalid}</b>,
        </Text>
        <Text>
          duplicate emails: <b>{duplicate}</b>
        </Text>
      </HStack>
      <HStack>
        <Text fontSize="sm" color="af.teal" fontWeight="bold">
          Entries to be added after deduplication of existing audience: {total}
        </Text>
      </HStack>
      {contactsLeft <= 0 && (
        <Text color="af.pink" textAlign="center">
          You reached the audience limit of {AUDIENCE_LIMIT} contacts.
        </Text>
      )}
      {isOveLimit && contactsLeft > 0 && (
        <Text color="af.pink" textAlign="center">
          Your list will be larger than {AUDIENCE_LIMIT} which is the audience limit.
          <br /> Only the first {contactsLeft} contacts will be imported
        </Text>
      )}
    </>
  )
}

const cleanList = (audience: any, list: any) => {
  const valid = list.filter((item: string[]) => isEmailValid(item[1]))
  const unique = uniqBy(valid, (item: string[]) => item[1])

  const duplicate = list.length - unique.length
  const invalid = list.length - valid.length

  const final = differenceBy(
    unique.map((item) => ({ email: item[1] })),
    audience,
    'email'
  )

  const total = final.length

  return { duplicate, invalid, total }
}
