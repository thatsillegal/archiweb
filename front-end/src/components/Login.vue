<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex class="login-form text-center"
      >
        <h1 class="my-5">
          <v-icon color="black">mdi-briefcase</v-icon>
          ArchiWeb Workspace
        </h1>
        
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
          <v-form>
            <v-text-field v-model='user.username' light prepend-icon='mdi-account'
                          label='Username'></v-text-field>
            
            <v-text-field v-if='!options.isLoggingIn' v-model='user.schoolid' light prepend-icon='mdi-school'
                          label='School ID' hint="学校统一账户ID，其中邮件服务可用于找回密码"
                          type='number'></v-text-field>
            <v-text-field v-model='user.password' light prepend-icon='mdi-lock' label='Password'
                          type='password'></v-text-field>
            
            <v-checkbox v-if='options.isLoggingIn' v-model='options.shouldStayLoggedIn' black label='Stay logged in?'
            ></v-checkbox>
            <v-btn v-if="options.isLoggingIn" @click.prevent="onSubmit()" block type="submit" rounded large dark>Sign
              in
            </v-btn>
            <v-btn v-else block type="submit" @click.prevent="options.isLoggingIn = true; onSubmit();" rounded large
                   dark>Sign up
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
      schoolid: '230198403',
      password: 'admin',
      username: 'example',
    },
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: true,
    }
  }),
  methods: {
    onSubmit: async function () {
      console.log(this.user);
      const requestOption = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.user)
      }
      const response = await fetch("http://127.0.0.1:277181")
    }
  }
}

</script>

<style scoped>
.login-form {
  max-width: 450px
}

</style>