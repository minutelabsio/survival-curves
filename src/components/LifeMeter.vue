<template lang="pug">
.lifemeter
  img.thumb(v-bind="thumbnail")
  b-icon.clock(icon="timer-sand", :style="iconStyle")
  .l.childhood {{earlyText}} childhood
  .l.midlife {{midText}} midlife
  .l.oldage {{elderlyText}} old age
  svg(ref="svg", :width="size", :height="size + topPad")
    //- circle(fill="red", :cx="size/2", :cy="size/2", :r="size * 0.5")
    g(:transform="`translate(0 ${topPad})`")
      g
        path(:d="lifelineTextPath", id="svglifespan", fill="transparent")
        path(v-bind="lifelineBg")
        path(v-bind="lifeline")
        text.lifelinetext(:width="size", dy="-3")
          textPath(alignment-baseline="top", xlink:href="#svglifespan", startOffset="50%", text-anchor="middle")
            | {{label}}: {{ deathAge.toFixed(0) }} years ({{ max }} max)

      g.dangers
        path(v-bind="early")
        path(v-bind="mid")
        path(v-bind="late")
</template>
<script>
import { scaleLinear, scaleThreshold } from 'd3-scale'
import _findLast from 'lodash/findLast'
import _sumBy from 'lodash/sumBy'

const red = '#D03D49'
const yellow = '#FDDE3B'
const green = '#AEE4C9'
const blue = '#81c9ec'

// const dangerScale = scaleThreshold().domain([0.05, 0.10, 0.5]).range(['safe', 'alright', 'difficult', 'trecherous'])
// const midlifeQualityScale = scaleThreshold().domain([0.1, 0.5, 0.7]).range(['trecherous', 'difficult', 'alright', 'safe'])
// const lifeLengthScale = scaleThreshold().domain([14, 30, 80]).range(['short', 'medium', 'long', 'very long'])

const infantDangerScale = scaleThreshold()
  .domain([0.05, 0.30, 0.5])
  .range([green, blue, yellow,  red])

const infantDangerScaleText = infantDangerScale.copy().range(['safe', 'okay', 'difficult', 'trecherous'])


const midlifeDangerScale = scaleThreshold()
  .domain([0.2, 0.55, 0.8])
  .range([red, yellow, blue, green])

const midlifeDangerScaleText = midlifeDangerScale.copy().range(['trecherous', 'difficult', 'okay', 'safe'])

const elderlyDangerScale = scaleThreshold()
  .domain([0.2, 0.55, 0.8])
  .range([green, blue, yellow,  red])

const elderlyDangerScaleText = elderlyDangerScale.copy().range(['safe', 'okay', 'difficult', 'trecherous'])

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
    label: {
      type: String
    }
    , size: {
      type: Number
      , default: 260
    }
    , lifetable: Array
    , bins: Array
    , thickness: {
      type: Number
      , default: 12
    }
    , topPad: {
      type: Number
      , default: 30
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
      let transform = `translate(${x}px, ${y + this.topPad}px) rotate(${a + Math.PI/2}rad)`
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
    , lifelineTextPath(){
      let r = this.r
      let range = lifelineScale.range()
      let points = [
        circlePoint(r, range[0], r, r)
        , circlePoint(r, range[1], r, r)
      ]
      return [
        `M ${points[0]}`
        , `A ${r} ${r}, 0, 0, 1, ${points[1]}`
      ].join(' ')
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
    // , lifespanText(){
    //   return {

    //   }
    // }
    , total(){ return this.lifetable[0][1] }
    , deathAge(){ return calcDeathAgeExpectation(this.lifetable) }
    , afterInfancyDeathAge(){ return calcDeathAgeExpectation(this.lifetable.filter(a => a[0] > 1)) }
    , max(){
      return _findLast(this.lifetable, a => a[1] > 0)[0]
    }
    , batchMax(){
      return _findLast(this.lifetable, a => a[1] > 1)[0]
    }
    , infantMortality(){
      return (this.total - this.bins[1][0][1]) / this.total
    }
    , middleMortality(){
      let l = this.bins.length
      let r0 = this.bins[1][0][1]
      let remaining = this.bins[Math.round(l * 3/4)][0][1]
      return (r0 - remaining) / this.total
    }
    , elderlyMortality(){
      let l = this.bins.length
      let remaining = this.bins[this.bins.length - Math.round(l * 1/4)][0][1]
      return remaining / this.total
    }
    , r(){ return this.size / 2 }
    , thumbnail(){
      let margin = 1.618 * this.thickness
      let width = this.size - 2 * margin
      return {
        src: 'https://crhscountyline.com/wp-content/uploads/2020/03/Capture.png'
        , width
        , style: { transform: `translate(${margin}px, ${margin + this.topPad}px)` }
      }
    }
    , early(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 3/5, Math.PI * 4/5, r, r)
        , fill: infantDangerScale(this.infantMortality)
      }
    }
    , earlyText(){
      return infantDangerScaleText(this.infantMortality)
    }
    , mid(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 2/5, Math.PI * 3/5, r, r)
        , fill: midlifeDangerScale(this.afterInfancyDeathAge / this.batchMax)
      }
    }
    , midText(){
      return midlifeDangerScaleText(this.afterInfancyDeathAge / this.batchMax)
    }
    , late(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 1/5, Math.PI * 2/5, r, r)
        , fill: elderlyDangerScale(this.afterInfancyDeathAge / this.batchMax)
      }
    }
    , elderlyText(){
      return elderlyDangerScaleText(this.afterInfancyDeathAge / this.batchMax)
    }
  }
}
</script>

<style lang="sass" scoped>
.lifemeter
  position: relative
  display: flex
  flex-direction: column
  margin-bottom: 80px
.lifelinetext
  font-size: 16px
.l
  position: absolute
  top: 100%
  line-height: 1.2
  width: 100%
  color: $grey
  font-size: 16px
  &::after
    position: absolute
    top: 0
    content: ''
    display: block
    width: 15px
    border-top: 2px solid $grey-light
  &.childhood
    right: 100%
    text-align: right
    transform: translate(34px, -10px)
    &::after
      right: 0
      transform: translate(18px, -5px) rotate(-52deg)
  &.midlife
    left: 50%
    width: 100px
    margin-left: -50px
    text-align: center
    transform: translate(0, 24px)
    &::after
      left: 50%
      margin-left: -7px
      transform: translate(0px, -12px) rotate(90deg)
  &.oldage
    left: auto
    left: 100%
    text-align: left
    transform: translate(-34px, -10px)
    &::after
      left: 0
      transform: translate(-18px, -5px) rotate(52deg)
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
