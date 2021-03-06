import CommentsSection from '../comments-section.vue'
import { createWrapper } from '@/utils'
// import flushPromises from 'flush-promises'
// import { httpClient } from '@/app/global/services/http-client/http-client'

// jest.mock('@/app/global/services/http-client/http-client')

const mockStore = {
  state: {
    riverDetailState: {
      commentsData: {
        error: null,
        data: null,
        loading: null
      }
    },
    userState: {
      userData: {
        data: {
          uid: '123',
          uname: 'foo',
          uemail: 'bar@aol.com'
        }
      }
    }
  },
  dispatch: jest.fn()
}

const reachId = '123'

const options = {
  mocks: {
    $store: mockStore,
    $route: {
      params: {
        id: reachId
      }
    }
  }
}

describe('CommentsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading block when loading', () => {
    mockStore.state.riverDetailState.commentsData.loading = true
    const wrapper = createWrapper(CommentsSection, options)

    expect(wrapper.find('.utility-block-loading').exists()).toBe(true)
    expect(wrapper.find('.utility-block-error').exists()).toBe(false)
    expect(wrapper.find('.utility-block-content').exists()).toBe(false)
  })

  it('shows error block when error', () => {
    mockStore.state.riverDetailState.commentsData.loading = false
    mockStore.state.riverDetailState.commentsData.error = true
    const wrapper = createWrapper(CommentsSection, options)

    expect(wrapper.find('.utility-block-loading').exists()).toBe(false)
    expect(wrapper.find('.utility-block-error').exists()).toBe(true)
    expect(wrapper.find('.utility-block-content').exists()).toBe(false)
  })

  it('shows empty state when no comments present', () => {
    mockStore.state.riverDetailState.commentsData.loading = false
    mockStore.state.riverDetailState.commentsData.error = false
    mockStore.state.riverDetailState.commentsData.data = []

    const wrapper = createWrapper(CommentsSection, options)

    expect(wrapper.find('.utility-block-loading').exists()).toBe(false)
    expect(wrapper.find('.utility-block-error').exists()).toBe(false)
    expect(wrapper.find('.utility-block-content').exists()).toBe(true)
  })

  it('shows modal when new comment is initiated', async () => {
    const wrapper = createWrapper(CommentsSection, options)

    wrapper.find('#new-comment').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.post-update-modal').classes()).toContain('is-visible')
  })

  it('hides modal when new comment is cancelled', async () => {
    const wrapper = createWrapper(CommentsSection, options)

    wrapper.find('#new-comment').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.post-update-modal').classes()).toContain('is-visible')

    wrapper.vm.handleCancel()

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.post-update-modal').classes()).not.toContain('is-visible')
  })

  it('loads comments when in view', () => {
    /**
     * not sure how to test scrolling, so we'll just check to see
     * if the dispatch was called 'on mounted'
     */

    const wrapper = createWrapper(CommentsSection, options)

    wrapper.vm.loadComments()

    expect(mockStore.dispatch).toHaveBeenNthCalledWith(1,
      '[COMMENTS] FETCH_COMMENTS_DATA', reachId
    )
  })

  /**
   * @todo need to refactor so api call is separate module
   *
   */
})
