import api from '@/services/api'

export default {
    async ping() {
        return await api.get('/auth/ping');
    },

    async login({username, password}) {
        return api.post("/auth/token", {username, password});
    },

    async create({username, password}) {
        return api.post("/auth/create", {username, password});
    }
}