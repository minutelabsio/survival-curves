<template lang="pug">
.home
  .container
    .section
      StackedBarChart(:series="series", :xvalues="xvalues", :domain="domain")
      p Life Expectancy: {{ lifeExpectancy }}
      p Life Expectancy: {{ lifeExpectancy2 }}
</template>

<script>
import _times from 'lodash/times'
import StackedBarChart from '@/components/StackedBarChart'

const N = 24
const testArray = [N, 10, 8, 4, 3, 2, 1, 1, 1, 0]

export default {
  name: 'Home'
  , components: {
    StackedBarChart
  }
  , data: () => ({
    domain: [1, 10]
    , xvalues: _times(10, n => n)
    , series: [
      {
        values: testArray
        , color: '#519677'
      }
      , {
        values: testArray.map((v, i) => (testArray[i - 1] | 0) - v)
        , color: 'tomato'
      }
      , {
        values: testArray.map((v, i) => N - testArray[i - 1] | 0)
        , color: 'lightgrey'
      }
    ]
    , lifeExpectancy: testArray.reduce((a, v) => a + v, 0) / N
    , lifeExpectancy2: testArray.map((v, i) => (testArray[i - 1] | 0) - v).map((v, i) => v * i).reduce((a, v) => a + v, 0) / N
  })
}
</script>

<style lang="sass" scoped>

</style>
