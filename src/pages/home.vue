<template lang="pug">
.home
  .container
    .section
      p Expected age of Death: {{ longevityStats.expectation }}
      p Expected age of Death after Childhood: {{ longevityStats.afterChildhood }}
      p Maximum age: {{ longevityStats.max }}
      StackedBarChart.chart(
        :width="1280",
        :series="series",
        :xvalues="xvalues",
        :barMargin="0.1",
        :tick-format="showPercent ? '%' : null"
      )
      b-field
        b-checkbox(v-model="showAlive") Show Living
        b-checkbox(v-model="showDead") Show Dead
        b-checkbox(v-model="showPercent") Show Percentages
      b-field
        b-select(v-model="selected")
          option(v-for="(data, label) in datasetList", :value="data", :key="label") {{ label }}


</template>

<script>
import { bin } from 'd3-array'
import _sumBy from 'lodash/sumBy'
import _findLast from 'lodash/findLast'
import StackedBarChart from '@/components/StackedBarChart'

import ALL_ANIMAL_DATA from '@/data/all'

function calcDeaths(data){
  return data.map((v, i) => [v[0], i ? data[i - 1][1] - v[1] : 0])
}

function calcDeathAgeExpectation(data){
  let d = calcDeaths(data)
  let tot = _sumBy(d, a => a[1])
  return _sumBy(d, ([age, count]) => age * count) / tot
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
          , color: '#B0B0B0'
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
  margin: 2rem 0
  font-family: $family-monospace
</style>
