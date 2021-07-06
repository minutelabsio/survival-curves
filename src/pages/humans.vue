<template lang="pug">
.humans
  .section.upper-section
    .container
      .content
        h1.title.is-size-1 Human Data Over Time<sup>*</sup>
        .columns
          .column
            p.
              (If you haven't seen the <router-link :to="{ name: 'home' }">animal data yet, start with that!</router-link>)
            p.
              As David describes in this follow up video, getting data for humans
              across different decades is a bit tricky. But there are some interesting
              things to be seen nonetheless.

            p.
              One particularly interesting feature that wasn't mentioned in the video
              is the increase of deaths the 1860's for men in their 20's and 30's. You can see this clearly
              by toggling the "Only Deaths" switch and looking at how the red bars
              change between 1810 and 1860. This is due to the american civil war
              causing a lot of those deaths.

            p.
              The life meter colors have been rescaled to show contrast between decades.
              To get an acurate measure of old age with varied data points, we are comparing
              the yearly death risk at age 75 for the old age color bar.

          .column
            ResponsiveEmbed(:ratio="16/9", :max-width="540").
              <iframe width="313" height="176" src="https://www.youtube.com/embed/c_ADG3Qc6rI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        p
          em.
            <sup>*</sup> This historical data is specific to a small subset of humans
            for which we could get data; white US males.

  vue-affix-box(:offset-top="0")
    .animal-selector
      DecadeSelection.sel(@select="selectDecade($event, name)", v-model="selectedName", :riskDomain="riskDomain")
  .section
    .container
      .is-flex.is-flex-direction-column.is-align-items-center
        LifeMeter(:labels="true", :data="selected", :riskDomain="riskDomain")
          template(#thumb)
            .decade-thumb
              span {{ selectedName }}'s
      .columns.pad.is-flex-direction-row-reverse.is-desktop
        .column
          .content
            h2.is-size-4.title
              span.survivors Survival
              span=" / "
              span.deaths Death

            p.
              Every <span class="survivors">green block</span> shows the fraction of individuals that are still alive
              when they reach that age. The <span class="deaths">red blocks</span> show the fraction
              that died since the previous age group.

            h6.heading.is-size-6 Life Expectancy at Birth
            p.
              If we add up all the areas of the red blocks (deaths) and divide by 100%, we get the
              expected age an individual would die at (aka: <em>life expectancy at birth</em>).
              In <span class="highlight">{{ selectedName | titleCase }}</span> the life expectancy is around
              <span class="highlight">{{longevityStats.expectation.toFixed(0)}} years</span> after birth.

            h6.heading.is-size-6 Life Expectancy After Infancy
            p.
              For some animals, like dogs, we care more how long they're going to live after infancy.
              If we only take into account data after the first year of life, we get the
              <em>life expectancy after infancy</em>. In <span class="highlight">{{ selectedName | titleCase }}</span>
              those who have succesfully lived a year after birth will likely live to be around
              <span class="highlight">{{longevityStats.afterChildhood.toFixed(0)}} years old</span>.

            p.
              You can see that in recent years, this value is very close to the life expectancy
              at birth because we're getting better at preventing newborns from dying.

        .column.negate-space.center-mobile
          b-field.toggle
            b-switch(v-model="showAlive", :true-value="false", :false-value="true") Only deaths
          StackedBarChart.chart(
            :animate="true",
            :width="plotWidth",
            :series="series",
            :xvalues="xvalues",
            :range="[0, 1]",
            :barMargin="0.1",
            :tick-format="showPercent ? '%' : null"
          )
            template(#under="{ xscale }")
              //- .poi(:style="{ transform: `translateX(${xscale(longevityStats.max)}px)` }")
              //-   .on-axis
              //-     b-tooltip(:label="`longest living in batch: ${longevityStats.max.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
              //-       .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.afterChildhood)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy after year 1: ${longevityStats.afterChildhood.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
              .poi(:style="{ transform: `translate(${xscale(longevityStats.expectation)}px, 0)` }")
                .on-axis
                  b-tooltip(:label="`life expectancy: ${longevityStats.expectation.toFixed(0)} years`", type="is-light", position="is-bottom", multilined)
                    .nib
      .columns.pad.is-flex-direction-row-reverse.is-desktop
        .column
          .content
            h2.is-size-4.title Chance of Dying Within a Year
            p.
              This shows how likely it is in <span class="highlight">{{ selectedName | titleCase }}</span>
              for a person of a particular age to die within a year. That probability is just the number
              of deaths in the next year divided by the number still alive this year.
              <em>(This may or may not be the same as the next red bar divided by the current green bar
              from the previous graph. If the bars span more than one year, we extrapolate
              what they would be yearly.)</em>

            p.
              For some decades, the data for later years is sparse and so the risk of death
              is hard to estimate. Above age 75 or so, don't count on this value being accurate.

        .column.center-mobile
          StackedBarChart.chart(
            :width="plotWidth",
            :series="[{ values: deathChance.map(v => v[1]), color: '#D03D49' }]",
            :xvalues="deathChance.map(v => v[0])",
            :range="[0, 1]",
            :barMargin="0",
            tick-format="%"
          )
  Footer
</template>

<script>
import VueAffixBox from 'vue-affix-box'
import { bin } from 'd3-array'
import _throttle from 'lodash/throttle'
import StackedBarChart from '@/components/StackedBarChart'
import LifeMeter from '@/components/LifeMeter'
import DataByYear from '@/data/human-history/all'
import ThumbImages from '@/assets/animal-thumb-map'
import DecadeSelection from '@/components/DecadeSelection'
import ResponsiveEmbed from '@/components/ResponsiveEmbed'
import Footer from '@/pages/Footer'

export default {
  name: 'Home'
  , components: {
    VueAffixBox
    , StackedBarChart
    , LifeMeter
    , DecadeSelection
    , Footer
    , ResponsiveEmbed
  }
  , data: () => ({
    datasetList: DataByYear
    , thumbs: ThumbImages
    , selectedName: '1810'
    , showPercent: true
    , plotWidth: 300

    , showDead: true
    , showAlive: true

    , riskDomain: [0.01, 0.075, 0.15]
  })
  , mounted(){
    const onResize = _throttle(() => {
      let w = Math.min(720, window.innerWidth)
      this.plotWidth = Math.floor(w - 2 * 50)
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
    , oldestEver(){ return this.selected.maxLifetime }
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
    selectDecade(e, name){
      this.selectedName = name
    }
  }

}
</script>

<style lang="sass" scoped>
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
  .is-fixed &
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25)
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
.center-mobile
  @media screen and (max-width: $desktop)
    display: flex
    flex-direction: column
    align-items: center

.survivors
  color: #7dd4a9
.deaths
  color: #D03D49
.highlight
  color: $grey
  font-weight: bold
  text-decoration: underline
.negate-space
  @media screen and (min-width: $desktop)
    margin-top: -2.2rem

.pad
  margin-top: 1rem
.chart
  max-width: 100%
  // overflow: hidden
  margin: 0.5rem 0px 0 0
  font-family: $family-monospace

  @media screen and (max-width: $desktop)
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
  transition: transform 0.35s ease
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
    animation: swell 2s infinite

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
    box-shadow: inset 0 0 0 1000px $end, 0 0 0 8px $end
    border-color: $end

.decade-thumb
  height: 100%
  border-radius: 50%
  font-size: 67px
  line-height: 3.25
  text-align: center
  background: #d4ac9f
  color: darken(#d4ac9f, 62)
</style>
