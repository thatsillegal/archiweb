<template>
  <div>
    <v-app-bar
      app
      color="transparent"
      flat
      absolute
    >
      <v-row class="d-flex align-end mx-3">
        <a class="text-decoration-none" href="http://labaaa.org" style="color:#000000;" target="_blank">
          <v-img
            alt="Logo"
            class="shrink mr-2"
            contain
            src="@/assets/AAA-logo-text-black.png"
            transition="scale-transition"
            width="40"
          />
        </a>
        <a class="text-decoration-none" href="/#/archiweb" style="color:#000000;">
    
          <h2 class="pr-2">ArchiWeb</h2>
  
        </a>
  
        <v-spacer></v-spacer>
        <a>
          <v-btn icon large v-if="checkURL(this.$route.path)" to="/workspace">
            <v-icon color="black"> mdi-home</v-icon>
          </v-btn>
        </a>

      </v-row>
    
    
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    checkURL(url) {
      console.log(url)
      if (url.indexOf('viewboard') >= 0 || url.indexOf('archiweb') >= 0)
        return true;
      console.log(typeof url)
      return false;
    }
  }
}

</script>
