<template lang="pug">
.home
  .container
    .section
      StackedBarChart(:series="series", :xvalues="xvalues", :domain="domain")
</template>

<script>
import _times from 'lodash/times'
import StackedBarChart from '@/components/StackedBarChart'

const testArray = [10, 9, 8, 4, 3, 2, 1, 1, 1, 0]

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
        , color: 'green'
      }
      , {
        values: testArray.map((v, i) => (testArray[i - 1] | 0) - v)
        , color: 'red'
      }
      , {
        values: testArray.map((v, i) => 10 - testArray[i - 1] | 0)
        , color: 'grey'
      }
    ]
  })
}
</script>

<style lang="sass" scoped>

</style>
