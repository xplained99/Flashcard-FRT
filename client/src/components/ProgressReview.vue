<template>
    <vs-row align="center" justify="center">
        <vs-col sm="4" xs="12" lg="4" class="box-bg">
            <p>Compare deck review progress</p>
            <vs-select
                filter
                :loading="chart.loader != null"
                multiple
                v-model="chartDeck"
                placeholder="Select decks to compare"
                style="width: 100%; max-width: unset;"
                v-if="loaded"
            >

                <vs-option :label="d.title" :value="d.id" v-for="d in decks" :key="d.id">
                    {{d.title}}
                </vs-option>
                
            </vs-select>
        </vs-col>
        <vs-col sm="12" xs="12" lg="12" ref="chart_dom">
            <LineChart :options="chart.options" :chartData="chart.data" :key="chart.chart_id"/>
        </vs-col>
    </vs-row>
</template>

<script>
import LineChart from '@/components/chart/LineChart.vue'
import ColorHash from 'color-hash'
import review from '@/services/api/review'
import {easingEffects} from 'chart.js/helpers'
import { mapState } from 'vuex'

var colorHash = new ColorHash()
let easing = easingEffects.easeInOutSine;
const totalDuration = 2000;
const duration = (ctx) => easing(ctx.index / 100) * totalDuration / 100;
const delay = (ctx) => easing(ctx.index / 100) * totalDuration;
const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

const animation = {
    x: {
        type: 'number',
        easing: 'linear',
        duration: duration,
        from: NaN, // the point is initially skipped
        delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
        }
        ctx.xStarted = true;
        return delay(ctx);
        }
    },
    y: {
        type: 'number',
        easing: 'linear',
        duration: duration,
        from: previousY,
        delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
        }
        ctx.yStarted = true;
        return delay(ctx);
        }
    }
};

export default {
    data() {
        return {
            chart: {
                options: {},
                data: {},
                decks: [],
                chart_id: -1,
                loader: null,
            },

            loaded: false,
        }
    },

    async mounted() {
        await this.$store.dispatch('deck/fetch_user_deck_list')
        this.chartDeck = this.decks.slice(0, 2).map(i => i.id)
        this.loaded = true
    },

    computed: {
        chartDeck: {
            set(value) {
                this.chart.decks = value
                let t = this
                this.generateChartData().catch(() => {
                    t.$vs.notification({
                        duration: 'none',
                        position: 'top-right',
                        sticky: false,
                        buttonClose: true,
                        icon: "<i class='bx bx-bell' ></i>",
                        color: 'danger',
                        title: 'Error',
                        text: 'Unable to load deck review data, please try again.',
                    })
                    t.reset_state();
                })
            },
            get() {
                return this.chart.decks
            }
        },
        ...mapState({
            decks: state => state.deck.user_decks.slice().sort((a, b) => (b.last_review - a.last_review)),
        })

    },

    methods: {
        async reset_state() {
            this.chart.loader && this.chart.loader.close()
            this.chart.chart_id = this.chart.decks.join(",")
            this.chart.loader = null;

        },

        async generateChartData() {
            this.chart.loader = this.$vs.loading({
                target: this.$refs.chart_dom,
                type: 'scale',
                text: 'Loading review...'
            })
            
            let decks_selected = await Promise.all(this.chartDeck.map(async (id) => {
                const res = await review.get_deck_review(id)
                return {
                    id,
                    title: this.decks.find((i) => i.id == id).title,
                    data: res.data.data
                }
            }));
            const min_length = Math.min(...decks_selected.map(i => i.data.length))

            this.chart.data = {
                datasets: decks_selected.map((r) => {
                    return {
                        borderColor: colorHash.hex(r.title),
                        data: r.data,
                        label: r.title,
                        tension: 0.4,
                        fill: true,
                    }
                })
            }
            console.log("this.chart.data", this.chart.data)

            this.chart.options = {
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: true,
                    title: {
                        display: true,
                        text: () => "My review progress overtime"
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                'millisecond': 'HH:mm',
                                'second': 'HH:mm',
                                'minute': 'HH:mm',
                                'hour': 'HH:mm',
                                'day': 'DD/MM',
                                'week': 'ddd',
                                'month': 'MMM/YYYY',
                                'quarter': 'MMM/YYYY',
                                'year': 'YYYY',
                            },
                            unitStepSize: 10,
                        },

                    }
                },
                responsive: true,
                parsing: {
                    xAxisKey: 'reviewed_on',
                    yAxisKey: 'review_score'
                },
            }

            if (min_length > 50) {
                this.chart.animation = animation
            }

            await this.reset_state()
        }
    },

    components: {
        LineChart
    }
}
</script>

<style scoped>

.box-bg {
    padding: 10px;
    text-align: center;
    background: rgba(var(--vs-gray-3), 1);
    border-radius: 10px;
    cursor: default;
    transition: all .25s ease;
    box-shadow: inset 0 0 0 0 rgb(0 0 0 / 10%);
    color: rgba(var(--vs-text), 1);
}
</style>