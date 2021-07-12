<template>
  <v-dialog
    v-model="dialog"
    max-width="390"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mx-3"
        color="error"
        v-bind="attrs"
        v-on="on"
        plain
        :loading="loading"
      >
        delete
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 red--text text--darken-2">
        Dangerous Zone
      </v-card-title>
      <v-card-text>
        The token {{ token }} will be removed from database.
        This operation CANNOT be recovered.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="remove(token)"
          rounded
          :loading="loading"
        >
          Continue
        </v-btn>
        <v-btn
          color="red darken-1"
          text
          @click="cancel"
          rounded
        >
          cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import {urls} from "@/sensitiveInfo";

export default {
  name: "DeleteDialog",
  props: {
    token: String,
  },
  data: () => ({
    loading: false,
    dialog: false,
    
  }),
  methods: {
    async remove(token) {
      
      this.loading = true;
      
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: token})
      }
      const response = await fetch(urls.deleteToken, requestOption);
      const res = await response.json();
      console.log(res);
      if (res.code === 200) {
        this.dialog = false;
        this.$parent.$parent.refresh()
        this.$parent.$parent.snackbarInfo("Delete successful");
      } else {
        this.$parent.$parent.snackbarInfo("Error: " + res.message);
      }
      this.loading = false;
    },
    cancel() {
      this.dialog = false;
      // console.log(this.$parent.$parent);
      // console.log(this.$parent.$parent.refresh())
    }
  },
  
  
}
</script>

<style scoped>

</style>