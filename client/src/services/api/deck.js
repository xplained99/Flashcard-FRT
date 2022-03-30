import api from '@/services/api'

export default {
    async get_deck_ids() {
        return await api.get("/deck/list")
    },

    async create_deck({name, img}) {
        return await api.put("/deck/", {name, img})
    },

    async get_user_decks() {
        return await api.get("/deck/")
    },

    async delete_deck(id) {
        return await api.delete('/deck/' + id + '/')
    },

    async update_deck(id, deck_title) {
        return await api.patch("/deck/" + id + '/', {deck_title})
    },

    async get_deck_data(id) {
        return await api.get("/deck/" + id + '/', {id})
    },
}