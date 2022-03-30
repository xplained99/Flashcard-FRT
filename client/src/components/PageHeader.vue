<template>
    <header ref="header" class="header-page">

      <div class="header__content">
        <div ref="flex" class="flex-header">

          <h1 ref="title" id="header-title">
            <component v-if="content" :is="content"> </component>
            <div v-else v-html="text"> </div>
          </h1>
        </div>
      </div>
    </header>
</template>

<script>
export default {
    props: {
        content: {
            default: null,
        },
        text: {
            default: "Welcome back",
        }
    },

}
</script>

<style lang="stylus" scoped>
[vs-theme=dark] .header-page
    background #141417
    color: white 
.header-page
  width calc((100vw - 50px))
  position absolute
  background  #eef2f5
  height auto
  border-radius 0px 0px 0px 30px
  transition background .25s ease, border-radius .25s ease
  top 0px
  left: 50px
  overflow hidden

  .header__content
    position relative
    display flex
    flex-direction column
    justify-content flex-end
    height 200px
    padding-top 0px
    padding-bottom 0px
    // transition background .25s ease
    background transparent
    padding 0px 40px !important
    &.con-table
      height auto !important
    .flex-header
      width 100%
      display flex
      align-items flex-end
      justify-content center
      margin-bottom 70px
      @media (max-width: 995px)
        margin-bottom -16px
        font-size 0.5em
    &:after
      content ''
      position absolute
      bottom 0px
      left 50%
      transform translate(-50%)
      width 0%
      height 100%
      z-index -1
      box-shadow 0px 0px 0px 0px rgba(0,0,0,.1)
      transition all .25s ease
    h1
      font-size 35px
      margin 0px
      padding 13px 0px
      // margin-bottom 70px
      padding-bottom 15px
      font-weight 600
    .interactive-links
      // margin-bottom 70px
      display flex
      align-items center
      justify-content center
      list-style none
      padding-bottom 13px
      margin 0px
      .divider
        position relative
        width 1px
        height 25px
        margin 0px 10px
      li
        button
          border 0px
          padding 0px
          position relative
          background transparent
          padding 0px
          margin 0px
          display flex
          align-items center
          justify-content center
          transition all .25s ease
          &:hover
            ul
              opacity 1
              visibility visible
              transform translate(0, calc(100% - 20px))
          ul
            list-style none
            padding 0px
            bottom 0px
            position absolute
            transform translate(0, calc(100% - 15px))
            border-radius 10px
            opacity 0
            visibility hidden
            transition all .25s ease
            li
              a
                padding 5px
                opacity .7
                &:hover
                  opacity 1
        a
          padding 4px 6px
          display flex
          align-items center
          justify-content center
          border-radius 7px
          margin 0px 1px
          transition all .25s ease
          &:hover
            transform translate(0,-2px)
            box-shadow 0px 5px 10px -5px rgba(0,0,0,.1)
        box-icon, svg
          max-width 18px



</style>