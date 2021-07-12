<template>
  <v-container>
    <v-row class="mb-10">
  
      <v-col class="col-1 col-xl-2">
      </v-col>
      <v-col class="col-10 col-xl-8">
    
        <h1 class="mt-15 my-5">
          Token: {{ token }}
        </h1>
        <v-row class="my-5 mx-1">
      
          <h2> Alive Users</h2>
          <v-spacer></v-spacer>
          <v-chip color="green" dark>
            {{ alive.length }}
          </v-chip>
        </v-row>
        <v-card
          v-for="(t, id) in alive" :key="id"
          class="my-5 elevation-9"
        >
          <v-card-title class="font-weight-bold">
            {{ t.identity }}
          </v-card-title>
          <v-card-text>
            {{ t.socket }}
          </v-card-text>
          <v-chip color="success" small class="ma-4"> ALIVE</v-chip>
        </v-card>
        <v-row class="my-5 mx-1">
      
          <h2>History connections </h2>
          <v-spacer></v-spacer>
          <v-chip>
            {{ count }}
          </v-chip>
        </v-row>
        <v-btn
          v-if="table.button"
          @click="showAll"
          color="white"
          class="elevation-9 my-5 mb-15"
        >
          Show All
        </v-btn>
        <v-data-table
          v-else-if="this.count > 0"
          :loading="table.loading"
          :headers="table.headers"
          :items="all"
          :items-per-page="10"
          class="elevation-9 my-5 mb-15"
        >
          <template v-slot:item.alive="{ item }">
            <v-chip
              :color="getColor(item.alive)"
              dark
              small
            >
              {{ item.alive }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {urls} from "@/sensitiveInfo";

export default {
  name: "ViewBoard",
  props: {
    token: String
  },
  data: () => ({
    count: "Connect Error",
    all: [],
    alive: [],
  
    table: {
      headers: [
        {text: 'Alive', align: 'start', value: 'alive'},
        {text: 'Identity', value: 'identity'},
        {text: 'Socket.id', value: 'socket'},
        {text: 'Create', value: 'created'},
        {text: 'Update', value: 'updated'},
      ],
      loading: false,
      button: false,
    }
  }),
  async mounted() {
    await this.refresh();
  },
  methods: {
    async refresh() {
  
      const aliveRes = await fetch(urls.tokenConn + '?token=' + this.token + '&alive=1');
      this.alive = await aliveRes.json();
  
      const allRes = await fetch(urls.tokenConn + '?token=' + this.token + '&count=1');
      const res = await allRes.json();
      console.log(res);
      this.count = res.count;
      this.table.button = !!this.count;
      // console.log(this.count)
    },
    async showAll() {
      this.table.button = false;
      this.table.loading = true;
  
      const allRes = await fetch(urls.tokenConn + '?token=' + this.token);
      let all = await allRes.json();
  
      this.all = all.reverse();
      this.table.loading = false;
    },
    getColor(it) {
      if (it) return "green";
      else return "grey"
    }
  }
}
</script>

<style scoped>

</style>