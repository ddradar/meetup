import {
  createLocalVue,
  mount,
  RouterLinkStub,
  shallowMount,
  Wrapper,
} from '@vue/test-utils'
import Buefy from 'buefy'

import DefaultLayout from '~/layouts/default.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('/layouts/default.vue', () => {
  const stubs = { NuxtLink: RouterLinkStub, Nuxt: true }

  describe('snapshot test', () => {
    test('renders Login button if { isLoggedIn: false }', () => {
      // Arrange - Act
      const mocks = { $accessor: { isLoggedIn: false } }
      const wrapper = mount(DefaultLayout, { localVue, stubs, mocks })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
    test('renders Logout button if { isLoggedIn: true }', () => {
      // Arrange - Act
      const mocks = { $accessor: { isLoggedIn: true } }
      const wrapper = mount(DefaultLayout, { localVue, stubs, mocks })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    const mocks = {
      $accessor: { isLoggedIn: false, login: jest.fn(), logout: jest.fn() },
    }
    let wrapper: Wrapper<DefaultLayout>
    beforeEach(() => {
      mocks.$accessor.login.mockClear()
      mocks.$accessor.logout.mockClear()
      wrapper = shallowMount(DefaultLayout, { localVue, stubs, mocks })
    })

    describe('login()', () => {
      test('calls $accessor.login()', async () => {
        // Arrange - Act
        // @ts-ignore
        await wrapper.vm.login()

        expect(mocks.$accessor.login).toBeCalledTimes(1)
        expect(mocks.$accessor.logout).not.toBeCalled()
      })
    })
    describe('logout()', () => {
      test('calls $accessor.logout()', async () => {
        // Arrange - Act
        // @ts-ignore
        await wrapper.vm.logout()

        expect(mocks.$accessor.logout).toBeCalledTimes(1)
        expect(mocks.$accessor.login).not.toBeCalled()
      })
    })
  })
})
