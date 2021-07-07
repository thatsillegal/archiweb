<template>
  <v-container>
    <v-layout d-flex align-center justify-center>
      <v-row class="my-16 mx-15 pt-16">
        <v-col class="text-center">
          <v-avatar size="256" class="grey lighten-1">
            <v-icon size="200" color="white">mdi-account</v-icon>
          
          </v-avatar>
          <v-list-item
            color="black">
            <v-list-item-content>
              <v-list-item-title class="text-h4 my-2">
                {{ username }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ email }}
              </v-list-item-subtitle>
            
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col class="px-5 mr-lg-16">
          
          <v-card
            v-for="(t, id) in tokens" :key="id"
            class="mx-0 my-5 elevation-9 pa-4"
            min-width="500"
          >
            <v-row class="d-flex align-end py-2">
              <v-card-title class="px-3 py-1">
                Token {{ id }}
              </v-card-title>
              <v-spacer></v-spacer>
              
              <v-btn :loading="loading" class="mx-3" color="error" plain>
                delete
              </v-btn>
            </v-row>
            
            <v-row class="d-flex align-start pb-3">
              
              <v-text-field
                class="ma-0 pa-0 text-subtitle-1 elevation-0"
                solo flat
                readonly
                :id="'textcopy-'+id"
                :value="t.token">
              </v-text-field>
              <v-spacer></v-spacer>
              <v-btn class="mx-3 mb-3" color="grey" plain @click="copy(id)">
                copy
              </v-btn>
            </v-row>
            
            <v-textarea
              label="Description"
              :value="t.description"
              rows="2"
              readonly outlined></v-textarea>
          </v-card>
          <v-btn large color="green" plain>
            <v-icon>mdi-plus</v-icon>
            <b>
              new token
            </b>
          </v-btn>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import storage from '@/storage';

export default {
  
  name: "Workspace",
  data: () => ({
    loading: false,
    username: '',
    email: '',
    tokens: [],
    
  }),
  async mounted() {
    let user = storage.get('username');
    if (!user) {
      await this.$router.push('/login');
    } else {
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: user})
      }
      const response = await fetch("http://127.0.0.1:27781/api/user/find", requestOption);
      const res = await response.json();
      console.log(res);
      res.tokens.forEach(t => {
        this.tokens.push({token: t.token, description: t.description});
      })
      this.username = res.user.username;
      this.email = res.user.email;
    }
  },
  methods: {
    async remove(token) {
      this.loading = true;
      
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: token})
      }
      const response = await fetch("http://127.0.0.1:27781/api/token/delete", requestOption);
      const res = await response.json();
      console.log(res);
      
      this.loading = false;
    },
    copy(id) {
      let selector = '#textcopy-' + id;
      console.log(selector)
      let text = document.querySelector(selector);
      console.log(text)
      text.setAttribute('type', 'text');
      text.select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        alert('Testing code was copied ' + msg);
      } catch (err) {
        alert('Oops, unable to copy');
      }
      window.getSelection().removeAllRanges()
    }
  }
}
</script>

<style scoped>

</style>