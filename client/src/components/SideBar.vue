<template>
    <div class="hidden">
      <vs-sidebar
        absolute
        hover-expand
        reduce
        v-model="active"
        open
        >
        <template #logo>
          <img src="@/assets/logo.png">
        </template>
        <vs-sidebar-item id="dash.home">
          <template #icon>
            <i class='bx bx-home'></i>
          </template>
          Home
        </vs-sidebar-item>
        <vs-sidebar-item id="dash.deck">
          <template #icon>
            <i class='bx bx-card'></i>
          </template>
          Cards &amp; Deck
        </vs-sidebar-item>
        <vs-sidebar-item id="dash.review">
          <template #icon>
            <i class='bx bx-pen'></i>
          </template>
          Review Cards
        </vs-sidebar-item>
        
        <template #footer>
          <vs-button
            gradient
            danger
            block
            style="width: 40%"
            animation-type="scale"
            @click="logout"
          >
            <i class='bx bx-log-out'></i>
            <template #animate >
              Sign out
            </template>
          </vs-button>
          <span class="toggle-btn">
            <ThemeToggle />
          </span>
        </template>
      </vs-sidebar>
      
    </div>
</template>

<script>
import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
    data() {
        return {

        }
    },

    computed: {
        active: {
          get() {
            return this.$route.name;
          },
          set(new_page) {
            console.log("pushing", new_page)
            this.$router.push({'name': new_page})
          }            
        },
    },

    methods: {
      logout() {
        window.EventBus.$emit("logout", {msg: 'User initiated'})
      }
    },

    components: {
        ThemeToggle
    }
}
</script>

<style scoped>
.vs-sidebar-content.reduce .toggle-btn {
  visibility: hidden;
}

.vs-sidebar-content .toggle-btn {
  visibility: visible;
}

.vs-sidebar-content.absolute {
  position: fixed !important;
}

</style>