<template>
  <v-app>

    <TopNav/>
    <LoaderOption></LoaderOption>
    <router-view></router-view>
    <Footer/>
  </v-app>
</template>

<script>
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import LoaderOption from "@/components/LoaderOption";

export default {
  name: 'App',
  components: {
    TopNav,
    Footer,
    LoaderOption
  },
}
</script>

<style>
*::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

*::-webkit-scrollbar-thumb {
  background-color: #6e6e6e;
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #ababab;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}
</style>