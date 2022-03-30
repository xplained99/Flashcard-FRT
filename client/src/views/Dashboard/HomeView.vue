<template>
    <div class="dash-home">
        <ProgressReview />
    </div>
</template>

<script>
import ProgressReview from '@/components/ProgressReview.vue'

export default {
    mounted () {
        window.$vs = this.$vs;
        this.$emit("updateHeader", {text: "Welcome back <b>Dote</b>"})
    },

    components: {
        ProgressReview,
    }
}
</script>

<style scoped>
.dash-home {
    padding-left: 55px;
}
</style>