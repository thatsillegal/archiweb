<template>
  <v-app>
    <TopNav/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
  import TopNav from './components/TopNav'
  import Footer from './components/Footer'
  export default {
    name: 'App',
    components: {
      TopNav,
      Footer
    },
  }
</script>