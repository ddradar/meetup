import { createLocalVue, mount, RouterLinkStub } from '@vue/test-utils'
import Buefy from 'buefy'

import DefaultLayout from '~/layouts/default.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('/layouts/default.vue', () => {
  const stubs = { NuxtLink: RouterLinkStub, Nuxt: true }
  describe('snapshot test', () => {
    test('renders correctly', () => {
      // Arrange - Act
      const wrapper = mount(DefaultLayout, { localVue, stubs })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
