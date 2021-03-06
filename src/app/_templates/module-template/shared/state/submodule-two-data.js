import { reflectKeys } from '@/app/global/services'
import { fetchSubmoduleTwoData } from '../services'

const initialState = {
  data: null,
  error: null,
  loading: false
}

const namespacedPrefix = '[SUBMODULE_TWO]'

const mutationTypes = reflectKeys(
  ['DATA_SUCCESS', 'DATA_REQUEST', 'DATA_ERROR', 'DATA_RESET'],
  namespacedPrefix
)

const { DATA_ERROR, DATA_REQUEST, DATA_RESET, DATA_SUCCESS } = mutationTypes

const mutations = {
  [DATA_REQUEST] (state) {
    Object.assign(state, { loading: true, error: null })
  },

  [DATA_SUCCESS] (state, payload) {
    Object.assign(state, { loading: false, data: payload })
  },

  [DATA_ERROR] (state, payload) {
    Object.assign(state, {
      loading: false,
      data: null,
      error: payload || true
    })
  },

  [DATA_RESET] (state) {
    Object.assign(state, ...initialState)
  }
}

export const submoduleTwoActions = reflectKeys(
  ['FETCH_SUBMODULE_TWO_DATA'],
  namespacedPrefix
)

const actions = {
  async [submoduleTwoActions.FETCH_SUBMODULE_TWO_DATA] (context, data) {
    context.commit(DATA_REQUEST)

    const result = await fetchSubmoduleTwoData(data).catch(e => {
      context.commit(DATA_ERROR, e)
    })

    if (result) {
      context.commit(DATA_SUCCESS, result.data)
    }

    return result
  }
}

export default {
  mutations,
  actions,
  state: initialState
}
