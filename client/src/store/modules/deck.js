import deck from '@/services/api/deck'
import cardsAPI from '@/services/api/cards'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        user_decks: [],
        deck_data: {

        },
    },

    getters: {
        
    },

    mutations: {    
        updateUserDecks(state, d) {
            state.user_decks = d;
        },

        addDeck(state, deck) {
            deck.deck_img = deck.deck_img || "default"
            let index = state.user_decks.findIndex((i) => i.id == deck.deck_id)
            const res = (({deck_id, deck_title, last_review}) => ({
                id: deck_id, title: deck_title, last_review: new Date(last_review)
            })) (deck)

            if (index != -1) 
                state.user_decks.push(res)
            else 
                state.user_decks[index] = res

            
            Vue.set(state.deck_data, deck.deck_id, deck)
        },

        removeDeck(state, deck_id) {
            Vue.delete(state.deck_data, deck_id)
        },

        updateDeck(state, {deck_id, ...attrs}) {
            let deck = {...state.deck_data[deck_id]}
            for(let key in attrs)
                deck[key] = attrs[key]

            Vue.set(state.deck_data, deck.deck_id, deck)
            let index
            
            if ( ('deck_title' in attrs) && (index = state.user_decks.findIndex((i) => i.id == deck.deck_id)) != -1) {
                deck = state.user_decks[index]
                Vue.set(state.user_decks, index, {...state.user_decks[index], title: attrs.deck_title})
            }
        },

        addCard(state, {deck_id, ...card}) {
            let deck = state.deck_data[deck_id]
            deck.cards.push(card)
        }
    },

    actions: {
        async init() {
        },

        async fetch_user_deck_list({commit}) {
            const res = await deck.get_deck_ids()
            let decks = res.data.data.map(({id, title, last_review}) => {
                return {
                    id, title, last_review: new Date(last_review)
                }
            })

            commit('updateUserDecks', decks)            
        },

        async fetch_user_deck_data({commit}) {
            const res = await deck.get_user_decks()
            let decks = res.data.data;

            decks.map((d) => commit('addDeck', d))
        },

        async delete_deck({commit}, deck_id) {
            await deck.delete_deck(deck_id)
            commit('removeDeck', deck_id)
        },

        async fetch_card_data({commit, state}, deck_id) {
            if (deck_id in state.deck_data)
                return state.deck_data[deck_id]
            
            const d = (await deck.get_deck_data(deck_id)).data.data
            commit('addDeck', d)

            return d
        },

        async fetch_deck_cards({commit, state, dispatch}, deck_id) {
            if (!(deck_id in state.deck_data))
                await dispatch('fetch_card_data', deck_id)
            
            if (!(state.deck_data[deck_id].cards)) {
                const cards = (await cardsAPI.get_cards(deck_id)).data.data
                commit('updateDeck', {deck_id, cards})
            }

            return state.deck_data[deck_id].cards
        },

        async update_card({commit, state}, {deck_id, card_id, card_front, card_back}) {
            let deck = state.deck_data[deck_id]
            let cards = deck.cards.map((c) => {
                return c.card_id == card_id ? {
                    card_id, card_front, card_back
                } : c
            })
            
            commit('updateDeck', {deck_id, cards})
        },

        async delete_card({commit, state}, {deck_id, card_id}) {
            let deck = state.deck_data[deck_id]
            let cards = deck.cards.filter((c) => {
                return c.card_id != card_id
            })

            commit("updateDeck", {deck_id, cards})
        }
    }
}