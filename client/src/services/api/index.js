import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;
export async function intercept_api(store) {
    instance.interceptors.request.use(
        (config) => {
            const token = config.url == "/auth/token/refresh" ? store.state.auth.refresh_token : store.getters['auth/access_token']
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token; 
            }

            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )

    instance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const config = err.config;
            if (config.url !== "/auth/token" && err.response) {
                
                if (err.response.status === 401 && !config.retry) {
                    // Access Token got expired, try refreshing else initiate logout
                    config.retry = true;

                    if (config.url == "/auth/token/refresh") {
                        window.EventBus.$emit('logout', {error: 'Session expired'});
                        return Promise.reject(err);
                    }

                    try {
                        const rs = await instance.post("/auth/token/refresh");
                        const { access_token, refresh_token } = rs.data.data;
                        store.commit('auth/updateAccessToken', {access_token});
                        if (refresh_token) {
                            store.commit('auth/updateRefreshToken', {access_token});
                        }
                        
                        return instance(config);
                    } catch (_error) {
                        event.$emit('logout', {error: 'Session expired'});
                        return Promise.reject(_error);
                    }

                }
            }
            return Promise.reject(err);
        }
    )
}
