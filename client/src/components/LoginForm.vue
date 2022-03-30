<template>
    <div class="center" refs="login_form">
      <vs-dialog v-bind:loading="loading" not-close prevent-close v-model="active">
        <template #header>
          <h4 class="not-margin">
            Welcome to <b>Flashcard</b>
          </h4>
        </template>


        <div class="con-form">
            <vs-input 
                v-model="data.username" 
                label-placeholder="Username"
                v-bind:danger="!!errors.username"
                v-bind:state="errors.username ? 'danger' : null"
            >
                <template v-if="errors.username" #message-danger>
                    {{errors.username}}
                </template>
                <template #icon>
                    <i class='bx bxs-user'></i>
                </template>
            </vs-input>

            <vs-input 
                type="password" 
                v-model="data.password" 
                label-placeholder="Password"
                v-bind:danger="!!errors.password"
                v-bind:state="errors.password ? 'danger' : null"
            >
                <template v-if="errors.password" #message-danger>
                    {{errors.password}}
                </template>
                <template #icon>
                    <i class='bx bxs-lock'></i>
                </template>
            </vs-input>

          <div class="flex">
            <vs-checkbox v-model="data.save_auth">
                <template #icon>
                    <i class='bx bx-check' ></i>
                </template>
                Keep me logged in
            </vs-checkbox>
            <ThemeToggle />
          </div>
        </div>

        <template #footer>
          <div class="footer-dialog">
            <vs-button 
              block 
              @click="login"
            >
              Sign In
            </vs-button>

            <div class="new">
              Don't have one? <router-link :to="{'name': 'create'}">Create an account</router-link>
            </div>
          </div>
        </template>
      </vs-dialog>
    </div>
</template>

<script>
import ThemeToggle from '@/components/ThemeToggle.vue';
import auth from '@/services/api/auth'

export default {
    setup() {
        
    },

    data () {
        return {
            active: false,
            loading: true,
            data: {
                username: '',
                password: '',
                save_auth: false,
            },
            errors: {
                username: null,
                password: null,
            }
        }
    },

    methods: {
        async check_inputs() {
          let u = this.data.username.trim().length
          let p = this.data.password.trim().length
          if (u == 0) {
            this.errors.username = "Username cannot be empty";
          } else if (u < 4 || u > 20) {
            this.errors.username = "Invalid username"
          }

          if (p == 0) {
            this.errors.password = "Password cannot be empty";
          } else if (p < 6) {
            this.errors.password = "Invalid password"
          }
        },

        async display_errors(errors) {
          for (var i in errors) {
              var param = errors[i]
              
              for (var j = 0; j < param.loc.length; j++) {
                if (param.loc[j] in this.errors) {
                  this.errors[param.loc[j]] = param.msg
                }
              }
            }

            this.$vs.notification({
                flat: true,
                color: 'danger',
                duration: 'none',
                sticky: true,
                icon: "<i class='bx bx-error' ></i>",
                position: "top-right",
                title: 'Unable to sign in',
                text: `There was an error trying to signin. Please try again.`
            })

            this.loading = false;
        },

        async login() {
            this.loading = true
            this.errors = {username: null, password: null}

            await this.check_inputs()
            if (!Object.values(this.errors).every(o => o === null)) {
              this.loading = false;
              return;
            }
            
            try {
              const res = await auth.login({...this.data})
              const data = res.data
              if (data.error) {
                await this.display_errors(data.errors);
              }
              
              this.$store.commit('auth/updateSaveAuth', {store_refresh_token: this.data.save_auth})
              this.$store.commit('auth/updateRefreshToken', {...data.data})
              this.$store.commit('auth/updateAccessToken', {...data.data})
              this.$router.push({'name': 'dash.home'})
              window.EventBus.$emit("login")
            } catch (err) {
              const e = err.response.data;
              if (e.validation_error) {
                await this.display_errors(e.validation_error.body_params)
              } else if (e.errors) {
                await this.display_errors(e.errors)
              }
            }
        }
    },

    mounted() {
        this.loading = false
        this.active = true
    },

    components : {
      ThemeToggle
    }
}
</script>

<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
  .con-form
    width 100%
    .flex
      display flex
      align-items center
      justify-content space-between
      a
        font-size .8rem
        opacity .7
        &:hover
          opacity 1
    .vs-checkbox-label
      font-size .8rem
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
  </style>