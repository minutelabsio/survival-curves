<template lang="pug">
.home
  .section.upper-section
    .container
      .content
        h1.title.is-size-1 What is "Life Expectancy" anyway?
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at est et nisi laoreet vestibulum ac non justo. Donec convallis quam nec enim bibendum placerat. Proin vulputate lorem pellentesque nisi tincidunt, eu ultricies dolor ultricies. Vestibulum pharetra mi hendrerit ex eleifend, vitae facilisis odio ullamcorper. Mauris porttitor velit in felis lobortis facilisis. Mauris rhoncus, lacus nec malesuada venenatis, odio justo condimentum mi, sit amet elementum arcu justo bibendum justo. Curabitur at massa ut ante egestas mollis. Suspendisse eu justo lorem. Nulla a augue accumsan, sodales tortor vitae, interdum arcu. Sed iaculis gravida sem, eget suscipit risus blandit ut. Ut molestie tristique nisl vitae egestas. In accumsan magna at urna lobortis, ut luctus magna lobortis. Pellentesque est arcu, placerat imperdiet facilisis sit amet, sodales in libero. Nam ac fermentum justo, quis consequat libero. Integer cursus vel sem id vehicula.

        p Here are some animals to choose from...
  .animal-selector
    AnimalSelection.sel(@select="selectAnimal($event, name)", v-model="selectedName")
  .section
    .container
      .is-flex.is-flex-direction-column.is-align-items-center
        .heading.title.is-size-2 {{ selectedName }}
        LifeMeter(:labels="true", :data="selected", :thumb="selectedThumb")

      //- .content.has-text-centered
      //-   h2.is-size-3.title Survival / Death

      .columns.pad
        .column.negate-space
          b-field.toggle
            b-switch(v-model="showAlive", :true-value="false", :false-value="true") Only deaths
          StackedBarChart.chart(
            :animate="true",
            :width="plotWidth",
            :series="series",
            :xvalues="xvalues",
            :barMargin="0.1",
            :tick-format="showPercent ? '%' : null"
          )
            template(#under="{ xscale }")
              .poi(:style="{ transform: `translateX(${xscale(longevityStats.max)}px)` }")
                .on-axis
                  b-tooltip(:label="`longest living in batch: ${longevityStats.max.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.afterChildhood)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy after year 1: ${longevityStats.afterChildhood.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.expectation)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy: ${longevityStats.expectation.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
        .column
          .content
            h2.is-size-4.title
              span.survivors Survival
              span=" / "
              span.deaths Death
            p.
              <span class="highlight">{{ selectedName | titleCase }}</span> will live to reach
              an average age of <span class="highlight">{{longevityStats.expectation.toFixed(0)}} years</span>.
            p Starting with an initial population, how many survive and die each year?

            p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at est et nisi laoreet vestibulum ac non justo. Donec convallis quam nec enim bibendum placerat. Proin vulputate lorem pellentesque nisi tincidunt, eu ultricies dolor ultricies. Vestibulum pharetra mi hendrerit ex eleifend, vitae facilisis odio ullamcorper. Mauris porttitor velit in felis lobortis facilisis. Mauris rhoncus, lacus nec malesuada venenatis, odio justo condimentum mi, sit amet elementum arcu justo bibendum justo. Curabitur at massa ut ante egestas mollis. Suspendisse eu justo lorem. Nulla a augue accumsan, sodales tortor vitae, interdum arcu. Sed iaculis gravida sem, eget suscipit risus blandit ut. Ut molestie tristique nisl vitae egestas.

      //- .content.has-text-centered
      //-   h2.is-size-3.title Chance of Dying

      .columns.pad
        .column
          StackedBarChart.chart(
            :width="plotWidth",
            :series="[{ values: deathChance.map(v => v[1]), color: '#D03D49' }]",
            :xvalues="deathChance.map(v => v[0])",
            :range="[0, 1]",
            :barMargin="0",
            tick-format="%"
          )
        .column
          .content
            h2.is-size-4.title Chance of Dying
            p How likely are you to die this year given how old you are?
            p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at est et nisi laoreet vestibulum ac non justo. Donec convallis quam nec enim bibendum placerat. Proin vulputate lorem pellentesque nisi tincidunt, eu ultricies dolor ultricies. Vestibulum pharetra mi hendrerit ex eleifend, vitae facilisis odio ullamcorper. Mauris porttitor velit in felis lobortis facilisis. Mauris rhoncus, lacus nec malesuada venenatis, odio justo condimentum mi, sit amet elementum arcu justo bibendum justo. Curabitur at massa ut ante egestas mollis. Suspendisse eu justo lorem. Nulla a augue accumsan, sodales tortor vitae, interdum arcu. Sed iaculis gravida sem, eget suscipit risus blandit ut. Ut molestie tristique nisl vitae egestas.

  footer.footer
    .container
      .content
        h1.title.is-size-1 Credits
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at est et nisi laoreet vestibulum ac non justo. Donec convallis quam nec enim bibendum placerat. Proin vulputate lorem pellentesque nisi tincidunt, eu ultricies dolor ultricies. Vestibulum pharetra mi hendrerit ex eleifend, vitae facilisis odio ullamcorper. Mauris porttitor velit in felis lobortis facilisis. Mauris rhoncus, lacus nec malesuada venenatis, odio justo condimentum mi, sit amet elementum arcu justo bibendum justo. Curabitur at massa ut ante egestas mollis. Suspendisse eu justo lorem. Nulla a augue accumsan, sodales tortor vitae, interdum arcu. Sed iaculis gravida sem, eget suscipit risus blandit ut. Ut molestie tristique nisl vitae egestas. In accumsan magna at urna lobortis, ut luctus magna lobortis. Pellentesque est arcu, placerat imperdiet facilisis sit amet, sodales in libero. Nam ac fermentum justo, quis consequat libero. Integer cursus vel sem id vehicula.
</template>

<script>
import { bin } from 'd3-array'
import _throttle from 'lodash/throttle'
import StackedBarChart from '@/components/StackedBarChart'
import LifeMeter from '@/components/LifeMeter'
import ALL_ANIMAL_DATA from '@/data/all'
import ThumbImages from '@/assets/animal-thumb-map'
import AnimalSelection from '@/components/AnimalSelection'

export default {
  name: 'Home'
  , components: {
    StackedBarChart
    , LifeMeter
    , AnimalSelection
  }
  , data: () => ({
    datasetList: ALL_ANIMAL_DATA
    , thumbs: ThumbImages
    , selectedName: 'Humans'
    , showPercent: true
    , plotWidth: 300

    , showDead: true
    , showAlive: true
  })
  , mounted(){
    const onResize = _throttle(() => {
      let w = Math.min(560, window.innerWidth)
      this.plotWidth = Math.floor(w - 2 * 30)
    }, 80)

    window.addEventListener('resize', onResize)
    onResize()

    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', onResize)
    })
  }
  , computed: {
    selected(){
      return this.datasetList[this.selectedName]
    }
    , lifetable(){ return this.selected.lifetable }
    , total(){ return this.lifetable[0][1] }
    , selectedThumb(){
      return ThumbImages[this.selectedName]
    }
    , bins(){
      return bin()
        .thresholds(Math.min(20, this.lifetable.length))
        .value(a => a[0])(this.lifetable)
    }
    , dataset(){
      let d = this.bins.map(a => a[0][1]) //.map(a => _meanBy(a, v => v[1]))
      if ( this.showPercent ){
        return d.map(v => v / this.total)
      }
      return d
    }
    , deathChance(){ return this.selected.deathChance }
    , xvalues(){
      return this.bins.map(b => b.x0)
    }
    , longevityStats(){ return this.selected.longevityStats }
    , dataDead(){
      let dataset = this.dataset
      return dataset.map((v, i) => i ? dataset[i - 1] - v : 1 - v).map(v => Math.max(v, 0))
    }
    , dataRemoved(){
      let dataset = this.dataset
      let dead = this.dataDead
      let showDead = this.showDead
      let count = this.showPercent? 1 : dataset[0]
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
          , color: '#e6e6e6'
          , active: this.showAlive
          // , color: '#D03D49'
          // , gapless: true
        }
      ]
    }
  }
  , methods: {
    selectAnimal(e, name){
      this.selectedName = name
    }
  }

}
</script>

