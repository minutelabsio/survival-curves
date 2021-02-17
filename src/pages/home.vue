<template lang="pug">
.home
  .container
    .section
      .columns
        .column.is-half
          p Expected age of Death: {{ longevityStats.expectation }}
          p Expected age of Death after Childhood: {{ longevityStats.afterChildhood }}
          p Maximum age: {{ longevityStats.max }}
        .column.is-half
          p Childhood:
            b-tag(type="is-primary") {{ qualitativeRatings.childhoodDanger }}
          p Adolescence:
            b-tag(type="is-primary") {{ qualitativeRatings.midlifeQuality }}
          p Maximum Longevity:
            b-tag(type="is-primary") {{ qualitativeRatings.maxLifetime }}

      .columns
        .column
          h2.is-size-4.heading Survival / Death
          p Starting with an initial population, how many survive and die each year?
          StackedBarChart.chart(
            :width="520",
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
                .l life expectancy after childhood
              .poi(:style="{ transform: `translate(${xscale(longevityStats.expectation)}px, 0)` }")
                b-icon(icon="arrow-up")
                .l life expectancy
        .column
          h2.is-size-4.heading Chance of Dying
          p How likely are you to die this year given how old you are?
          StackedBarChart.chart(
            :width="520",
            :series="[{ values: deathChance.map(v => v[1]), color: '#D03D49' }]",
            :xvalues="deathChance.map(v => v[0])",
            :barMargin="0",
            tick-format="%"
          )
      b-field
        b-checkbox(v-model="showAlive") Show Living
        b-checkbox(v-model="showDead") Show Dead
        b-checkbox(v-model="showPercent") Show Percentages
      b-field
        b-select(v-model="selected")
          option(v-for="(data, label) in datasetList", :value="data", :key="label") {{ label }}

    StackedBarChart.chart(
      ref="videoChart",
      :width="1280",
      :aspect="3/2",
      :range="videoGraphRange"
      :series="series",
      :xvalues="xvalues",
      :barMargin="0.1",
      tick-format="%"
    )
    b-field
      b-button(@click="videoGraphRange = [0, 1]") Reset
      b-button(@click="zoomIn") Go

</template>

<script>
import { scaleThreshold } from 'd3-scale'
import { bin } from 'd3-array'
import _sumBy from 'lodash/sumBy'
import _findLast from 'lodash/findLast'
import _flatten from 'lodash/flatten'
import interpolator from '@/lib/interpolator'
import StackedBarChart from '@/components/StackedBarChart'
import ALL_ANIMAL_DATA from '@/data/all'
import { tween } from '@/lib/tween'

const dangerScale = scaleThreshold().domain([0.05, 0.10, 0.5]).range(['safe', 'alright', 'difficult', 'trecherous'])
const midlifeQualityScale = scaleThreshold().domain([0.1, 0.5, 0.7]).range(['trecherous', 'difficult', 'alright', 'safe'])
const lifeLengthScale = scaleThreshold().domain([14, 30, 80]).range(['short', 'medium', 'long', 'very long'])

function calcDeaths(data){
  return data.map((v, i) => [v[0], i ? data[i - 1][1] - v[1] : 0])
}

function calcDeathAgeExpectation(data){
  let d = calcDeaths(data)
  let tot = _sumBy(d, a => a[1])
  return _sumBy(d, ([age, count]) => age * count) / tot
}

function getDeathChance(v, age, arr) {
  let chance = 1
  let next = arr[age + 1]
  if (next){
    if (next[1] === 0){
      chance = 1
    } else {
      chance = 1 - next[1]/v[1]
    }
  }
  return [age, chance]
}

export default {
  name: 'Home'
  , components: {
    StackedBarChart
  }
  , data: () => ({
    datasetList: ALL_ANIMAL_DATA
    , selected: ALL_ANIMAL_DATA['Humans']
    , showPercent: true

    , showDead: true
    , showAlive: true

    , videoGraphRange: [0, 1]
  })
  , computed: {
    bins(){
      return bin()
        .thresholds(Math.min(20, this.selected.length))
        .value(a => a[0])(this.selected)
    }
    , dataset(){
      let d = this.bins.map(a => _sumBy(a, v => v[1]))
      if ( this.showPercent ){
        return d.map(v => v / d[0])
      }
      return d
    }
    , deathChance(){
      let data = this.selected
      let d = interpolator(
        _flatten(data.map(getDeathChance).filter(v => v[1] > 0))
      )
      return data.map(v => [v[0], d(v[0])]).filter(v => v[0] <= this.longevityStats.max)
    }
    , xvalues(){
      return this.bins.map(b => b.x0)
    }
    , longevityStats(){
      let data = this.selected
      let expectation = calcDeathAgeExpectation(data)
      let afterChildhood = calcDeathAgeExpectation(data.filter(a => a[0] > 1))
      let max = _findLast(data, a => a[1] > 0)[0]
      return {
        expectation
        , afterChildhood
        , max
      }
    }
    , qualitativeRatings(){
      let data = this.selected
      let tot = data[0][1]
      let youngOnesLeft = this.bins[1][0][1]
      let childhoodDanger = dangerScale(1 - youngOnesLeft / tot)
      let maxLifetime = lifeLengthScale(this.longevityStats.max)
      let midlifeEndsAt = _findLast(data, v => v[1] / youngOnesLeft > 0.5)[0] / this.longevityStats.max
      let midlifeQuality = midlifeQualityScale(midlifeEndsAt)
      return {
        childhoodDanger
        , maxLifetime
        , midlifeQuality
      }
    }
    , dataDead(){
      let dataset = this.dataset
      return dataset.map((v, i) => i ? dataset[i - 1] - v : 0)
    }
    , dataRemoved(){
      let dataset = this.dataset
      let dead = this.dataDead
      let showDead = this.showDead
      let count = dataset[0]
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
          // , color: '#e6e6e6'
          , active: this.showAlive
          , color: '#D03D49'
          , gapless: true
        }
      ]
    }
  }
  , methods: {
    zoomIn(){
      tween({
        from: { x: 1 }
        , to: { x: 0.001 }
        , duration: 1000
        , easing: 'easeInOutQuad'
        , step: s => {
          // console.log(s)
          // chart.yrange.range([0, s.x])
          this.videoGraphRange = [0, s.x]
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.chart
  margin: 1rem 80px 80px 0
  font-family: $family-monospace
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
