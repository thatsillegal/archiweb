<template>
  <v-container>
    <v-layout d-flex align-center justify-center>
      <v-row class="my-16 mx-2 mx-md-15 pt-16">
        <v-col class="text-center col-12 col-lg-6">
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
          <v-btn
            plain color="red"
            @click="logout"
            :loading="loading"
            rounded
          >
            Logout
          </v-btn>
        </v-col>
        <v-col class="px-md-5 col-12 col-lg-5">
      
          <v-card
            v-for="(t, id) in tokens" :key="id"
            class="mx-0 mb-10 elevation-9 pa-4"
          >
            <v-row class="d-flex align-end py-2">
              <v-card-title class="px-5 py-1">
                Token {{ id }}
              </v-card-title>
              <v-spacer></v-spacer>
          
              <!--          delete confirm                 -->
              <template>
                <v-dialog
                  v-model="del.dialog"
                  max-width="390"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-3"
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      plain
                      :loading="del.loading"
                    >
                      delete
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5 red--text text--darken-2">
                      Dangerous Zone
                    </v-card-title>
                    <v-card-text>
                      The token {{ t.token }} will be removed from database.
                      This operation CANNOT be recovered.
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="remove(t.token)"
                        rounded
                        :loading="del.loading"
                      >
                        Continue
                      </v-btn>
                      <v-btn
                        color="red darken-1"
                        text
                        @click="del.dialog = false"
                        rounded
                      >
                        cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
        
        
            </v-row>
            
            <v-row class="d-flex align-start pb-3">
              
              <v-text-field
                class="mx-2 pa-0 text-subtitle-1 elevation-0"
                solo flat
                readonly
                :id="'textcopy-'+id"
                :value="t.token">
              </v-text-field>
              <v-spacer></v-spacer>
              <v-btn class="mx-3 mb-3" color="grey" plain @click="copy(id, t.token)">
                copy
              </v-btn>
            </v-row>
        
            <v-textarea
              label="Description"
              :value="t.description"
              rows="2"
              auto-grow
              readonly outlined
        
            ></v-textarea>
          </v-card>
      
      
          <!--          create new token               -->
          <template>
            <v-row>
              <v-dialog
                v-model="add.dialog"
                persistent
                max-width="600px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    large color="green" plain
                    v-bind="attrs"
                    v-on="on"
                    :loading="loading" @click="add.dialog=true;add.loading = false;">
                    <v-icon>mdi-plus</v-icon>
                    <b>
                      new token
                    </b>
                  </v-btn>
                </template>
            
                <v-card class="ma-0">
                  <div class="d-flex align-end py-2">
                    <v-card-title class="px-5 py-1">
                      Create New Token
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn icon color="red" @click="add.dialog = false"
                           class="mx-3"
                           plain
                    >
                  
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
              
                  </div>
              
                  <v-textarea
                    outlined label="Description"
                    v-model="add.description"
                    class="mx-5">
              
                  </v-textarea>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="success darken-1"
                      text
                      rounded
                      @click="create"
                      class="mb-5"
                      :loading="add.loading"
                    >
                      Add
                    </v-btn>
              
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
    
    
        </v-col>
      </v-row>
    </v-layout>
    <Snackbar ref="snackbar"></Snackbar>

  </v-container>
</template>

<script>
import storage from '@/storage';
import {urls} from '@/testdata'
import Snackbar from "@/components/Snackbar";

export default {
  
  name: "Workspace",
  components: {Snackbar},
  data: () => ({
    loading: false,
    username: '',
    email: '',
    tokens: [],
    add: {
      dialog: false,
      description: 'default',
      loading: false,
    },
    del: {
      dialog: false,
      loading: false
    }
  }),
  async mounted() {
    await this.refresh();
  
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.tokens = [];
    
      let user = storage.get('username');
      if (!user) {
        await this.$router.push('/login');
      } else {
        const requestOption = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({username: user})
        }
        const response = await fetch(urls.findUser, requestOption);
        const res = await response.json();
        console.log(res);
        res.tokens.forEach(t => {
          this.tokens.push({token: t.token, description: t.description});
        })
        this.username = res.user.username;
        this.email = res.user.email;
      }
    
      this.loading = false;
    
    },
    async remove(token) {
      this.del.loading = true;
    
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: token})
      }
      const response = await fetch(urls.deleteToken, requestOption);
      const res = await response.json();
      console.log(res);
      if (res.code === 200) {
        this.del.dialog = false;
        await this.refresh();
        this.snackbarInfo("Delete successful");
      } else {
        this.snackbarInfo("Error: " + res.message);
      }
      this.del.loading = false;
    },
    async create() {
      this.add.loading = true;
      let user = storage.get('username');
    
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: user, description: this.add.description})
      }
      const response = await fetch(urls.createToken, requestOption);
      const res = await response.json();
      console.log(res)
      if (res.code === 200) {
        this.add.dialog = false;
        this.snackbarInfo("Create successful");
        await this.refresh();
      } else {
        this.snackbarInfo('Error: ' + res.message)
      }
      this.add.loading = false;
      this.add.description = "default";
    },
    copy(id, t) {
      let selector = '#textcopy-' + id;
      console.log(selector)
      let text = document.querySelector(selector);
      console.log(text.getAttribute('value'))
      text.setAttribute('type', 'text');
      text.select();
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        this.snackbarInfo('Token #' + id + ': ' + t + ' copied ' + msg);
      
        // alert('Testing code was copied ' + msg);
      } catch (err) {
        this.snackbarInfo('Oops, unable to copy');
      }
      window.getSelection().removeAllRanges()
    },
    logout() {
      storage.remove('username');
      this.$router.push('/login')
    },
    snackbarInfo(text) {
      // this.$refs.snackbar.update(text, true);
      this.$refs.snackbar.timeout = 1000;
      this.$refs.snackbar.text = text;
      this.$refs.snackbar.show = true;
    }
  }
}
</script>

<style scoped>

</style>