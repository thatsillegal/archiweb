<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
  
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-1" id="object-title">
          Object Info
        </div>
        
        <v-list-item-title
          v-for="(ti,t) in info"
          :key="t"
          class="my-2">
          <v-row>
            <v-col cols="3">
              {{ti.title}}
            </v-col>
            <v-col cols="9">
              <v-list-item-subtitle>
              {{ti.content}}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
      

    </v-list-item>

  </v-card>
</template>

<script>
export default {
  name: "InfoCard",
  data(){
    return {
      info: [
        {title: "title", content: "tent"}
      ],
    }
  },
  mounted() {
    window.InfoCard = this;
  }
}
</script>

<style scoped>

</style>