<template>
    <div class="dash-deck">
        <div class="grid">
            <vs-row align="center" justify="space-between" ref="dashdeck">
                <CreateDeck />
                <Deck v-for="deck in decks" :key="deck.deck_id" :deck="deck" :ref="`deck_${deck.deck_id}`"/>
            </vs-row>
        </div>
    </div>
</template>

<script>
import Deck from '@/components/DeckModel.vue'
import CreateDeck from '@/components/CreateDeck.vue'
import { mapState } from 'vuex'

export default {
    data () {
        return {
            deck_loaded: false,
        }
    },

    computed: {
        ...mapState({
            decks: state => state.deck.deck_data,
        })
    },

    async mounted () {
        this.$emit("updateHeader", {text: "Manage your <b>decks</b>"})
        const load = this.$vs.loading({
            target: this.$refs.dashdeck,
        })
    
        await this.$store.dispatch('deck/fetch_user_deck_data')
        
        this.deck_loaded = true
        load.close()
    },

    components: {
        Deck, CreateDeck
    }
}
</script>

<style scoped>

</style>