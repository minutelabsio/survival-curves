<template lang="pug">
.home
  .section
    .container
      b-field
        b-select(v-model="selectedName")
          option(v-for="(d, y) in datasetList", :value="y") {{ y }}
      .columns.pad.is-flex-direction-row-reverse.is-desktop
        .column.negate-space.center-mobile
          b-field.toggle
            b-switch(v-model="showAlive", :true-value="false", :false-value="true") Only deaths
          StackedBarChart.chart(
            :animate="true",
            :width="plotWidth",
            :series="series",
            :xvalues="xvalues",
            :barMargin="0.1",
            :tick-format="showPercent ? '%' : null"
          )
            template(#under="{ xscale }")
              .poi(:style="{ transform: `translateX(${xscale(longevityStats.max)}px)` }")
                .on-axis
                  b-tooltip(:label="`longest living in batch: ${longevityStats.max.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.afterChildhood)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy after year 1: ${longevityStats.afterChildhood.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.expectation)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy: ${longevityStats.expectation.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
      //- .content.has-text-centered
      //-   h2.is-size-3.title Chance of Dying

      .columns.pad.is-flex-direction-row-reverse.is-desktop
        .column.center-mobile
          StackedBarChart.chart(
            :width="plotWidth",
            :series="[{ values: deathChance.map(v => v[1]), color: '#D03D49' }]",
            :xvalues="deathChance.map(v => v[0])",
            :range="[0, 1]",
            :barMargin="0",
            tick-format="%"
          )
  Footer
</template>

<script>
import VueAffixBox from 'vue-affix-box'
import { bin } from 'd3-array'
import _throttle from 'lodash/throttle'
import StackedBarChart from '@/components/StackedBarChart'
import LifeMeter from '@/components/LifeMeter'
import DataByYear from '@/data/human-history/all'
import ThumbImages from '@/assets/animal-thumb-map'
import AnimalSelection from '@/components/AnimalSelection'
import ResponsiveEmbed from '@/components/ResponsiveEmbed'
import Footer from '@/pages/Footer'

export default {
  name: 'Home'
  , components: {
    VueAffixBox
    , StackedBarChart
    , LifeMeter
    , AnimalSelection
    , Footer
    , ResponsiveEmbed
  }
  , data: () => ({
    datasetList: DataByYear
    , thumbs: ThumbImages
    , selectedName: '1810'
    , showPercent: true
    , plotWidth: 300

    , showDead: true
    , showAlive: true
  })
  , mounted(){
    const onResize = _throttle(() => {
      let w = Math.min(720, window.innerWidth)
      this.plotWidth = Math.floor(w - 2 * 50)
    }, 80)

    window.addEventListener('resize', onResize)
    onResize()

    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', onResize)
    })
  }
  , computed: {
    selected(){
      return this.datasetList[this.selectedName]
    }
    , lifetable(){ return this.selected.lifetable }
    , total(){ return this.lifetable[0][1] }
    , selectedThumb(){
      return ThumbImages[this.selectedName]
    }
    , bins(){
      return bin()
        .thresholds(Math.min(20, this.lifetable.length))
        .value(a => a[0])(this.lifetable)
    }
    , dataset(){
      let d = this.bins.map(a => a[0][1]) //.map(a => _meanBy(a, v => v[1]))
      if ( this.showPercent ){
        return d.map(v => v / this.total)
      }
      return d
    }
    , deathChance(){ return this.selected.deathChance }
    , xvalues(){
      return this.bins.map(b => b.x0)
    }
    , longevityStats(){ return this.selected.longevityStats }
    , oldestEver(){ return this.selected.maxLifetime }
    , dataDead(){
      let dataset = this.dataset
      return dataset.map((v, i) => i ? dataset[i - 1] - v : 1 - v).map(v => Math.max(v, 0))
    }
    , dataRemoved(){
      let dataset = this.dataset
      let dead = this.dataDead
      let showDead = this.showDead
      let count = this.showPercent? 1 : dataset[0]
      return dataset.map((v, i) => count - v - (showDead ? dead[i] : 0) )
    }
    , series(){
      return [
        {
          values: this.dataset
          , color: '#AEE4C9'
          , active: this.showAlive
        }
        , {
          values: this.dataDead
          , color: '#D03D49'
          , active: this.showDead
        }
        , {
          values: this.dataRemoved
          , color: '#e6e6e6'
          , active: this.showAlive
          // , color: '#D03D49'
          // , gapless: true
        }
      ]
    }
  }
  , methods: {
    selectAnimal(e, name){
      this.selectedName = name
    }
  }

}
</script>

<style lang="sass" scoped>
.footer,
.upper-section
  background: rgb(223, 246, 255)
  .content
    color: $black
    .title
      color: $newBlue
.toggle
  font-family: $family-monospace
  text-transform: uppercase
.animal-selector
  background: #fff6e1
  position: relative
  .is-fixed &
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25)
  &:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    pointer-events: none
    box-shadow: inset -2px 1px 2px #00000052
    @media screen and (min-width: 1210px)
      box-shadow: none
  .sel
    max-width: 1280px
    margin: auto


  ::v-deep .dangers path
    stroke: #fff6e1
.center-mobile
  @media screen and (max-width: $desktop)
    display: flex
    flex-direction: column
    align-items: center

.survivors
  color: #7dd4a9
.deaths
  color: #D03D49
.highlight
  color: $grey
  font-weight: bold
  text-decoration: underline
.negate-space
  @media screen and (min-width: $desktop)
    margin-top: -2.2rem

.pad
  margin-top: 1rem
.chart
  max-width: 100%
  // overflow: hidden
  margin: 0.5rem 0px 0 0
  font-family: $family-monospace

  @media screen and (max-width: $desktop)
    margin-left: 3ex
    margin-right: 0

.animal-select
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
.poi
  position: absolute
  bottom: 0
  left: 0
  line-height: 1
  text-align: center
  width: 50px
  margin-left: -25px
  .on-axis
    position: absolute
    top: 0
    left: 0
    transform: translate(23px, -30px)
  .nib
    width: 11px
    height: 11px
    background: $newBlue
    border-radius: 50%
    animation: swell 2s infinite

@keyframes swell
  $start: transparentize($newBlue, 0.1)
  $end: transparentize($newBlue, 1)
  0%
    box-shadow: inset 0 0 0 1000px $end, 0 0 0 0px $end
    border-color: $end
  2%
    box-shadow: inset 0 0 0 1000px $start, 0 0 0 0px $start
    border-color: $start
  100%
    box-shadow: inset 0 0 0 1000px $end, 0 0 0 8px $end
    border-color: $end


</style>
