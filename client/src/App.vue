<template>
  <div id="app">    
    <router-view/>
  </div>
</template>

<script>
import 'boxicons/css/boxicons.min.css'
import 'vuesax/dist/vuesax.css'
import CookieNotification from '@/components/misc/CookieNotification.vue'

export default {
  data () {

    return {
      
    }
  },

  mounted() {
    if (this.$store.getters.cookies_prompt) {
      this.$vs.notification({
          duration: 'none',
          content: CookieNotification,
          sticky: true,
          buttonClose: false,
      });
    }
  },

  computed: {
    
  },

  methods: {
  },

  components: {
  }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  flex-wrap: wrap;
}

[vs-theme=dark] {
  background-color: rgba(var(--vs-background), 1);
}

</style>

<style lang="stylus">
[vs-theme=dark] {
  * {
        color: #fff;
    }
}
</style>