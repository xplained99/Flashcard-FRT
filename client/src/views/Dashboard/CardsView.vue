<template>
    <div class="dash-cards">
        <div class="grid">
            <vs-row align="center" justify="space-around" ref="header">
            <p><b>Cards Count: </b> <span class="chip" style="background: rgba(var(--vs-success), 1)">{{this.loaded ? this.deck.cards_count : '...'}}</span></p>
            <p><b>Deck Score: </b> <span class="chip" style="background: rgba(var(--vs-twitter), 1)">{{this.loaded ? (this.deck.review_score == -1 ? 'NULL' : this.deck.review_score) : '...'}}</span></p>
            <p><b>Last Review: </b> <span class="chip">{{this.loaded ? this.deck.last_reviewed_on : '...'}}</span></p>
            <p><b>Created: </b> <span class="chip">{{this.loaded ? this.deck.created_on : '...'}}</span></p>
            </vs-row>
            <vs-row align="center" justify="center" style="padding-top: 50px;" v-if="this.loaded">
                <vs-col ref="cards" w="8" xs="12" sm="10" lg="8">
                  <template>
                    <vs-table
                        v-model="selected"
                    >
                        <template #header>
                            <div class="grid">
                                <vs-row>
                                    <vs-input v-model="search" border placeholder="Search"/>
                                </vs-row>
                                
                                <vs-row style="padding-top: 10px" justify="center">
                                    <vs-button-group>
                                        <vs-button
                                            flat
                                            style="min-width: 70px"
                                            animation-type="scale"
                                            @click="add_card_dialogue=!add_card_dialogue"
                                        >
                                            <i class='bx bx-plus' ></i>
                                            <template #animate >
                                            Add card
                                            </template>
                                        </vs-button>
                                        <vs-button
                                            gradient
                                            style="min-width: 60px"
                                            success
                                            animation-type="scale"
                                            :loading="export_load"
                                            @click="export_card"
                                        >
                                            <i class='bx bx-export' ></i>
                                            <template #animate >
                                            Export
                                            </template>
                                        </vs-button>
                                        <vs-button
                                            gradient
                                            style="min-width: 60px"
                                            primary
                                            disabled
                                            animation-type="scale"
                                            @click="import_card"
                                        >
                                            <i class='bx bx-import' ></i>
                                            <template #animate >
                                            Import
                                            </template>
                                        </vs-button>
                                    </vs-button-group>
                                </vs-row>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th sort @click="cards = $vs.sortData($event, cards, 'card_front');">
                                Card Front
                                </vs-th>
                                <vs-th sort @click="cards = $vs.sortData($event, cards, 'card_back')">
                                Card Back
                                </vs-th>
                                <vs-th sort @click="cards = $vs.sortData($event, cards, 'card_id')">
                                Id
                                </vs-th>
                            </vs-tr>
                        </template>
                <template #tbody>
                <vs-tr
                    :key="tr.card_id"
                    v-for="tr in $vs.getPage($vs.getSearch(cards, search), page, max)"
                    :data="tr.card_id"
                    open-expand-only-td
                >
                    <vs-td>
                        <vs-input :value="tr.card_front" v-if="selected.includes(tr.card_id)" :id="'card_' + tr.card_id + '_front'"/> <p v-else>{{tr.card_front}} </p>
                    </vs-td>
                    <vs-td>
                        <vs-input :value="tr.card_back" v-if="selected.includes(tr.card_id)" :id="'card_' + tr.card_id + '_back'"/> <p v-else>{{ tr.card_back }}</p>
                    </vs-td>
                    <vs-td>
                    {{ tr.card_id }}
                    </vs-td>

                    <template #expand>
                        <div class="grid">
                            <vs-row justify="flex-end">
                                <vs-button flat icon @click="edit_card(tr.card_id)" :id="'card_' + tr.card_id + '_edit_btn'">
                                    Edit card
                                </vs-button>
                                <vs-button border danger @click="delete_card(tr.card_id)" :id="'card_' + tr.card_id + '_remove_btn'">
                                    Remove card
                                </vs-button>
                            </vs-row>
                        </div>
                    </template>
                </vs-tr>
                </template>
                <template #footer>
                <vs-pagination v-model="page" :length="$vs.getLength($vs.getSearch(cards, search), max)" />
                </template>
            </vs-table>
            </template>
                </vs-col>
            </vs-row>
        </div>
        <vs-dialog not-center v-model="add_card_dialogue" :loading="add_card_loading">
            <template #header>
            <h4 class="not-margin">
                Add a new card
            </h4>
            </template>


            <div class="con-content">
                <vs-input v-model="new_card.front" label-placeholder="Card Front" style="padding-bottom: 25px"></vs-input>
                <vs-input v-model="new_card.back" label-placeholder="Card Back" style="padding-bottom: 10px"></vs-input>

                <vs-alert relief color="danger" style="padding-top: 10px">
                    <template #icon>
                        <i class='bx bxs-info-circle'></i>
                    </template>
                    Any HTML tags in card front & back will not be rendered.
                </vs-alert>
            </div>

            <template #footer>
            <div class="con-footer">
                <vs-button @click="add_card" primary>
                Submit
                </vs-button>
                <vs-button @click="new_card.front = new_card.back = ''; add_card_dialogue = false;" danger>
                Cancel
                </vs-button>
            </div>
            </template>
        </vs-dialog>
    </div>
</template>

<script>

import cardAPI from '@/services/api/cards'

