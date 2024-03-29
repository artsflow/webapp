import { Box, VStack, Text } from '@chakra-ui/react'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart'
import { curveMonotoneX as curve } from '@visx/curve'

import { Loading } from 'components'

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
}

export const Chart = ({ data, sign = '', loading = false, children, ...props }: any) => (
  <Box
    p="1rem"
    maxW="430px"
    h="276px"
    w="full"
    bg="white"
    rounded="10px"
    boxShadow="0px 2px 6px rgba(0, 0, 0, 0.02)"
    {...props}
  >
    {children}
    {loading ? (
      <Loading />
    ) : (
      <XYChart
        margin={{ top: 20, right: 0, bottom: 20, left: 25 }}
        height={220}
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
      >
        <AnimatedAxis orientation="bottom" />
        <AnimatedAxis orientation="left" />
        <AnimatedGrid
          rows={false}
          numTicks={7}
          stroke="#E5E5E5"
          strokeWidth="1"
          strokeDasharray="2"
        />
        {data.map((d: any) => (
          <AnimatedLineSeries
            key={d.key}
            stroke={d.stroke}
            strokeWidth="1.5"
            curve={curve}
            dataKey={d.key}
            data={d.data}
            {...accessors}
          />
        ))}
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          applyPositionStyle
          unstyled
          renderTooltip={({ tooltipData }: any) => (
            <VStack bg="black" rounded="5px" px="2rem" py="0.5rem" spacing="0">
              <Text fontSize="xs" color="gray.300">
                {tooltipData?.nearestDatum.datum.x}
              </Text>
              <Text fontSize="md" color="white" fontWeight="bold">
                {tooltipData?.nearestDatum.key}: {sign}
                {tooltipData?.nearestDatum.datum.y}
              </Text>
            </VStack>
          )}
        />
      </XYChart>
    )}
  </Box>
)
