import { getIncomeLast7d, BookingInfo } from './utils'

const bookingData: BookingInfo[] = [
  {
    amount: '3500',
    createdAt: {
      seconds: 1621431818,
    },
  },
  {
    amount: '2500',
    createdAt: {
      seconds: 1621270851,
    },
  },
  {
    amount: 0,
    createdAt: {
      seconds: 1621261232,
    },
  },
  {
    amount: '2500',
    createdAt: {
      seconds: 1621261065,
    },
  },
  {
    amount: '5000',
    createdAt: {
      seconds: 1620992833,
    },
  },
  {
    amount: '5000',
    createdAt: {
      seconds: 1620925154,
    },
  },
  {
    amount: '2500',
    createdAt: {
      seconds: 1620761766,
    },
  },
  {
    amount: 0,
    createdAt: {
      seconds: 1620761736,
    },
  },
  {
    amount: '2500',
    createdAt: {
      seconds: 1620745454,
    },
  },
  {
    amount: 0,
    createdAt: {
      seconds: 1620720723,
    },
  },
  {
    amount: 0,
    createdAt: {
      seconds: 1620632056,
    },
  },
  {
    amount: '2500',
    createdAt: {
      seconds: 1620631817,
    },
  },
]

const transformedData: any = [
  { x: '13 May', y: 50 },
  { x: '14 May', y: 50 },
  { x: '15 May', y: 0 },
  { x: '16 May', y: 0 },
  { x: '17 May', y: 50 },
  { x: '18 May', y: 0 },
  { x: '19 May', y: 35 },
]

const RealDate = Date

describe('transform booking data', () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2021-05-19T10:20:30Z').getTime())
  })

  afterAll(() => {
    global.Date = RealDate
  })

  it('should transfom data for last 7 days', () => {
    expect(getIncomeLast7d(bookingData)).toEqual(transformedData)
  })
})