export default {
    data () {
        return {
            deck_id: this.$route.params.deck_id,
            loaded: false,
            export_load: false,
            cards: [],
            search: '',
            selected: [],
            allCheck: false,
            page_: 1,
            max: 10,
            active: 0,
            disabled: {

            },
            add_card_dialogue: false,
            add_card_loading: false,
            new_card: {
                front: '',
                back: '',
            }
        }
    },

    computed: {
        deck() {
            return this.$store.state.deck.deck_data[this.deck_id]
        },

        page: {
            set(p) {
                this.page_ = p
                this.selected.length = 0
            },

            get() {
                return this.page_
            },
        }
    },

    watch: {
        deck(n) {
            this.cards = n.cards
        }
    },

    beforeMount() {
        this.$emit("updateHeader", {text: `Deck ID: ${this.deck_id}`})
    },

    methods: {
        async delete_card(card_id) {
            const btn = document.getElementById("card_" + card_id + '_remove_btn')

            const loading = this.$vs.loading({
                target: btn.firstChild,
                type: 'rectangle',
            })


            btn.disabled = true

            try {
                await cardAPI.delete_card(this.deck.deck_id, {
                    card_id,
                })

                this.$store.dispatch('deck/delete_card', {deck_id: this.deck.deck_id, card_id})
                this.selected = this.selected.filter((i) => {
                    i != card_id
                })
            } catch(err) {
                this.$vs.notification({
                    flat: false,
                    color: 'danger',
                    duration: 60000,
                    sticky: true,
                    icon: "<i class='bx bx-error' ></i>",
                    position: "top-right",
                    title: 'Card delete failed',
                    text: `Unable to remove the card id: <b>${card_id}</b>, please try again`
                })
            }

            btn.disabled = false
            loading.close()

        },

        async edit_card(card_id) {
            const btn = document.getElementById("card_" + card_id + '_edit_btn')

            const loading = this.$vs.loading({
                target: btn.firstChild,
                type: 'rectangle',
            })
            btn.disabled = true

            try {
                const res = await cardAPI.update_card(this.deck.deck_id, {
                    card_id,
                    card_front: document.getElementById('card_' + card_id + '_front').children[0].firstChild.value,
                    card_back: document.getElementById('card_' + card_id + '_back').children[0].firstChild.value,
                })

                const card = res.data.data
                this.$store.dispatch('deck/update_card', {deck_id: this.deck.deck_id, ...card})
                this.selected = this.selected.filter((i) => {
                    i != card_id
                })
            } catch(err) {
                this.$vs.notification({
                    flat: false,
                    color: 'danger',
                    duration: 60000,
                    sticky: true,
                    icon: "<i class='bx bx-error' ></i>",
                    position: "top-right",
                    title: 'Card update failed',
                    text: `Unable to update the card id: <b>${card_id}</b>, please try again`
                })
            }

            btn.disabled = false
            loading.close()
        },

        async add_card() {
            this.add_card_loading = true
            
            try {
                const res = await cardAPI.add_card(this.deck.deck_id, {
                    card_front: this.new_card.front,
                    card_back: this.new_card.back,
                })

                const card = res.data.data
                this.$store.commit('deck/addCard', {deck_id: this.deck.deck_id, ...card})

                this.new_card.front = this.new_card.back = ''
                this.add_card_dialogue = false
                this.$vs.notification({
                    flat: false,
                    color: 'success',
                    duration: 60000,
                    sticky: true,
                    icon: "<i class='bx bx-check' ></i>",
                    position: "top-right",
                    title: 'Card added',
                    text: `Card ID: ${card.card_id} addedd successfully`
                })
            } catch(err) {
                this.$vs.notification({
                    flat: false,
                    color: 'danger',
                    duration: 60000,
                    icon: "<i class='bx bx-error' ></i>",
                    position: "top-right",
                    title: 'Add card failed',
                    text: `Unable to add the card to the deck, please try again`
                })
            }

            this.add_card_loading = false
        },

        async export_card() {
            this.export_load = true
            
            try {
                await cardAPI.export_cards(this.deck_id)
                this.$vs.notification({
                    flat: false,
                    color: 'success',
                    duration: 60000,
                    sticky: true,
                    icon: "<i class='bx bx-loader' ></i>",
                    position: "top-right",
                    title: 'Export initiated',
                    text: `Export process has started. You will receive a mail with exported deck once done`
                })
            } catch(err) {
                this.$vs.notification({
                    flat: false,
                    color: 'danger',
                    duration: 60000,
                    icon: "<i class='bx bx-error' ></i>",
                    position: "top-right",
                    title: 'Export error',
                    text: `Unable to initiate export process, please try again`
                })
            }

            this.export_load = false
        },

        async import_card() {

        },
    },

    async mounted () {
        const load = this.$vs.loading({
            target: this.$refs.dashcards,
        })

        try {
            await this.$store.dispatch('deck/fetch_deck_cards', this.deck_id)
        } catch(err) {
            this.$vs.notification({
                flat: true,
                color: 'danger',
                sticky: true,
                icon: "<i class='bx bx-error' ></i>",
                position: "top-right",
                title: 'Deck not found',
                text: `Unable to load the deck with Deck ID: <b>${this.deck_id}</b>`
            })

            load.close()
            return 
        }
        this.$emit("updateHeader", {text: `Deck ${this.deck.deck_title}`})
        document.title = this.deck.deck_title + " cards"

        this.cards = this.deck.cards
        this.loaded = true
        load.close()
    },

    components: {

    }
}
</script>

<style scoped>
p {
    color: rgba(var(--vs-text), 1);
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

.con-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.con-content {
    justify-content: space-between;
    width: 100%;
}

.not-margin {
    margin: 0;
    font-weight: 400;
    padding: 10px 10px 0;
}
</style>

<style lang="stylus">
.vs-input-parent {
    width: 100%;
    .vs-input-content {
    width: 100%;
    .vs-input {
        width: 100%;
    }
}
}
</style>