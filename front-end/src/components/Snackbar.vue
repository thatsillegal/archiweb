<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="show"
      :timeout="timeout"
      :color="color"
      top
    >
      {{ text }}
      
      <template v-slot:action="{ attrs }">
        <v-btn
          :color="btnColor"
          text
          v-bind="attrs"
          @click="show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "Snackbar",
  data: () => ({
    text: '',
    show: false,
    timeout: 2000,
    color: "rgba(57,57,57,0.8)",
    btnColor: "pink"
  }),
  methods: {
    update(text, show) {
      console.log(text)
      this.text = text;
      this.show = show;
    }
  }
}
</script>

<style scoped>

</style>