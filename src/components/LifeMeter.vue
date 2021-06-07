<template lang="pug">
.lifemeter(:class="{ m: !!labels }", :style="{ width: size + 'px' }")
  transition(name="fade")
    .thumb(v-bind="thumbnail")
      slot(name="thumb")
        img(:src="thumbnail.src", width="100%", :key="thumb")
  b-icon.clock(v-if="labels", icon="timer-sand", :style="iconStyle")
  template(v-if="labels")
    .l.childhood
      span {{earlyText}} childhood
    .l.midlife
      span {{midText}} midlife
    .l.oldage
      span {{elderlyText}} old age
  svg(ref="svg", :width="size + 2 * topPad", :height="size + topPad")
    //- circle(fill="red", :cx="size/2", :cy="size/2", :r="size * 0.5")
    g(:transform="`translate(${topPad} ${topPad})`")
      g
        path(:d="lifelineTextPath", :id="uniqueId", fill="transparent")
        path(v-bind="lifelineBg")
        path(v-bind="lifeline")
        text.lifelinetext(v-if="labels", :width="size", dy="-3")
          textPath(alignment-baseline="top", :xlink:href="'#' + uniqueId", startOffset="50%", text-anchor="middle")
            | {{ deathAge.toFixed(0) }} years&nbsp;
            template(v-if="max") ({{ max }} max)

      g.dangers
        path(v-bind="early")
        path(v-bind="mid")
        path(v-bind="late")
</template>
<script>
import { scaleLinear, scaleThreshold } from 'd3-scale'
import _uniqueId from 'lodash/uniqueId'

const red = '#D03D49'
const yellow = '#FDDE3B'
const green = '#AEE4C9'
const blue = '#81c9ec'

const lifelineScale = scaleLinear()
  .domain([0, 120])
  .range([Math.PI * 6/5, Math.PI * 9/5])

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
    labels: Boolean
    , thumb: String
    , size: {
      type: Number
      , default: 260
    }
    , data: Object
    , thickness: {
      type: Number
      , default: 12
    }
    , topPad: {
      type: Number
      , default: 30
    }
    , riskDomain: {
      type: Array
      , default: () => [0.05, 0.20, 0.40]
    }
  }
  , components: {
  }
  , computed: {
    riskScale(){
      return scaleThreshold()
        .domain(this.riskDomain)
        .range([green, blue, yellow,  red])
    }
    , riskScaleText(){
      return this.riskScale.copy()
        .range(['safe', 'okay', 'difficult', 'treacherous'])
    }
    , uniqueId(){ return _uniqueId('lifemeter-') }
    , lifetable(){ return this.data.lifetable }
    , iconStyle(){
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
      let dy = 6
      let range = [Math.PI, 2*Math.PI]
      let points = [
        circlePoint(r + dy, range[0], r, r)
        , circlePoint(r + dy, range[1], r, r)
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
    , total(){ return this.lifetable[0][1] }
    , deathAge(){ return this.data.longevityStats.expectation }
    , max(){ return this.data.maxLifetime }
    , r(){ return this.size / 2 }
    , thumbnail(){
      let margin = 1.618 * this.thickness
      let width = this.size - 2 * margin
      return {
        src: this.thumb
        , style: { transform: `translate(${margin}px, ${margin + this.topPad}px)`, width: `${width}px`, height: `${width}px` }
      }
    }
    , early(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 3/5, Math.PI * 4/5, r, r)
        , fill: this.riskScale(this.data.riskByStage.early)
      }
    }
    , earlyText(){
      return this.riskScaleText(this.data.riskByStage.early)
    }
    , mid(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 2/5, Math.PI * 3/5, r, r)
        , fill: this.riskScale(this.data.riskByStage.mid)
      }
    }
    , midText(){
      return this.riskScaleText(this.data.riskByStage.mid)
    }
    , late(){
      let r = this.r
      return {
        d: wedge(r, r - this.thickness, Math.PI * 1/5, Math.PI * 2/5, r, r)
        , fill: this.riskScale(this.data.riskByStage.late)
      }
    }
    , elderlyText(){
      return this.riskScaleText(this.data.riskByStage.late)
    }
  }
}
</script>

<style lang="sass" scoped>
.lifemeter
  position: relative
  display: flex
  flex-direction: column
  align-items: center;
  &.m
    margin-bottom: 80px
.lifelinetext
  font-size: 19px
  font-weight: 600
  fill: $black
.l
  position: absolute
  top: 100%
  line-height: 1.2
  width: 100%
  color: $black
  font-size: 14px
  text-transform: uppercase
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
    @media screen and (max-width: 480px)
      &
        width: 14ex
      span
        display: inline-block
        transform: translate(30px, 8px);
        // text-align: right
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
    @media screen and (max-width: 480px)
      &
        width: 14ex
      span
        display: inline-block
        transform: translate(-30px, 6px);

svg path
  transition: fill .3s ease
.clock
  position: absolute
  top: -8px
  left: -8px
  ::v-deep .mdi::before
    color: #949494
    font-size: 20px
.dangers path
  stroke: $background
  stroke-width: 2
.thumb
  position: absolute
  top: 0
  left: 0
  border-radius: 50%

.fade-enter-active, .fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
