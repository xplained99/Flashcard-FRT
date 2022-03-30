import api from '@/services/api'

export default {

    async get_cards(id) {
        return await api.get("/card/" + id + '/')
    },

    async update_card(id, {card_id, card_front, card_back}) {
        return await api.patch("/card/" + id + "/", {card_id, card_front, card_back})
    },

    async delete_card(id, {card_id}) {
        return await api.delete("/card/" + id + "/", {
            data: {
                card_ids: [card_id]
            }
        })
    },

    async add_card(id, card) {
        return await api.put("/card/" + id + "/", card)
    },

    async export_cards(id) {
        return await api.get("/deck/" + id + "/export/")
    }
}