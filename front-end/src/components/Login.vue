<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex class="login-form text-center">
        <v-card light class="pa-5 ma-5 px-10 elevation-9">
          <v-card-text subheading>
            <template
              v-if="options.isLoggingIn"
            >
              Log in to your workspace
            </template>
            <template
              v-else
            >
              Create a new account
            </template>
          </v-card-text>
          <v-form v-if='!options.isLoggingIn' ref='form'>
            <v-text-field v-model='user.username' light prepend-icon='mdi-account'
                          label='Username' :rules="rules.name" required></v-text-field>
  
            <v-text-field v-if='!options.isLoggingIn' v-model='user.email' light prepend-icon='mdi-school'
                          label='E-Mail' :rules="rules.email" required></v-text-field>
            <v-text-field v-model='user.password' light prepend-icon='mdi-lock' label='Password'
                          :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append="() => (value = !value)"
                          :type="value ? 'password' : 'text'"
                          counter
                          :rules="rules.password" required></v-text-field>
            <v-text-field v-if='!options.isLoggingIn' v-model='match' light prepend-icon='mdi-hello'
                          label='Repeat Password'
                          :type="value ? 'password' : 'text'"
                          :rules="matchRule" required class="mb-5"></v-text-field>
  
            <v-btn block type="submit" @click.prevent="onSubmit();" rounded large
                   dark>Sign up
            </v-btn>

          </v-form>
          <v-form ref='form' v-else>
            <v-text-field v-model='user.username' light prepend-icon='mdi-account'
                          label='Username' required></v-text-field>
            <v-text-field v-model='user.password' light prepend-icon='mdi-lock' label='Password'
                          :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append="() => (value = !value)"
                          :type="value ? 'password' : 'text'"

                          required></v-text-field>
            <v-checkbox v-if='options.isLoggingIn' v-model='options.shouldStayLoggedIn' black label='Stay logged in?'
            ></v-checkbox>
  
            <v-btn v-if="options.isLoggingIn" @click.prevent="onSubmit()" block type="submit" rounded large dark>Sign
              in
            </v-btn>
          </v-form>

        </v-card>
  
        <div v-if="options.isLoggingIn">
    
          Don't have an account?
          <v-btn light @click="options.isLoggingIn = false" class="blue-grey mx-5 lighten-5" rounded> Sign up</v-btn>
        </div>
        <div v-else @click="options.isLoggingIn = true">
          <v-btn class="white elevation-0 mr-2" rounded large>
            <v-icon>mdi-arrow-left</v-icon>
            <u>go back</u>
          </v-btn>
        </div>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import storage from '@/storage'
import {urls} from '@/sensitiveInfo'

export default {
  name: "Login",
  data: () => ({
    value: true,
    user: {
      // email: '',
      // password: '',
      // username: '',
      email: 'example@example.org',
      password: 'admin',
      username: 'example',
    },
    match: '',
    rules: {
      name: [
        v => !!v || 'Name is required',
        v => v.length <= 20 || 'Name must be less than 10 characters',
      ],
      email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      password: [
        v => !!v || 'Password is required',
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
        v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(v) || 'Password is weak. At least use [0-9]&[a-z]&[A-Z].'
      ],
  
    },
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: true,
    },
  
  }),
  computed: {
    matchRule() {
      return [
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
        v => (!!v && v) === this.user.password || 'Values do not match'
      ]
    },
  },
  mounted() {
    let user = storage.get('username');
    if (user) {
      this.$router.push('/workspace');
    }
  },
  
  methods: {
    onSubmit: async function () {
      let val = this.$refs.form.validate();
      if (val === false) return;
      if (this.options.isLoggingIn) {
        const requestOption = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({username: this.user.username, password: this.user.password})
        }
        const response = await fetch(urls.login, requestOption);
        const data = await response.json();
        console.log(data);
        if (data.code === 200) {
          if (this.options.shouldStayLoggedIn) {
            // expired in 5 days.
            storage.set('username', this.user.username, 60 * 24 * 5);
            storage.set('token', data.token, 60 * 24 * 5);
          } else {
            // expired in 0.1 minute.
            storage.set('username', this.user.username, 0.1);
            storage.set('token', data.token, 60);
          }
          await this.$router.push('/workspace');
        }
      } else {
        const requestOption = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(this.user)
        }
        const response = await fetch(urls.insertUser, requestOption);
        const data = await response.json();
        console.log(data);
        if (data.code === 200)
          this.options.isLoggingIn = true;
        else
          alert(data.message);
      }
    },
    
  }
}

</script>

<style scoped>
.login-form {
  max-width: 450px
}

</style>