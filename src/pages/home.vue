<template lang="pug">
.home
  .section.upper-section
    .container
      .content
        h1.title.is-size-1 Survival Curves
        .columns
          .column
            p.
              If you've ever been curious how long, say, dogs live on average,
              you may have gone online and typed out a search term like:
              <em>life expectancy dogs</em>. And google (or bing, if you're
              a committed nonconformist) would have given you a number.
            p.
              But sometimes getting numeric answers isn't quite that easy.
              As Douglas Adams reminded us in the "Hitchhiker's Guide to the Galaxy",
              if you get an answer of 42, you may need to check what the actual
              question was...
            p.
              And so it is the same with <em>life expectancy</em>.
            p.
              As David nicely explains in <a href="" target="_blank">this MinuteEarth video</a>,
              life expectancy is an answer to several different questions:

            ol
              li How long, on average, do individuals live after birth?
              li How long, on average, do individuals live after infancy?
              li What is the longest time we know some individual has ever lived?

          .column
            ResponsiveEmbed(:ratio="16/9", :max-width="540").
              <iframe width="313" height="176" src="https://www.youtube.com/embed/i2qckcs_tmI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        p.
          So you've got make sure you know which life expectancy is being
          talked about so you can know if it answers the question you care
          about. To clear up all the confusion, this lab lets you browse through
          a few types of animals and see their different life expectancies
          and where they come from.

        p.
          The lab has also got little color bars below the animal icons which
          give a sense of how dangerous different parts of their lives are.
          The first bar measures the danger (average death chance) right after being born.
          The second measures the average danger through to 60% of their maximum
          lifespan. The last is the danger through the rest of their possible lifespan up to
          the maximum.

        p Without further ado, here are some animals to choose from...
  vue-affix-box(:offset-top="0")
    .animal-selector
      AnimalSelection.sel(@select="selectAnimal($event, name)", v-model="selectedName")
  .section
    .container
      .is-flex.is-flex-direction-column.is-align-items-center
        .heading.title.is-size-2 {{ selectedName }}
        LifeMeter(:labels="true", :data="selected", :thumb="selectedThumb")

      //- .content.has-text-centered
      //-   h2.is-size-3.title Survival / Death

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
              <span class="highlight">{{ selectedName | titleCase }}</span> mostly live around
              <span class="highlight">{{longevityStats.expectation.toFixed(0)}} years</span> after birth.

            h6.heading.is-size-6 Life Expectancy After Infancy
            p.
              For some animals, like dogs, we care more how long they're going to live after infancy.
              If we only take into account data after the first year of life, we get the
              <em>life expectancy after infancy</em>. <span class="highlight">{{ selectedName | titleCase }}</span>
              who have succesfully lived a year after birth will likely live to be around
              <span class="highlight">{{longevityStats.afterChildhood.toFixed(0)}} years old</span>.

            p.
              But there's always a chance of beating the odds, right?

            h6.heading.is-size-6 Maximum Life Expectancy
            p.
              The oldest in this dataset is <span class="highlight">{{longevityStats.max.toFixed(0)}} years old</span>,
              but the oldest any <span class="highlight">{{ selectedName | titleCase }}</span>
              have ever lived to be is <span class="highlight">{{oldestEver.toFixed(0)}} years old</span>.

        .column.negate-space.center-mobile
          b-field.toggle
            b-switch(v-model="showAlive", :true-value="false", :false-value="true") Only deaths
          StackedBarChart.chart(
            :animate="true",
            :width="plotWidth",
            :series="series",
            :range="[0, 1]",
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
      //- .content.has-text-centered
      //-   h2.is-size-3.title Chance of Dying

      .columns.pad.is-flex-direction-row-reverse.is-desktop
        .column
          .content
            h2.is-size-4.title Chance of Dying Within a Year
            p.
              This shows how likely it is for <span class="highlight">{{ selectedName | titleCase }}</span>
              of a particular age to die within a year. That probability is just the number
              of deaths in the next year divided by the number still alive this year.
              <em>(This may or may not be the same as the next red bar divided by the current green bar
              from the previous graph. If the bars span more than one year, we extrapolate
              what they would yearly.)</em>

            p.
              Earlier in life, if the chance of death is really high, then it often means the
              animals don't invest much to protect their young.
              Instead they may just have tons of babies in the hopes that enough survive.
              A low chance of death could mean that parents take very good care of their
              children, and don't need to have so many.
            p.
              A chance of death that quickly spikes in old age likely means that most
              of the danger comes from the frailty and deterioration of
              growing old.

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
import ALL_ANIMAL_DATA from '@/data/all'
import ThumbImages from '@/assets/animal-thumb-map'
import AnimalSelection from '@/components/AnimalSelection'
import ResponsiveEmbed from '@/components/ResponsiveEmbed'
import Footer from '@/pages/Footer'

export default {
  name: 'Home'
  , components: {
    VueAffixBox
    , StackedBarChart
    , LifeMeter
    , AnimalSelection
    , Footer
    , ResponsiveEmbed
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
    selectAnimal(e, name){
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


</style>
