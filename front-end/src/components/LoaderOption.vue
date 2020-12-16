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
            label="成组"
            value="grouped"
          ></v-radio>
          <v-spacer></v-spacer>
          <v-radio
            label="融合"
            value="merged"
          ></v-radio>
          <v-spacer></v-spacer>
          <v-radio
            label="原始"
            value="raw"
          ></v-radio>

        </v-radio-group>
  
        <h3>Other Options</h3>

          <v-row
            no-gutters
          >
            <v-col>
              <v-checkbox
                v-model="option.selectable"
                label="物件可选"
                @change="updateOption"
              ></v-checkbox>
            </v-col>
    
            <v-col>
              <v-checkbox
                v-model="option.doubleSide"
                label="双面材质"
                @change="updateOption"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row
            no-gutters
          >
            
            <v-col>
              <v-checkbox
                :disabled=!toCamera
                v-model="option.toCamera"
                label="朝向相机"
                @change="updateOption"
              ></v-checkbox>

            </v-col>

            <v-col>
              <v-checkbox
                :disabled=!ZtoY
                v-model="option.ZtoY"
                label="映射Y至Z"
                @change="updateOption"
              ></v-checkbox>
              
            </v-col>
          </v-row>
        <v-row
          no-gutters
        >
    
          <v-col>
            <v-checkbox
              v-model="option.shadow"
              label="阴影"
              @change="updateOption"
            ></v-checkbox>
    
          </v-col>
    
          <v-col>
            <v-checkbox
              :disabled=!edge
              v-model="option.edge"
              label="边线"
              @change="updateOption"
            ></v-checkbox>
    
          </v-col>
        </v-row>
  
  
  
        <v-card-actions
          class="px-0"
        >
          <v-spacer></v-spacer>
          <v-btn
            depressed
            @click="load=false;dialog=false"
          >
            Cancel
          </v-btn>
          <v-btn
            depressed
            color = "primary"
            @click="load=true;dialog=false"
          >
            Load
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
    toCamera:true,
    ZtoY:true,
    edge:true
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
      window.LoaderOption.toCamera=(loaderOption.status === "merged");
      window.LoaderOption.ZtoY=(loaderOption.status !== "raw");
      window.LoaderOption.edge=(loaderOption.status !== "raw");
      // console.log('option changed' , loaderOption)
    },
  }
  
}
</script>

<style scoped>

</style>