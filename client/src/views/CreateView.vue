<template>
  <div class="login">
    
    <div class="center grid">
       <vs-row>
        <vs-col offset="2" w="8">
          <CreateForm />
        </vs-col>
      </vs-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CreateForm from '@/components/CreateForm.vue'

export default {
  name: 'HomeView',
  components: {
    CreateForm
  },

  mounted() {
    if (this.$store.state.auth.logged_in) {
      this.$router.push({"name": "dash.home"});
    }
  }
}
</script>
