<template lang="pug">
.barchart
  svg(ref="svg", :width="chartWidth", :height="chartHeight")
    //- along the x direction
    g(v-for="bar in bars", :transform="`translate(${bar.x}, 0) scale(1, 1)`")
      //- each stack
      rect(v-for="layer in bar.layers", v-bind="layer")
</template>

<script>
import { scaleLinear, scaleBand } from 'd3-scale'

export default {
  name: 'StackedBarChart'
  , props: {
    width: {
      type: Number
      , default: 640
    }
    , height: {
      type: Number
    }
    , aspect: {
      type: Number
      , default: 16/9
    }
    , barMargin: {
      type: Number
      , default: 0.3
    }
    , domain: {
      type: Array
      , default: () => [0, 1]
    }
    , range: {
      type: Array
    }
    , xvalues: {
      type: Array
      , default: () => [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]
    }
    , series: {
      type: Array
      , default: () => []
    }
  }
  , components: {
  }
  , computed: {
    chartWidth(){ return this.width }
    , chartHeight(){
      if (this.height){ return this.height }
      else { return this.width / this.aspect }
    }
    , xscale(){
      return scaleBand()
        .domain(this.xvalues)
        .range([0, this.chartWidth])
        .paddingInner(this.barMargin)
      // return scaleLinear()
      //   .domain(this.domain)
      //   .range([0, this.chartWidth + this.barMargin])
    }
    , yscale(){
      let domain = this.range
      if (!domain){
        let maxY = this.xvalues.reduce((maxY, x, i) => {
          let sum = this.series.map(s => s.values[i]).reduce((s, v) => s + v, 0)
          return Math.max(sum, maxY)
        }, 0)
        domain = [0, maxY]
      }
      return scaleLinear()
        .domain(domain)
        .range([this.chartHeight, 0])
    }
    , barWidth(){
      return this.xscale.bandwidth()
      // const n = this.xvalues.filter(x => x >= this.domain[0] && x <= this.domain[1] ).length
      // return this.chartWidth / n - this.barMargin
    }
    , bars(){
      const $x = this.xscale
      const $y = this.yscale
      const barWidth = this.barWidth

      return this.xvalues.map((x, i) => {
        let y = 0
        let layers = this.series.map(s => {
          let h = s.values[i]
          y += h
          return {
            width: barWidth
            , y: $y(y)
            , height: $y(0) - $y(h)
            , fill: s.color
          }
        })

        return {
          x: $x(x)
          , layers
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.barchart
  display: flex
svg
  outline: 1px solid red
</style>
