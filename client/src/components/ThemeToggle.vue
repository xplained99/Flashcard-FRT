<template>
    <div class="theme-toggle">
        <vs-tooltip not-arrow>
            <vs-switch 
                v-model="toggleTheme"
                dark
            >
                <template #off>
                    <i class='bx bxs-sun' ></i>
                </template>
                <template #on>
                    <i class='bx bxs-moon' ></i>
                </template>
            </vs-switch>
            <template #tooltip>
                Switch to {{toggleTheme ? 'light' : 'dark'}} theme
            </template>
        </vs-tooltip>
    </div>
</template>

<script>
export default {
    computed: {
        toggleTheme: {
            get() {
                return this.$store.state.theme.theme == "dark"
            },
            set(theme) {
                this.$store.dispatch('theme/toggleTheme', {theme: theme ? "dark" : "light"})
            }
        }
    },
}
</script>

<style scoped>
.theme-toggle {
    max-width: 60px;
    padding: 2px;
    max-height: 45px;
}

.theme-toggle i {
    font-size: 2em;
}
</style>