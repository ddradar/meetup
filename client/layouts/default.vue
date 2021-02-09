<template>
  <div>
    <b-navbar type="is-primary">
      <template #brand>
        <b-navbar-item tag="nuxt-link" to="/">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </b-navbar-item>
      </template>

      <template #burger>
        <b-navbar-item
          v-for="(item, key) of items"
          :key="key"
          tag="nuxt-link"
          :to="item.to"
        >
          <b-icon :icon="item.icon" /> {{ item.title }}
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button v-if="$accessor.isLoggedIn" @click="logout">
              ログアウト
            </b-button>
            <b-button v-else type="is-info" icon-left="twitter" @click="login">
              ログイン
            </b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <section class="main-content">
      <nuxt />
    </section>

    <footer class="footer">
      <div class="content has-text-centered">
        Powered by <a href="https://www.ddradar.app/">DDRadar</a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      items: [
        { title: 'Home', icon: 'home', to: { name: 'index' } },
        { title: 'Inspire', icon: 'lightbulb', to: { name: 'inspire' } },
      ],
    }
  },
  methods: {
    async login() {
      await this.$accessor.login()
    },
    async logout() {
      await this.$accessor.logout()
    },
  },
})
</script>
