<template>
  <v-card
    class="mx-auto overflow-y-auto"
    max-width="344"
    max-height="900"
    color="rgba(250, 250, 250, 0.5)"
  >
    <v-list-item>
      <v-list-item-content
      >
        <div class="overline mb-1" id="object-title">
          Object Info
        </div>
        
        <v-text-field
          readonly
          dense
          outlined
          label="uuid"
          :value="info.uuid"
        >
        </v-text-field>
        
        <div
          v-if="Object.keys(info.position).length > 0"
          class="overline">
          Position
        </div>
        <v-row>
          <v-col
            v-for="(ti, t) in Object.keys(info.position)"
            :key="t"
            :cols="12/Object.keys(info.position).length"
          >
            <v-text-field
              outlined
              dense
              :ref="ti"
              :label="ti"
              @change="updateScene"
              :rules="[rules.number]"
              :value="info.position[ti]"></v-text-field>
          </v-col>

        </v-row>
  
        <div
          v-if="Object.keys(info.model).length > 0"
        >
          Model
        </div>
        <v-row>
          <v-col
            v-for="(ti, t) in Object.keys(info.model)"
            :key="t"
            :cols="12/Object.keys(info.model).length"
          >
            <v-text-field
              outlined
              dense
              :ref="ti"
              :label="ti"
              @change="updateScene"
              :rules="[rules.number]"
              :value="info.model[ti]"></v-text-field>
          </v-col>
        </v-row>
  
        <div
          v-if="Object.keys(info.properties).length > 0"
          class="mb-2"
        >
          Properties
        </div>
        <v-list-item-title
          v-for="(ti,t) in Object.keys(info.properties)"
          :key="t"
          class="pt-2"
         >

              <v-textarea
                outlined
                rows="0"
                auto-grow
                :label="ti"
                :value="info.properties[ti]"
              ></v-textarea>

        </v-list-item-title>
      </v-list-item-content>
      

    </v-list-item>

    <v-card-actions
    class="ma-2"
    >
    <v-btn
      color="rgba(250,250,250,0.8)"
      @click="updateScene()"
    >
      Submit Change
    </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        dark
        color="rgba(0,0,0,0.6)"
        @click="hideInfoCard(false)"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {updateObjectPosition} from "@/viewers";

export default {
  name: "InfoCard",
  data(){
    return {
      show:false,
      info:{
        uuid: 'uuid',
        position:{},
        model:{},
        properties:{}
      },
      rules:{
        required: value => !!value || 'Required.',
        number: value => {
          const num = Number(value);
          return !isNaN(num) && isFinite(num) || 'Not a number';
        }
      },
    }
  },
  mounted() {
    window.InfoCard = this;
    this.hideInfoCard(this.show);
  },
  methods:{
    hideInfoCard(isShow) {
      this.show = isShow;
      let e = document.getElementById('info-card');
      e.style.display = isShow ? "block" : "none";
    },
    updateScene() {
      console.log(this.$refs)
      for(let k of Object.keys(this.info.position)) {
        this.info.position[k] = Number(this.$refs[k][0].lazyValue);
      }
      console.log(this.info.position)
  
      for(let k of Object.keys(this.info.model)) {
        this.info.model[k] = Number(this.$refs[k][0].lazyValue);
      }
      updateObjectPosition(this.info.uuid, this.info.position, this.info.model);
    },

  }
}
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>