<template>
  <v-app>
    <TopNav/>
    <router-view></router-view>
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