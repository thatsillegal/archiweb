<template>
  <v-app class="d-flex">

    <TopNav/>
    <v-row class="pa-0 ma-0">
      <v-col class="col-3 pa-0">
        <SideBar></SideBar>
  
        <div class="text-center">
          <v-btn rounded outlined large>
            Search
          </v-btn>
        </div>

      </v-col>
      <v-col class="col-9 pa-0">
        <v-row class="pa-0 ma-0">
  
            <Result></Result>
        </v-row>
      </v-col>

    </v-row>
    <Footer/>
      
  </v-app>
</template>

<script>
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import SideBar from "@/SideBar";
import Result from "@/Result";

export default {
  name: 'App',
  components: {
    SideBar,
    TopNav,
    Footer,
    Result,
  },
}
</script>