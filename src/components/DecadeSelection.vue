<template lang="pug">
.selection-list.scrollbars(ref="scroller", @wheel="onScroll")
  .inner
    slot(name="before")
    .decade(
      v-for="(d, decade) in lifetables"
      , @click="selected = decade"
      , :class="{ selected: decade === selected }"
    )
      LifeMeter(:data="d", :size="100", :topPad="0", :risk-domain="riskDomain")
        template(#thumb)
          .decade-thumb
            span {{ decade }}'s
    slot(name="after")
</template>

<script>
import DataByYear from '@/data/human-history/all'
import LifeMeter from '@/components/LifeMeter'
import { scrollTo } from 'vue-scrollto'

function checkOverflow(el){
  let curOverflow = el.style.overflow

  if (!curOverflow || curOverflow === 'visible')
    el.style.overflow = 'hidden'

  let isOverflowing = el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight

  el.style.overflow = curOverflow

  return isOverflowing
}

const components = {
  LifeMeter
}

const computed = {
  selected: {
    get(){ return this.value }
    , set(val){ this.$emit('input', val) }
  }
}

const watch = {
  value: {
    handler(){
      this.focusSelected()
    }
    , immediate: true
  }
  , data(data, oldValue){
    if (!oldValue || !oldValue.length){
      this.focusSelected()
    }
  }
}

const methods = {
  onScroll( e ){
    if (checkOverflow(this.$refs.scroller)){
      e.preventDefault()
    }
    const el = this.$el
    if ( e.deltaY ){
      el.scrollLeft += e.deltaY
    }
  }
  , focusSelected(){
    this.$nextTick(() => {
      scrollTo('.selected', 500, {
        container: this.$el
        , x: true
        , y: false
        , offset: (el) => {
          return -(this.$el.offsetWidth - el.offsetWidth) / 2
        }
      })
    })
  }
}

export default {
  name: 'DecadeSelection'
  , props: [
    'value' // selected animal
    , 'riskDomain'
  ]
  , data: () => ({
    lifetables: DataByYear
  })
  , components
  , computed
  , watch
  , methods
}
</script>

<style lang="sass" scoped>
$height: 110px
.selection-list
  overflow: hidden
  width: 100%
  min-height: $height
  -webkit-overflow-scrolling: touch
  overflow-x: auto
  // border: 1px solid transparentize($grey, 0.8)

  .inner
    display: flex
    min-height: $height - 2px
    justify-content: space-between
    // flex-wrap: nowrap
  .decade
    flex: 0 0 auto
    text-align: center
    cursor: pointer
    transition: background 0.15s ease
    &:hover
      background-color: rgba(255, 255, 255, 0.05)
    &:active,
    &.selected
      transition: none
      background-color: $background // lighten($primary, 28)
      ::v-deep .dangers path
        stroke: $background // lighten($primary, 28)
  .gen-label
    margin-bottom: 1em
  >>>
    circle.outer
      fill: $black-bis
.decade-thumb
  height: 100%
  border-radius: 50%
  font-size: 19px
  line-height: 3.1
  text-align: center
  background: #dad1b7
  color: darken(#dad1b7, 62)
</style>
