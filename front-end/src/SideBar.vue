<template>
  <v-card
    class="pt-15"
    flat
  >
    <v-navigation-drawer
      width="1000px"
      height="820px"
      permanent
      class="pt-5"
    >
      <v-card flat>
        <template style="background:#ffffff;">
          <div
            id="gui-container"
            style="position:absolute;right:0;z-index:999"
          ></div>
          <div id="container" class="d-flex justify-sm-center">
          </div>
        </template>
        
      </v-card>
      <v-divider></v-divider>
      
      <v-row
        dense
        class="mx-5 my-3"
      >
        <v-col
          v-for="item in items"
          :key="item.label"
          class="col-12"
          dense
        >
          <v-slider
            dense
            v-model="item.val"
            step="1"
            color="black"
            track-color="grey"
            thumb-color="brown"
            :label="item.label"
          >
  
            <template v-slot:append>
              <v-text-field
                v-model="item.val"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                color="black"
              ></v-text-field>
            </template>
          </v-slider>

        </v-col>
      </v-row>
    </v-navigation-drawer>
    

  </v-card>
</template>

<script>
export default {
  name: "SideBar",
  data: () => ({
    items: [
      { label: 'color', val: 25, color: 'orange darken-3' },
      { label: 'track-color', val: 75, color: 'green lighten-1' },
      { label: 'thumb-color', val: 50, color: 'red' },
      { label: 'b-color', val: 50, color: 'red' },
      { label: 'c-color', val: 25, color: 'orange darken-3' },
    ],
    right: null,
  }),
  mounted() {
      const index = require('@/index.js');
      index.main();
  },
}
</script>

<style scoped>

</style>