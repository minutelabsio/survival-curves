<template lang="pug">
.container
  .section
    b-field
      b-select(v-model="selectedName")
        option(v-for="(data, label) in datasetList", :value="label", :key="label") {{ label }}
    StackedBarChart.chart(
      ref="videoChart",
      :width="width",
      :height="1280/(3/2)",
      :series="series",
      :range="videoGraphRange",
      :xvalues="xvalues",
      :barMargin="0.1",
      tick-format="~%"
    )
    //- StackedBarChart.chart(
    //-   ref="videoChart",
    //-   :width="width",
    //-   :height="1280/(3/2)",
    //-   :range="videoGraphRange"
    //-   :series="series",
    //-   :xvalues="xvalues",
    //-   :barMargin="0.1",
    //-   tick-format="~%"
    //- )
    b-field(grouped)
      b-field(label="Y from")
        b-input(type="number", v-model="from", step="0.00001")
      b-field(label="Y to")
        b-input(type="number", v-model="to", step="0.00001")
      b-field(label=" ")
        b-button(@click="swap") swap
    b-field
      b-button(@click="reset") Reset
      b-button(@click="zoomIn", type="is-primary") Y axis zoom

    //- b-field(grouped)
    //-   b-field(label="x to")
    //-     b-input(type="number", v-model="xto")
    //-   b-field
    //-     b-button(@click="zoomX") X axis animate
</template>

<script>
import Home from './humans'
import { tween } from '@/lib/tween'
// import ALL_ANIMAL_DATA from '@/data/all'
import DataByYear from '@/data/human-history/all'

// function addOldest(arr, oldest){
//   let ret = []
//   let age = 0
//   let a = 0
//   for (a = 0; age < oldest && arr[a]; a++){
//     age = arr[a][0]
//     let v = arr[a] ? arr[a][1] : 0
//     ret[a] = [age, v + 1]
//   }
//   age += 5
//   for (; age < oldest; a++){
//     ret.push([age, 1])
//     age += 5
//   }
//   ret.push([age, 1])
//   return ret
// }

// const humans = addOldest(ALL_ANIMAL_DATA["Humans"].lifetable, 120) //122

// const datasetList = Object.assign({}, ALL_ANIMAL_DATA, {
//   "Humans": Object.assign({}, ALL_ANIMAL_DATA['Humans'], { lifetable: humans })
// })

export default {
  name: 'VideoHelper'
  , extends: Home
  , data: () => ({
    showDead: false
    , datasetList: Object.freeze(DataByYear)
    , selectedName: '1810'

    , from: 1
    , to: 0.01

    , xto: 122
    , lastX: false
    , width: 1280
    , videoGraphRange: [0, 1]
  })
  , computed: {
    series(){
      return [
        {
          values: this.dataset
          , color: '#5BE9AE'
          , active: this.showAlive
        }
        , {
          values: this.dataRemoved
          // , color: '#e6e6e6'
          , active: this.showAlive
          , color: '#DB3F3F'
          , gapless: true
        }
      ]
    }
    , lastXval(){
      return this.bins[this.bins.length - 1].x0
    }
    , xvalues(){
      let xvals = this.bins.map(b => b.x0)
      if (this.lastX !== false){
        xvals.push(this.lastX)
      }
      return xvals
    }
  }
  , methods: {
    swap(){
      let y1 = this.from
      let y2 = this.to
      this.from = y2
      this.to = y1
    }
    , zoomIn(){
      let y1 = this.from
      let y2 = this.to
      let z1 = Math.log10(y1)
      let z2 = Math.log10(y2)
      tween({
        from: { z: z1 }
        , to: { z: z2 }
        , duration: 2000
        , easing: 'easeInOutQuad'
        , step: s => {
          // console.log(s)
          // chart.yrange.range([0, s.x])
          this.videoGraphRange = [0, Math.pow(10, s.z)]
        }
      })
    }
    , zoomX(){
      tween({
        from: { w: 1280 }
        , to: { w: 1100 }
        , duration: 2000
        , easing: 'easeInOutQuad'
        , step: s => {
          // console.log(s)
          // chart.yrange.range([0, s.x])
          this.width = s.w
        }
      })
    }
    , reset(){
      this.videoGraphRange = [0, this.from]
      this.lastX = false
    }
  }
}
</script>

<style lang="sass" scoped>
.chart
  margin-bottom: 2em

  ::v-deep
    rect
      stroke-width: 1
    rect + rect
      transform: translate(0.6px, 0)
</style>
