import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'a-form': true,
          'a-form-item': true,
          'a-input': true,
          'a-input-password': true,
          'a-button': true
        }
      }
    })
    expect(wrapper.text()).toContain('工单管理系统')
  })
})
