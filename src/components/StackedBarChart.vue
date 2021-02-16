<template lang="pug">
.barchart
  svg.chart(ref="svg", :width="chartWidth", :height="chartHeight")
    //- along the x direction
    g(v-for="bar in bars", :transform="`translate(${bar.x}, 0) scale(1, 1)`")
      //- each stack
      rect(v-for="layer in bar.layers", v-bind="layer")
  svg.yaxis.no-events(ref="yaxis", width="100", :height="chartHeight + 30")
    g(v-for="tick in yticks", :transform="`translate(100, ${yscale(tick) + 15})`")
      text(text-anchor="end", dominant-baseline="middle", x="-6", y="1.5") {{ytickFormat(tick)}}
      line.major(x1="-4", x2="0", y1="0", y2="0")
  svg.xaxis(ref="xaxis", :width="chartWidth", height="20")
    g(v-for="tick in xticks", :transform="`translate(${xscale(tick)}, 0)`")
      text(text-anchor="middle", y="18", :x="barWidth / 2") {{tick}}
      line.major(:x1="barWidth / 2", :x2="barWidth / 2", y1="0", y2="4")
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
    , tickFormat: {
      type: String
      , default: '.2f'
    }
    , margin: {
      type: Number
      , default: 6
    }
    , barMargin: {
      type: Number
      , default: 0.3
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
      else { return Math.round(this.width / this.aspect) }
    }
    , xscale(){
      return scaleBand()
        .domain(this.xvalues)
        .range([this.margin - 1, (this.chartWidth - this.margin) | 0])
        .paddingInner(this.barMargin)
    }
    , xticks(){
      return scaleLinear()
        .domain(this.xvalues)
        .range([this.margin - 1, (this.chartWidth - this.margin) | 0])
        .ticks()
    }
    , visibleSeries(){
      return this.series.filter(s => s.active)
    }
    , yscale(){
      let domain = this.range
      if (!domain){
        let maxY = this.xvalues.reduce((maxY, x, i) => {
          let sum = this.visibleSeries.map(s => s.values[i]).reduce((s, v) => s + v, 0)
          return Math.max(sum, maxY)
        }, 0)
        domain = [0, maxY]
      }
      return scaleLinear()
        .domain(domain)
        .range([this.chartHeight, this.margin - 1])
    }
    , yticks(){ return this.yscale.ticks(10) }
    , ytickFormat(){ return this.yscale.tickFormat(10, this.tickFormat) }
    , barWidth(){
      return this.xscale.bandwidth()
    }
    , bars(){
      const $x = this.xscale
      const $y = this.yscale
      const barWidth = this.barWidth
      const barMargin = this.barMargin

      return this.xvalues.map((x, i) => {
        let y = 0
        let layers = this.visibleSeries.map(s => {
          let h = s.values[i]
          y += h
          return {
            width: barWidth + (s.gapless ? barMargin * barWidth : 0)
            , y: $y(y)
            , height: $y(0) - $y(h)
            , fill: s.color
            , x: s.gapless ? -barMargin * barWidth : 0
            , stroke: s.color
            , 'stroke-width': 0.6
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
  position: relative
  display: flex
  flex-direction: column
svg.chart
  border: 1px solid lighten($sand, 30)
  border-radius: 3px 3px 3px 0
.major
  stroke: lighten($sand, 30)
.yaxis
  position: absolute
  top: -15px
  left: -100px
  // outline: 1px solid red
text
  fill: $sand
</style>
