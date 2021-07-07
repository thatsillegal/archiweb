<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex class="login-form text-center"
      >
  
  
        <v-card light class="pa-5 my-5 px-10 elevation-9">
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
          <v-form v-if='!options.isLoggingIn'>
            <v-text-field v-model='user.username' light prepend-icon='mdi-account'
                          label='Username' :rules="rules.name" required></v-text-field>
      
            <v-text-field v-if='!options.isLoggingIn' v-model='user.email' light prepend-icon='mdi-school'
                          label='E-Mail' :rules="rules.email" required></v-text-field>
            <v-text-field v-model='user.password' light prepend-icon='mdi-lock' label='Password'
                          type='password' :rules="rules.password" required></v-text-field>
            <v-text-field v-if='!options.isLoggingIn' v-model='match' light prepend-icon='mdi-lock'
                          label='Repeat Password'
                          type='password' :rules="matchRule" required></v-text-field>
      
            <v-btn block type="submit" @click.prevent="onSubmit();" rounded large
                   dark>Sign up
            </v-btn>
    
          </v-form>
          <v-form v-else>
            <v-text-field v-model='user.username' light prepend-icon='mdi-account'
                          label='Username' required></v-text-field>
            <v-text-field v-model='user.password' light prepend-icon='mdi-lock' label='Password'
                          type='password' required></v-text-field>
            <v-checkbox v-if='options.isLoggingIn' v-model='options.shouldStayLoggedIn' black label='Stay logged in?'
            ></v-checkbox>
      
            <v-btn v-if="options.isLoggingIn" @click.prevent="onSubmit()" block type="submit" rounded large dark>Sign
              in
            </v-btn>
          </v-form>
  
        </v-card>
        
        <div v-if="options.isLoggingIn">
  
          Don't have an account?
          <v-btn light @click="options.isLoggingIn = false" class="blue-grey mx-5 lighten-4"> Sign up</v-btn>
        </div>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
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
        v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(v) || 'Password is not strong'
      ],
    
    },
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: true,
    },
  
  }),
  computed: {
    matchRule() {
      const rules = []
      const nospace =
        v => (v || '').indexOf(' ') < 0 ||
          'No spaces are allowed'
      
      rules.push(nospace)
      const match =
        v => (!!v && v) === this.user.password ||
          'Values do not match'
      
      rules.push(match)
      
      return rules
    },
  },
  
  methods: {
    onSubmit: async function () {
      if (this.options.isLoggingIn) {
        const requestOption = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({username: this.user.username, password: this.user.password})
        }
        const response = await fetch("http://127.0.0.1:27781/api/user/login", requestOption);
        const data = await response.json();
        console.log(data);
      } else {
        // console.log(this.user);
        const requestOption = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(this.user)
        }
        const response = await fetch("http://127.0.0.1:27781/api/user/insert", requestOption);
        const data = await response.json();
        console.log(data);
        if (data.code === 200)
          this.options.isLoggingIn = true;
        else
          alert(data.message);
      }
    }
  }
}

</script>

<style scoped>
.login-form {
  max-width: 450px
}

</style>