import { createLocalVue, mount } from '@vue/test-utils'
import Buefy from 'buefy'

import IndexPage from '~/pages/index.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('/pages/index.vue', () => {
  describe('snapshot test', () => {
    test('renders correctly', () => {
      // Arrange - Act
      const wrapper = mount(IndexPage, { localVue, stubs: ['card'] })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
