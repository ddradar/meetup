import { actions, getters, mutations, state } from '~/store'

describe('/store/index.ts', () => {
  const user = {
    uid: 'foo',
    displayName: 'foo',
    photoURL: '',
    providerId: 'foo_user',
  }
  describe('state', () => {
    test('returns { user: null }', () =>
      expect(state()).toStrictEqual({ user: null }))
  })

  describe('getters', () => {
    describe('isLoggedIn', () => {
      test('({ user }) returns true', () => {
        expect(getters.isLoggedIn({ user })).toBe(true)
      })
      test('({ user: null }) returns false', () =>
        expect(getters.isLoggedIn({ user: null })).toBe(false))
    })
  })

  describe('mutations', () => {
    describe('setUser', () => {
      test.each([null, { ...user }])(
        '(state, %p) sets user to state.user',
        user => {
          const state = { user: null }
          mutations.setUser(state, user)
          expect(state.user).toBe(user)
        }
      )
    })
  })

  describe('actions', () => {
    const context = { commit: jest.fn() } as any
    const store = {
      $fire: { auth: { signInWithPopup: jest.fn(), signOut: jest.fn() } },
      $fireModule: { auth: { TwitterAuthProvider: jest.fn() } },
    } as any
    beforeEach(() => {
      context.commit.mockClear()
      store.$fire.auth.signInWithPopup.mockClear()
      store.$fireModule.auth.TwitterAuthProvider.mockClear()
    })

    describe('login()', () => {
      test('calls $fire.auth.signInWithPopup()', async () => {
        // Arrange
        store.$fire.auth.signInWithPopup.mockResolvedValueOnce({ user })

        // Act
        await actions.login.call(store, context)

        // Assert
        expect(store.$fire.auth.signInWithPopup).toBeCalledTimes(1)
        expect(context.commit).toBeCalledWith('setUser', user)
      })
    })
    describe('logout()', () => {
      test('calls $fire.auth.signOut()', async () => {
        // Arrange - Act
        await actions.logout.call(store, context)

        // Assert
        expect(store.$fire.auth.signOut).toBeCalledTimes(1)
        expect(context.commit).toBeCalledWith('setUser', null)
      })
    })
  })
})
