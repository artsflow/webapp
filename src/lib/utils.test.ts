import { transformUserInfo } from './utils'

describe('util tests', () => {
  it('should transformUserInfo', () => {
    const userInfo = {
      emailVerified: true,
      familyName: 'familyName',
      givenName: 'givenName',
      picture: 'picture',
      locale: 'locale',
      name: 'name',
    }

    const user = {
      firstName: 'givenName',
      lastName: 'familyName',
      picture: 'picture',
      name: 'name',
    }

    expect(transformUserInfo(userInfo)).toMatchObject(user)
  })
})
