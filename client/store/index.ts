import type firebase from 'firebase'
import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'nuxt-typed-vuex'

export type FirebaseUser = Pick<
  firebase.User,
  'uid' | 'displayName' | 'photoURL' | 'providerId'
>

export const state = () => {
  return { user: null as FirebaseUser | null }
}

export const getters = getterTree(state, {
  isLoggedIn: state => !!state.user,
})

export const mutations = mutationTree(state, {
  setUser(state, user: FirebaseUser | null): void {
    state.user = user
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async login({ commit }) {
      const provider = new this.$fireModule.auth.TwitterAuthProvider()
      const result = await this.$fire.auth.signInWithPopup(provider)
      commit('setUser', result.user)
    },
    async logout({ commit }) {
      await this.$fire.auth.signOut()
      commit('setUser', null)
    },
  }
)

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
})
