<template>
    <div class="dashboard">
        <PageHeader :content="header.content" :text="header.text" />
        <SideBar />
        
        <div class="grid dash-content">
            <div id="dashboard">
                <router-view @updateHeader="updatePageHeader"/>
            </div>

        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
    data() {
        return {
            header: {
                content: null,
                text: "Welcome back to Flashcard",
            }
        }
    },

    components: {
        SideBar,
        PageHeader
    },
    
    methods: {
        updatePageHeader({content, text}) {
            this.header.content = content
            this.header.text = text || "Welcome back to Flashcard"
        }
    }
}
</script>

<style lang="stylus" scoped>

#dashboard 
  padding-left 55px
  max-width calc(100vw - 55px)

.dashboard
  // padding-bottom 2rem
  display block
  // overflow hidden
  margin-bottom 0px
  padding-top 200px !important
  transition all .25s ease
  .vs-sidebar-content
    position fixed
    left 0
    top 0
    height 100vh
  .sidebar
    position absolute
    right 0px !important
    left auto
    top 200px
    width auto
    background transparent
    z-index 1200
    max-height calc(100vh - 470px)
    overflow auto
    transition 0s !important
    > svg
      display none
    > .content-sidebar > .sidebar-links > li
      margin-top 0px !important
    .sidebar-links
      padding-top 0px !important
    &::-webkit-scrollbar
      width: 5px;
      height: 5px;
      display: none
    &::-webkit-scrollbar-thumb
      background: darken(#f4f7f8, 20%)
      border-radius: 5px;
    &::-webkit-scrollbar-thumb:hover
      background: darken(#f4f7f8, 30%)
    &.fixed
      position fixed !important
      top 55px !important
      z-index 10000 !important
      max-height calc(100vh - 270px)
    .sidebar-link,.sidebar-heading
      display none
    .sidebar-sub-headers
      display block !important
      margin-top 20px
      li
        a
          display block !important
          text-align right
          font-size .8rem
          padding 3px
          padding-right 25px
          opacity .6
          max-width 200px
          &:after
            content: ''
            position absolute
            top 50%
            transform translate(0,-50%)
            right 25px
            left auto
            width 5px !important
            background getVar(theme-color)
            height 5px !important
            transition all .25s ease
            border-radius 10px
            opacity 0
          &.active
            padding-right 39px
            opacity 1
            &:after
              opacity 1
          &:hover
            opacity 1
  .content__default
    h1
      display none !important
  .content__default
    margin 0 auto
</style>