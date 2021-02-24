<template lang="pug">
.lifemeter
  img.thumb(v-bind="thumbnail")
  b-icon.clock(icon="timer-sand", :style="iconStyle")
  svg(ref="svg", :width="size", :height="size")
    //- circle(fill="red", :cx="size/2", :cy="size/2", :r="size * 0.5")
    g
      path(v-bind="lifelineBg")
      path(v-bind="lifeline")
    g.dangers
      path(v-bind="early")
      path(v-bind="mid")
      path(v-bind="late")
</template>

<script>
import { scaleLinear, scaleThreshold } from 'd3-scale'
import _findLast from 'lodash/findLast'
import _sumBy from 'lodash/sumBy'

// const dangerScale = scaleThreshold().domain([0.05, 0.10, 0.5]).range(['safe', 'alright', 'difficult', 'trecherous'])
// const midlifeQualityScale = scaleThreshold().domain([0.1, 0.5, 0.7]).range(['trecherous', 'difficult', 'alright', 'safe'])
// const lifeLengthScale = scaleThreshold().domain([14, 30, 80]).range(['short', 'medium', 'long', 'very long'])

const dangerScale = scaleThreshold()
  .domain([0.05, 0.30, 0.5])
  .range(['#AEE4C9', '#FDDE3B', '#f47e18',  '#D03D49'])

const lifelineScale = scaleLinear()
  .domain([0, 140])
  .range([Math.PI * 6/5, Math.PI * 9/5])

function calcDeaths(data){
  return data.map((v, i) => [v[0], i ? data[i - 1][1] - v[1] : 0])
}

function calcDeathAgeExpectation(data){
  let d = calcDeaths(data)
  let tot = _sumBy(d, a => a[1])
  return _sumBy(d, ([age, count]) => age * count) / tot
}

function circlePoint(r, theta, ox, oy){
  let x = r * Math.cos(theta) + ox
  let y = r * Math.sin(theta) + oy
  return `${x} ${y}`
}

function wedge(r1, r2, theta1, theta2, ox, oy){
  let points = [
    circlePoint(r1, theta1, ox, oy)
    , circlePoint(r1, theta2, ox, oy)
    , circlePoint(r2, theta2, ox, oy)
    , circlePoint(r2, theta1, ox, oy)
  ]
  let d = [
    `M ${points[0]}`
    , `A ${r1} ${r1}, 0, 0, 1, ${points[1]}`
    , `L ${points[2]}`
    , `A ${r2} ${r2}, 0, 0, 0, ${points[3]}`
    , 'Z'
  ].join(' ')

  return d
}

export default {
  name: 'LifeMeter'
  , props: {
    size: {
      type: Number
      , default: 260
    }
    , lifetable: Array
    , bins: Array
    , thickness: {
      type: Number
      , default: 12
    }
  }
  , components: {
  }
  , computed: {
    iconStyle(){
      let r = this.r
      let a = lifelineScale.range()[0] - Math.PI * 0.015
      let x = r * Math.cos(a) + r
      let y = r * Math.sin(a) + r
      let transform = `translate(${x}px, ${y}px) rotate(${a + Math.PI/2}rad)`
      return {
        transform
      }
    }
    , lifelineBg(){
      let r = this.r
      let t = this.thickness / 2
      let range = lifelineScale.range()
      let a = lifelineScale(this.max)
      return {
        d: wedge(r - this.thickness + t, r - this.thickness, range[0], a, r, r)
        , fill: '#d6d6d6'
      }
    }
    , lifeline(){
      let r = this.r
      let t = this.thickness / 2
      let range = lifelineScale.range()
      let a = lifelineScale(this.deathAge)
      return {
        d: wedge(r - this.thickness + t, r - this.thickness, range[0], a, r, r)
        , fill: '#c86f87'
      }
    }
    , total(){ return this.lifetable[0][1] }
    , deathAge(){ return calcDeathAgeExpectation(this.lifetable) }
    , max(){
      return _findLast(this.lifetable, a => a[1] > 0)[0]
    }
    , infantMortality(){
      return (this.total - this.bins[1][0][1]) / this.total
    }
    , middleMortality(){
      let l = this.bins.length
      let d0 = this.bins[1][0][1]
      let deaths = this.bins[Math.round(l * 3/4)][0][1]
      return (d0 - deaths) / this.total
    }
    , r(){ return this.size / 2 }
    , thumbnail(){
      let margin = 1.618 * this.thickness
      let width = this.size - 2 * margin
      return {
        src: 'https://crhscountyline.com/wp-content/uploads/2020/03/Capture.png'
        , width
        , style: { transform: `translate(${margin}px, ${margin}px)` }
      }
    }
    , early(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 3/5, Math.PI * 4/5, r, r)
        , fill: dangerScale(this.infantMortality)
      }
    }
    , mid(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 2/5, Math.PI * 3/5, r, r)
        , fill: dangerScale(this.middleMortality)
      }
    }
    , late(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 1/5, Math.PI * 2/5, r, r)
        , fill: '#FDDE3B'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.lifemeter
  position: relative
  display: flex
  flex-direction: column
// svg
//   outline: 1px solid red
.clock
  position: absolute
  top: -8px
  left: -8px
  ::v-deep .mdi::before
    color: #949494
    font-size: 20px
.dangers path
  stroke: white
  stroke-width: 2
.thumb
  position: absolute
  top: 0
  left: 0
  border-radius: 50%
text
  fill: $sand
</style>
