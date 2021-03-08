<template lang="pug">
.home
  .container

    .section
      .columns.is-mobile.is-multiline
        .column(v-for="(d, animal) in datasetList")
          a.animal-select(@click="selectedName = animal")
            LifeMeter(:data="d", :size="120", :thumb="thumbs[animal]")
            .name {{ animal }}
    .section
      .is-flex.is-justify-content-center
        LifeMeter(:label="selectedName", :data="selected", :thumb="selectedThumb")
      //- .columns
      //-   .column.is-half
      //-     p Expected age of Death: {{ longevityStats.expectation }}
      //-     p Expected age of Death after Childhood: {{ longevityStats.afterChildhood }}
      //-     p Maximum age: {{ longevityStats.max }}

      .columns
        .column
          h2.is-size-4.heading Survival / Death
          p Starting with an initial population, how many survive and die each year?
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
                b-icon(icon="arrow-up")
                .l longest living in batch
              .poi(:style="{ transform: `translate(${xscale(longevityStats.afterChildhood)}px, 40px)` }")
                b-icon(icon="arrow-up")
                .l life expectancy after year 1
              .poi(:style="{ transform: `translate(${xscale(longevityStats.expectation)}px, 0)` }")
                b-icon(icon="arrow-up")
                .l life expectancy
        .column
          h2.is-size-4.heading Chance of Dying
          p How likely are you to die this year given how old you are?
          StackedBarChart.chart(
            :width="plotWidth",
            :series="[{ values: deathChance.map(v => v[1]), color: '#D03D49' }]",
            :xvalues="deathChance.map(v => v[0])",
            :range="[0, 1]"
            :barMargin="0",
            tick-format="%"
          )
      b-field
        b-checkbox(v-model="showAlive") Show Living
        b-checkbox(v-model="showDead") Show Dead
        b-checkbox(v-model="showPercent") Show Percentages

</template>

<script>
import { bin } from 'd3-array'
import _meanBy from 'lodash/meanBy'
import StackedBarChart from '@/components/StackedBarChart'
import LifeMeter from '@/components/LifeMeter'
import ALL_ANIMAL_DATA from '@/data/all'
import ThumbImages from '@/assets/animal-thumb-map'

export default {
  name: 'Home'
  , components: {
    StackedBarChart
    , LifeMeter
  }
  , data: () => ({
    datasetList: ALL_ANIMAL_DATA
    , thumbs: ThumbImages
    , selectedName: 'Humans'
    , showPercent: true
    , plotWidth: 300

    , showDead: true
    , showAlive: true
  })
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
      let d = this.bins.map(a => _meanBy(a, v => v[1]))
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
    , dataDead(){
      let dataset = this.dataset
      return dataset.map((v, i) => i ? dataset[i - 1] - v : 1 - v).map(v => Math.max(v, 0))
    }
    , dataRemoved(){
      let dataset = this.dataset
      let dead = this.dataDead
      let showDead = this.showDead
      let count = 1 //dataset[0]
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

}
</script>

<style lang="sass" scoped>
.chart
  margin: 1rem 80px 80px 0
  font-family: $family-monospace
.animal-select
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
.poi
  position: absolute
  bottom: -28px
  left: 0
  line-height: 1
  text-align: center
  width: 50px
  margin-left: -25px
  font-size: 12px
  color: $blue

  .l
    position: absolute
    width: 140px
    top: 25px
    left: 16px
    text-align: left
</style>
