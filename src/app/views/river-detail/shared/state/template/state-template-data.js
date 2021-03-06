import { reflectKeys } from '@/app/global/services'

import { fetchMapData } from '../../services'

/** Initial state */
const initialState = {
  loading: false,
  data: null,
  error: null
}

/** Prefix for mutation types and actiontypes */
const namespacedPrefix = '[MAP]'

/**
 * Mutation types
 */
const mutationTypes = reflectKeys(
  ['DATA_SUCCESS', 'DATA_REQUEST', 'DATA_ERROR', 'DATA_RESET'],
  namespacedPrefix
)

const { DATA_ERROR, DATA_REQUEST, DATA_RESET, DATA_SUCCESS } = mutationTypes

/**
 *  mutations
 */
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

/** Actions types constants */
export const mapActions = reflectKeys(['FETCH_MAP_DATA'], namespacedPrefix)

/**
 * actions
 */
const actions = {
  /** fetch map data */
  async [mapActions.FETCH_MAP_DATA] (context, data) {
    context.commit(DATA_REQUEST)

    const result = await fetchMapData(data).catch(e => {
      context.commit(DATA_ERROR, e)
    })

    if (result) {
      context.commit(DATA_SUCCESS, result)
    }

    return result
  }
}

export default {
  mutations,
  actions,
  state: initialState
}
