import { createLocalVue, mount } from '@vue/test-utils'
import Buefy from 'buefy'

import InspirePage from '~/pages/inspire.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('/pages/inspire.vue', () => {
  describe('snapshot test', () => {
    test('renders correctly', () => {
      // Arrange - Act
      const wrapper = mount(InspirePage, { localVue })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
