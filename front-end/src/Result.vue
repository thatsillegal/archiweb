<template>
  <section>
    <div id="map"></div>
    
    <div id="result">
      
      <v-container fluid>
        <v-row dense>
          <v-col v-for="i in 2"
                 :key="i"
                 class="col-12 col-lg-6"
          >
            <v-row dense>
              <v-col v-for="j in 4"
                     :key="j"
                     class="col-3"
              >
                <v-hover v-slot:default="{ hover }">
  
                <v-card
                  :class="{ 'on-hover': hover }"
                  :elevation="hover ? 10 : 4"
                  max-height="200px"
                  max-width="200px"
                  @click="flyTo"
                >
  
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-img
                        :src="'http://model.amomorning.com/block/'+((i-1)*4+j)+'.jpg'"
                        v-bind="attrs"
                        v-on="on"
                      >
                      
                      </v-img>
                    </template>
                    <span>Top tooltip</span>
                  </v-tooltip>

                </v-card>
                </v-hover>
              </v-col>
            
            </v-row>
          
          </v-col>
        
        
        </v-row>
      
      </v-container>
    
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
  top: 0;
  bottom: 0;
  width: 75%;
  height: 75%;
  outline: 1px solid #E0E0E0;
}

#result {
  position: absolute;
  top: 75%;
  height: 25%;
  width: 75%;
  outline: 1px solid #E0E0E0;
  background: #F4F4F4;
  
}
</style>