import { useMemo, useCallback, useState } from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import { format, fromUnixTime } from 'date-fns'

import TrashcanIcon from 'svg/icons/trashcan.svg'
import { useAudience } from 'hooks'
import { Card } from 'components/UI'
import { Loading } from 'components'
import { firestore } from 'lib/firebase'
import { showAlert } from 'lib/utils'

export const ListAudience = () => {
  const [audience, audienceLoading] = useAudience()

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: (row: any, i: number) => i + 1,
        width: 40,
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: 170,
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: 270,
      },
      {
        Header: 'Date added',
        accessor: 'createdAt.seconds',
        width: 160,
      },
      {
        Header: 'Action',
        accessor: (row: any) => row.id,
      },
    ],
    []
  )

  const scrollBarSize = useMemo(() => scrollbarWidth(), [])

  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: audience,
      defaultColumn,
    },
    useBlockLayout
  )

  const RenderRow = useCallback(
    ({ index, style }) => {
      const [loading, setLoading] = useState(false)

      const handleDelete = async (id: string, email: string) => {
        setLoading(true)
        try {
          await firestore.collection('audience').doc(id).delete()
          showAlert({
            title: `${email} removed from the audience list`,
            status: 'success',
          })
        } catch (e) {
          showAlert({
            title: 'Error!',
            description: e.message,
            status: 'error',
          })
        }
        setLoading(false)
      }

      const row = rows[index]
      prepareRow(row)
      return (
        <Box
          {...row.getRowProps({
            style,
          })}
          fontSize="sm"
        >
          {row.cells.map((cell, k) => {
            let component = null
            switch (cell.column.Header) {
              case 'Action':
                component = (
                  <Box key={k}>
                    <Button
                      leftIcon={<TrashcanIcon />}
                      size="xs"
                      onClick={() => handleDelete(cell.value, cell.row.values.email)}
                      isLoading={loading}
                    >
                      Delete
                    </Button>
                  </Box>
                )
                break
              case 'Date added':
                component = (
                  <Box {...cell.getCellProps()} key={k}>
                    {format(fromUnixTime(cell.value), 'dd MMM, yyy @ HH:mm')}
                  </Box>
                )
                break
              default:
                component = (
                  <Box {...cell.getCellProps()} key={k}>
                    {cell.render('Cell')}
                  </Box>
                )
                break
            }
            return component
          })}
        </Box>
      )
    },
    [prepareRow, rows]
  )

  return (
    <Card mb="1rem" maxW="770px" p="0" overflow="hidden">
      <Box {...getTableProps()}>
        <Box borderBottom="1px solid" borderBottomColor="gray.200" px="1rem" py="0.5rem">
          {headerGroups.map((headerGroup, k) => (
            <Box {...headerGroup.getHeaderGroupProps()} key={k}>
              {headerGroup.headers.map((column, kk) => (
                <Box {...column.getHeaderProps()} key={kk}>
                  {column.render('Header')}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        {!audience.length ? (
          <VStack h="317px" justifyContent="center">
            {audienceLoading ? (
              <Loading />
            ) : (
              <Text color="#616167">List is empty. Add or import your audience.</Text>
            )}
          </VStack>
        ) : (
          <Box
            {...getTableBodyProps()}
            color="gray.500"
            borderBottomColor="gray.200"
            px="1rem"
            py="0.5rem"
          >
            <FixedSizeList
              height={300}
              itemCount={rows.length}
              itemSize={36}
              width={`"calc(100% - ${scrollBarSize}px)"`}
            >
              {RenderRow}
            </FixedSizeList>
          </Box>
        )}
      </Box>
    </Card>
  )
}

const scrollbarWidth = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;'
  )
  document.body.appendChild(scrollDiv)
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return width
}
