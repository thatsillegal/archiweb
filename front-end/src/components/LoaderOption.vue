<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="320"
      persistent
    >
      <v-card
        class="pa-4"
      >
        <h3 class="mt-2">Model Status</h3>
        <v-radio-group
          v-model="option.status"
          row
          @change="updateOption"
        >
          <v-radio
            label="grouped"
            value="grouped"
          ></v-radio>
          <v-radio
            label="merged"
            value="merged"
          ></v-radio>
          <v-radio
            label="raw"
            value="raw"
          ></v-radio>

        </v-radio-group>
  
        <h3>Other Options</h3>
        <v-col
          class="my-0 py-0"
        >
          <v-row
            class="mr-2"
          >
            <v-checkbox
              v-model="option.selectable"
              label="selectable"
              @change="updateOption"
            ></v-checkbox>
    
            <v-spacer></v-spacer>
            <v-checkbox
              v-model="option.doubleSide"
              label="doubleSide"
              @change="updateOption"
            ></v-checkbox>
          </v-row>
          
        </v-col>
        
        <v-card-actions>
          <v-btn
            dark
            @click="load=true;dialog=false"
          >
            Load
          </v-btn>
          <v-btn
            dark
            @click="load=false;dialog=false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
    
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {loaderOption} from "@/creator/Loader";

export default {
  
  name: "LoaderOption",
  data: ()=>({
    dialog: false,
    load: true,
  }),
  mounted() {
    window.LoaderOption = this;
  },
  computed: {
    option: {
      get() {
        return loaderOption;
      },
      // set(val) {
      //   Object.keys(val).forEach((it) => {
      //     loaderOption[it] = val[it];
      //   })
      //   console.log()
      // }
    }
  },
  methods: {
    updateOption() {
      console.log('option changed' , loaderOption)
    },
  }
  
}
</script>

<style scoped>

</style>