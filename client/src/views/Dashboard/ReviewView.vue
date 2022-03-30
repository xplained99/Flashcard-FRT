<template>
    <div class="dash-deck">
        <div class="grid">
            <vs-row align="center" justify="space-between">
                <p><b>Deck: </b> <span class="chip" style="background: rgba(var(--vs-telegram), 1); color: white;">{{this.loaded ? this.deck.deck_title : '...'}}</span></p>
                <p><b>Progress: </b> <span class="chip" style="background: rgba(var(--vs-success), 1); ">{{this.loaded ? this.progress : '...'}} %</span></p>
            </vs-row>
            <vs-row align="center" justify="center" ref="dashdeck">
                <div style="padding-top: 100px; padding-right: 10px;" class="review">
                        <vs-card ref="review_card">
                            <template #text>
                            <div class="grid">
                                <vs-row>
                                    <div v-if="review">
                                        <h3 style="padding-top: 10px; min-height: 10px; min-width: 200px; max-width: 400px; color: white;" v-html="review.card_front"></h3>
                                    </div>
                                    <div v-else>
                                        <h3 style="padding-top: 10px; min-height: 10px; min-width: 200px; max-width: 400px; color: white;">{{loaded ? 'You have everything reviewed for today in this deck :D' : '...'}}</h3>
                                    </div>
                                </vs-row>
                            </div>
                            </template>
                        </vs-card>
                </div>
                <div style="padding-top: 100px;" class="review" v-if="show_back">
                        <vs-card ref="review_card">
                            <template #text>
                            <div class="grid">
                                <vs-row>
                                    <div v-if="review">
                                        <h3 style="padding-top: 10px; min-height: 10px; min-width: 200px; max-width: 400px; color: white;">{{review.card_back}}</h3>
                                    </div>
                                </vs-row>
                            </div>
                            </template>
                        </vs-card>
                </div>
                <div style="padding-top: 100px; padding-left: 10px;" class="review" v-if="review">
                        <vs-card >
                            <template #text>
                            <div class="grid">
                                <vs-row>
                                    <div v-if="show_back" style="padding-top: 10px;">
                                        <h3 style="color: white;">How was the card?</h3>
                                        <vs-button @click="card_review('again')" style="width: 90%;" gradient danger>Again</vs-button>
                                        <vs-button @click="card_review('hard')" style="width: 90%;" gradient warn v-if="review.status=='learned'">Hard</vs-button>
                                        <vs-button @click="card_review('good')" style="width: 90%;" gradient>Good</vs-button>
                                        <vs-button @click="card_review('easy')" style="width: 90%;" gradient success v-if="review.status != 'relearned'">Easy</vs-button>
                                    </div>
                                    <div v-else style="padding-top: 10px;">
                                        <vs-button gradient @click="show_back=true">Show Answer</vs-button>
                                    </div>
                                </vs-row>
                            </div>
                            </template>
                        </vs-card>
                </div>
            </vs-row>
        </div>
    </div>
</template>

<script>
import reviewAPI from '@/services/api/review'

export default {
    data () {
        return {
            loaded: false,
            review: null,
            show_back: false,
            deck: null,
            progress: -1,
        }
    },

    computed: {
        
    },

    async mounted () {
        this.$emit("updateHeader", {text: "<b>Review</b> your deck"})
        const load = this.$vs.loading({
            target: this.$refs.review_card,
        })
        
        if (!this.$route.params.deck_id) {
            this.$router.push({"name": "dash.deck"})
            return
        }

        await this.$store.dispatch('deck/fetch_card_data', this.$route.params.deck_id)
        this.deck = this.$store.state.deck.deck_data[this.$route.params.deck_id]

        try {
            const res = (await reviewAPI.get_review_card(this.deck.deck_id)).data.data;
            this.review = res.review
            this.progress = res.progress
        } catch(err){
            // pass
        }

        this.loaded = true
        load.close()
    },

    methods: {
        async card_review(rev) {
            const load = this.$vs.loading({
                target: this.$refs.review_card,
            })
            
            const res = (await reviewAPI.post_review(this.deck.deck_id, {card_id: this.review.card_id, response: rev})).data.data;
            this.review = res.review
            this.progress = res.progress

            this.loaded = true
            this.show_back = false
            load.close()
        }
    }
}
</script>

<style>
.card-txt {
    min-width: 400px;
    min-height: 400px;
}

.review .vs-card {
    background: rgba(var(--vs-twitch), 1);
}

.chip {
  display: inline-block;
  height: auto;
  padding: 5px;
  font-weight: 600;
  border-radius: 5px;
  background-color: rgba(var(--vs-gray-4), 1)/*#f1f1f1*/;
}

.content-tooltip.body {
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
.content-tooltip.body.vs-avatar-content{
    margin-top: -30px;
    border: 3px solid getVar('theme-layout');
    box-shadow: 0px 4px 15px 0px rgba(0,0,0,.1);
}
.content-tooltip.body.text {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: .55rem;
    padding: 10px;
    font-weight: normal;
}
.content-tooltip.body.text > span {
    font-weight: bold;
    font-size: .7rem;
}

.content-tooltip > footer {
    display: flex;
    align-items: center;
    justify-content: center;
}
.content-tooltip > h4 {
    padding: 8px;
    margin: 0px;
    text-align: left;
}
.content-tooltip > p {
    text-align: left;
    padding: 0px;
    margin: 0px;
    line-height: 1rem;
    padding-bottom: 5px;
    padding-left: 8px;
}
</style>