<style lang="sass" scoped>
$newBlue: #314852
.footer,
.upper-section
  background: rgb(223, 246, 255)
  .content
    color: $black
    .title
      color: $newBlue
.toggle
  font-family: $family-monospace
  text-transform: uppercase
.animal-selector
  background: #fff6e1
  position: relative
  &:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    pointer-events: none
    box-shadow: inset -2px 1px 2px #00000052
    @media screen and (min-width: 1210px)
      box-shadow: none
  .sel
    max-width: 1280px
    margin: auto


  ::v-deep .dangers path
    stroke: #fff6e1

.survivors
  color: #7dd4a9
.deaths
  color: #D03D49
.highlight
  color: $grey
  font-weight: bold
  text-decoration: underline
.negate-space
  margin-top: -2.2rem
.pad
  margin-top: 1rem
.chart
  margin: 0.5rem 80px 80px 0
  font-family: $family-monospace

  @media screen and (max-width: $tablet)
    margin-left: 3ex
    margin-right: 0

.animal-select
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
.poi
  position: absolute
  bottom: 0
  left: 0
  line-height: 1
  text-align: center
  width: 50px
  margin-left: -25px
  .on-axis
    position: absolute
    top: 0
    left: 0
    transform: translate(23px, -30px)
  .nib
    width: 11px
    height: 11px
    background: $newBlue
    border-radius: 50%
    animation: swell 2s infinite;

@keyframes swell
  $start: transparentize($newBlue, 0.1)
  $end: transparentize($newBlue, 1)
  0%
    box-shadow: inset 0 0 0 1000px $end, 0 0 0 0px $end
    border-color: $end
  2%
    box-shadow: inset 0 0 0 1000px $start, 0 0 0 0px $start
    border-color: $start
  100%
    box-shadow: inset 0 0 0 1000px $end, 0 0 0 5px $end
    border-color: $end
</style>
