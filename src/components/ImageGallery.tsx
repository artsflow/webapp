import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wrap } from 'popmotion'
import { Flex, BoxProps } from '@chakra-ui/core'

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export function ImageGallery({ images }: { images: string[] }) {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = wrap(0, images.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          style={{ position: 'absolute' }}
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
        />
      </AnimatePresence>
      <Button title="‣" right="15px" onClick={() => paginate(1)} />
      <Button title="‣" left="15px" transform="scale(-1)" onClick={() => paginate(-1)} />
    </>
  )
}

interface ButtonProps extends BoxProps {
  title: string
  onClick: () => void
}
const Button = ({ title, onClick, ...rest }: ButtonProps) => (
  <Flex
    onClick={onClick}
    top="calc(50% - 15px)"
    pos="absolute"
    bg="white"
    w="30px"
    h="30px"
    borderRadius="15px"
    justifyContent="center"
    alignItems="center"
    userSelect="none"
    cursor="pointer"
    fontSize="32px"
    color="#7e7e7e"
    zIndex="2"
    {...rest}
  >
    <Flex mt="-7px">{title}</Flex>
  </Flex>
)
