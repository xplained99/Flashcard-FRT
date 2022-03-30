<template>
    <vs-col w="4" xs="12" sm="6" class="deck-card">
        <vs-card type="3" ref="deck_card">
            <template #title>
                <h3>{{deck.deck_title}}</h3>
            </template>
            <template #img>
                <img :src="deck.deck_img == 'default' ? require('@/assets/default_tumbnail.png') : deck.deck_img" style="min-width: 150px;">
            </template>
            <template #text>
                <p><b>Last review</b> <span class="chip">{{deck.last_reviewed_on}}</span></p>
                <p><b>Created</b><span class="chip">{{deck.created_on}}</span></p>
                 <vs-button gradient @click="review_Card">
                     Review Card
                 </vs-button>
            </template>
            <template #interactions>
                <vs-tooltip shadow not-hover v-model="edit_tooltip">
                    <vs-button flat danger ico @click="edit_tooltip=!edit_tooltip">
                        <i class='bx bx-edit-alt'></i>
                    </vs-button>

                    <template #tooltip>
                        <div class="content-tooltip">
                            <h4 class="center">
                                Edit deck' name
                            </h4>
                            <p>
                                <vs-input v-model="edit.deck_name" placeholder="Deck name" />
                            </p>
                            <footer>
                                <vs-button danger block @click="edit_deck">
                                    Update
                                </vs-button>
                            </footer>
                        </div>
                    </template>
                </vs-tooltip>
                <vs-tooltip shadow not-hover v-model="del_tooltip">
                    <vs-button flat danger icon @click="del_tooltip=!del_tooltip">
                        <i class='bx bx-trash'></i>
                    </vs-button>

                    <template #tooltip>
                        <div class="content-tooltip">
                            <h4 class="center">
                                Confirm
                            </h4>
                            <p>
                                You are sure to delete this deck, by doing all the cards will be deleted and not be recovered
                            </p>
                            <footer>
                                <vs-button @click="delete_deck" danger block>
                                    Delete
                                </vs-button>
                                <vs-button @click="del_tooltip=false" dark block>
                                    Cancel
                                </vs-button>
                            </footer>
                        </div>
                        </template>
                </vs-tooltip>
                
                
                <vs-button class="btn-count" shadow primary @click="view_cards">
                    <i class='bx bx-coin-stack' ></i>
                    <span class="span">
                    {{deck.cards_count || 'No'}} Cards
                    </span>
                </vs-button>
            </template>
        </vs-card>
    </vs-col>
</template>

<script>
import deckAPI from '@/services/api/deck'

export default {
    data() {
        return {
            del_tooltip: false,
            edit_tooltip: false,
            edit: {
                deck_name: this.deck.deck_title,
            },
        }
    },

    props: ['deck'],

    methods: {
        async edit_deck() {
            this.edit_tooltip=false
            const load = this.$vs.loading({
                target: this.$refs.deck_card,
            })
            
            try {
                const res = await deckAPI.update_deck(this.deck.deck_id, this.edit.deck_name)
                this.$store.commit('deck/updateDeck', {deck_id: this.deck.deck_id, deck_title: res.data.data.deck_title})
            } catch (err) {
                this.$vs.notification({
                    flat: true,
                    color: 'danger',
                    duration: 60000,
                    icon: "<i class='bx bx-error' ></i>",
                    position: "top-right",
                    title: 'Failed to edit deck name',
                    text: `Unable to edit the deck name for <i>${this.deck.deck_title}</i>, ID: <b>${this.deck.deck_id}</b>, please try again`
                })
            }

            load.close()
        },

        async delete_deck() {
            this.del_tooltip=false
            const load = this.$vs.loading({
                target: this.$refs.deck_card,
            })
            await this.$store.dispatch('deck/delete_deck', this.deck.deck_id)
            load.close()
        },

        async view_cards() {
            this.$router.push({
                name: 'dash.cards',
                params: {
                    deck_id: this.deck.deck_id,
                }
            })
        },

        async review_Card() {
            this.$router.push({
                name: 'dash.review',
                params: {
                    deck_id: this.deck.deck_id,
                }
            })
        }
    },

}
</script>

<style>
.deck-card {
    padding: 5px;
} 

.deck-card .vs-card {
    cursor: unset;
}

.chip {
  display: inline-block;
  line-height: 14px;
  padding: 5px 20px;
  height: 30px;
  font-weight: 500;
  border-radius: 5px;
  background-color: rgba(var(--vs-gray-3), 1)/*#f1f1f1*/;
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