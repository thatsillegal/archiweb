<template>
  <v-dialog
    v-model="dialog"
    max-width="390"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mx-3"
        color="primary"
        v-bind="attrs"
        v-on="on"
        plain
        rounded
        :loading="loading"
      >
        change password
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 red--text text--darken-2">
        Dangerous Zone
      </v-card-title>
      <v-card-text>
        <v-form ref='form'>
          
          <v-text-field v-model='user.oldpwd' light label='Old Password'
                        counter
                        type="password"
                        required></v-text-field>
          <v-text-field v-model='user.newpwd' light label='New Password'
                        counter
                        type="password"
                        :rules="rules.password" required></v-text-field>
          <v-text-field v-model='user.match' light
                        label='Confirm new password'
                        type="password"
                        :rules="matchRule" required class="mb-5"></v-text-field>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="changePassword"
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
import storage from "@/storage";
import {urls} from "@/sensitiveInfo";

export default {
  name: "UpdatePwdDialog",
  data: () => ({
    loading: false,
    dialog: false,
    user: {
      oldpwd: '',
      newpwd: '',
      match: ''
    },
    rules: {
      password: [
        v => !!v || 'Password is required',
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
        v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(v) || 'Password is weak. At least use [0-9]&[a-z]&[A-Z].'
      ],
      
    }
  }),
  computed: {
    matchRule() {
      return [
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
        v => (!!v && v) === this.user.newpwd || 'Values do not match'
      ]
    },
  },
  methods: {
    reset() {
      this.loading = false;
      this.user.oldpwd = '';
      this.user.newpwd = '';
      this.user.match = '';
    },
    cancel() {
      this.dialog = false;
      this.reset();
    },
    async changePassword() {
      this.loading = true;
      let user = storage.get('username');
      let userToken = storage.get('token');
      
      if (!user || !userToken) {
        this.$parent.snackbarInfo("Please Login first.")
        this.logout()
      } else {
        
        
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Token", userToken);
        
        const requestOption = {
          method: "POST",
          headers: headers,
          body: JSON.stringify({username: user, oldpwd: this.user.oldpwd, newpwd: this.user.newpwd})
        }
        const response = await fetch(urls.updatePassword, requestOption);
        const res = await response.json();
        console.log(res);
        if (res.code === 200) {
          this.dialog = false;
          this.$parent.snackbarInfo("Update successful");
        } else {
          this.$parent.snackbarInfo(res.message);
          
        }
        this.reset();
        
      }
    }
  }
}
</script>

<style scoped>

</style>