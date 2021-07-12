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
              <v-card-title
                class="px-5 py-1"
              >
                Token {{ id }}
              </v-card-title>
              <v-spacer></v-spacer>
  
              <!--          delete confirm                 -->
              <DeleteDialog :token="t.token"></DeleteDialog>

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
            <v-row>
              <v-spacer></v-spacer>
              <v-btn
                v-if="t.count > 0"
                class="mx-3 mb-3"
                small
                color="success"
                :to="'/viewboard/'+t.token"
              >
                {{ t.count }} alive
              </v-btn>
              <v-btn
                v-else
                class="mx-3 mb-3"
                small
                color="grey lighten-2"
                :to="'/viewboard/'+t.token"
              >
      
                inactive
              </v-btn>
  
            </v-row>
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
import {urls} from '@/sensitiveInfo'
import Snackbar from "@/components/Snackbar";
import DeleteDialog from "@/components/DeleteDialog";

export default {
  
  name: "Workspace",
  components: {Snackbar, DeleteDialog},
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
        this.username = res.user.username;
        this.email = res.user.email;
  
        this.loading = false;
        for (let t of res.tokens) {
          const countRes = await fetch(urls.tokenConn + '?token=' + t.token + '&count=1&alive=1');
          const count = await countRes.json();
          this.tokens.push({token: t.token, description: t.description, count: count});
        }
      }
    
    
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
      this.$refs.snackbar.timeout = 2000;
      this.$refs.snackbar.text = text;
      this.$refs.snackbar.show = true;
    }
  }
}
</script>

<style scoped>

</style>