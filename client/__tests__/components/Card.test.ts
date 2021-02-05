import { createLocalVue, mount } from '@vue/test-utils'
import Buefy from 'buefy'

import Card from '~/components/Card.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('/components/Card.vue', () => {
  describe('snapshot test', () => {
    test('renders correctly', () => {
      // Arrange - Act
      const propsData = { title: 'Title', icon: 'info' }
      const wrapper = mount(Card, { localVue, propsData })

      // Assert
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
