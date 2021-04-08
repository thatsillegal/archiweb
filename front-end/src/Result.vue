<template>
  <section>
    <div id="map"></div>
    
    <div
      id="result"
    >
      
      <v-card
        id="result-card"
        flat
        height="248px"
        class="overflow-x-auto overflow-y-hidden d-flex flex-no-wrap "
      >

        <v-container v-for="i in 20" :key="i">
          <v-hover v-slot:default="{ hover }">
    
            <v-card
              :class="{ 'on-hover': hover }"
              :elevation="hover ? 10 : 4"
              max-height="220px"
              max-width="220px"
              @click="flyTo"
            >
      
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-img
                    class="mx-1"
                    :src="'http://model.amomorning.com/block/'+(i)+'.jpg'"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </template>
                <span>Top tooltip</span>
              </v-tooltip>
    
            </v-card>
          </v-hover>

        </v-container>
 
      </v-card>
    
    </div>
  
  
  </section>
  <!--  image result-->
</template>

<script>
export default {
  name: "Result",
  data: () => ({
    length: 4,
    window: 0,
  }),
  mounted() {
    const index = require('@/map.js');
    index.main();
    
  },
  methods:{
    flyTo() {
      console.log('fly to ...');
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

#map {
  position: absolute;
  left: 320px;
  top: 0;
  bottom: 0;
  width: calc(100% - 320px);
  height: calc(100% - 300px);
  outline: 1px solid #E0E0E0;
}

#result {
  position: absolute;
  left: 320px;
  top: calc(100% - 300px);
  height: 250px;
  width: calc(100% - 320px);
  outline: 1px solid #E0E0E0;
  background: #FFFFFF;
}

#result-card {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

*::-webkit-scrollbar { width:4px; height:8px; }
*::-webkit-scrollbar-thumb { background-color: #6e6e6e; border-radius:6px; -webkit-box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); }
*::-webkit-scrollbar-thumb:hover {background-color: #ababab;}
*::-webkit-scrollbar-track { background: #ffffff; }
</style>