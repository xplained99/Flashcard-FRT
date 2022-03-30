<template>
    <div class="create-deck">
        <vs-card type="5" class="create-deck-btn" @click="toggle_dialogue">
            <template #title>
            <h3>Add a new deck</h3>
            </template>
            <template #img>
            <img src="@/assets/plus-img.png" height="200px">
            </template>
            <template #text>
            <p>
                Create and add a new deck to your collections
            </p>
            </template>
            
        </vs-card>

        <vs-dialog :loading="dialogue.loading" prevent-close v-model="dialogue.active" @close="clear_data">
            <template #header>
            <h4 class="not-margin">
                Create a <b>new Deck</b>
            </h4>
            </template>


            <div class="con-form">
                <vs-input 
                    label-placeholder="Name your deck"
                    v-model="data.title"
                    :danger="!!errors.name"
                    :state="errors.name ? 'danger' : null"
                >
                    <template #icon>
                        <i class='bx bxs-edit'></i>
                    </template>
                    <template v-if="errors.name" #message-danger>
                        {{errors.name}}
                    </template>
                </vs-input>
                <p style="font-size: 0.8em">Choose deck image</p>
                <p>
                <vs-alert gradient color='danger' v-if="errors.img">
                    {{errors.img}}
                </vs-alert>
                </p>
                
                <input type="file" id="deck-img" @change="data_img" hidden ref="deck_img_input" accept="image/png">
                <vs-tooltip not-arrow>
                    <vs-avatar size="200" style="left: 20%; right: 0; cursor: pointer" ref="deck_img_preview" @click="upload_img" badge-position="top-right" badge :badge-color="data.img ? 'success': 'danger'">
                        <img :src="data.img || default_img_data" alt="">
                    </vs-avatar>

                    <template #tooltip>
                        Upload an image to change deck image    
                    </template>
                </vs-tooltip>
                

            </div>

            <template #footer>
            <div class="footer-dialog">
                <vs-button 
                block 
                @click="create_deck"
                >
                Create deck
                </vs-button>
            </div>
            </template>
        </vs-dialog>
    </div>

</template>

<script>
import {toBase64} from '@/services/misc'
import deckAPI from '@/services/api/deck'

export default {
    data() {
        return {
            dialogue: {
                active: false,
                loading: false,
            },

            data: {
                title: '',
                img: '',
            },
            errors: {
                name: null,
                img: null,
            },

            default_img_data: require('@/assets/default_tumbnail.png')
        }
    },

    methods: {
        toggle_dialogue() {
            this.dialogue.active = true
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
                flat: false,
                color: 'danger',
                duration: 60000,
                sticky: true,
                icon: "<i class='bx bx-error' ></i>",
                position: "top-right",
                title: 'Deck creation failed',
                text: `There was an error trying create a new deck. Please try again.`
            })

            this.dialogue.loading = false
            this.clear_data()
        },

        async create_deck() {
            this.dialogue.loading = true 
            this.errors.name = this.errors.img = null
            
            try {
                var res = await deckAPI.create_deck({name: this.data.title, img: this.data.img || "default"})
            } catch (err) {
                const e = (err.response && err.response.data) || {errors: []};
                if (e.validation_error) {
                    await this.display_errors(e.validation_error.body_params)
                } else if (e.errors) {
                    await this.display_errors(e.errors)
                }
                return 
            }

            const deck = res.data.data

            this.$store.commit('deck/addDeck', deck)
            this.dialogue.active = this.dialogue.loading = false
            this.$vs.notification({
                duration: 60000,
                color: 'success',
                position: 'bottom-right',
                title: 'Deck created',
                text: `Deck <b>${deck.deck_title}</b> has been created successfully`
            })
        },

        clear_data() {
            this.data.title = ''
            this.data.img = ''
            this.dialogue.loading = this.dialogue.active = false 
            this.errors.name = this.errors.img = null
            this.$refs.deck_img_input.value = ''
        },

        async data_img(e) {
            const file = e.target.files[0]

            if (file.type !== "image/png" || file.size / 1024 > 5) { // 6670
                this.$vs.notification({
                    duration: 60000,
                    color: 'danger',
                    position: 'top-center',
                    title: 'Invalid image file',
                    text: 'The file you have uploaded is invalid. You can only select a <b>PNG file</b> with a size <b>less than 5KB</b> as deck image'
                })

                return
            }

            const loading = this.$vs.loading({target: this.$refs.deck_img_preview})
            const img_b64 = await toBase64(file)
            this.data.img = img_b64

            loading.close()
        },

        upload_img() {
            this.$refs.deck_img_input.click()
        },
    },

    components: {
        
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