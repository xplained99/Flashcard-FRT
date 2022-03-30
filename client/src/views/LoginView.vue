<template>
  <div class="login">
    
    <div class="center grid">
       <vs-row>
        <vs-col offset="2" w="8">
          <LoginForm />
        </vs-col>
      </vs-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'HomeView',
  components: {
    LoginForm
  },

  mounted() {
    if (this.$store.state.auth.logged_in) {
      this.$router.push({"name": "dash.home"});
    }
  }
}
</script>
