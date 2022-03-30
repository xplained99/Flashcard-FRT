import api from '@/services/api'

export default {
    async get_deck_review(deck_id) {
        return await api.get("/review/" + deck_id)
    },

    async get_review_card(deck_id) {
        return await api.get("/review/cards/" + deck_id + "/")
    },

    async post_review(deck_id, {card_id, response}) {
        return await api.post("/review/cards/" + deck_id + "/", {card_id, response})
    },
}