<template>
  <v-card
    class="mx-auto overflow-y-auto"
    max-width="344"
    max-height="800"
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
        
        <div>
          Position
        </div>
        <v-row>
          <v-col cols="4">
            <v-text-field
              outlined
              dense
              ref="x"
              label="x"
              @change="updateScene"
              :rules="[rules.number]"
              :value="info.position[0]"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              outlined
              dense
              ref="y"
              label="y"
              @change="updateScene"
              :rules="[rules.number]"
              :value="info.position[1]"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              outlined
              dense
              ref="z"
              label="z"
              @change="updateScene"
              :rules="[rules.number]"
              :value="info.position[2]"></v-text-field>
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
        position:[0, 0, 0],
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
      let x = Number(this.$refs.x.lazyValue)
      let y = Number(this.$refs.y.lazyValue)
      let z = Number(this.$refs.z.lazyValue)
      this.info.position = [x, y, z];
      updateObjectPosition(this.info.uuid, this.info.position);
    },

  }
}
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>