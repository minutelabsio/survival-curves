<template lang="pug">
  footer.footer
    .container
      .columns
        .column
          .content
            h3.title.is-size-2 More Interactives!
            .media
              .media-left
                .image.is-128x128
                  a(href="https://minutelabs.io")
                    img.is-rounded.has-background-white(src="//cdn.minutelabs.io/logos/logo-minutelabs-no-text.png")
              .media-content
                p Find more "labs" at <a href="https://minutelabs.io">minutelabs.io</a>

            h3.title.is-size-2 Support MinuteLabs

            p.
              I release all content online for free, so user support is the only way I can continue
              making things like this. If my work helps you as much as a cup of coffee does,
              consider supporting current and future work any way you can.

            p Besides sharing the apps with others, here are some other ways to help:

            .columns.is-gapless
              .column
                p
                  a.button.is-info(href="https://github.com/sponsors/wellcaffeinated", target="_blank")
                    b-icon(icon="heart")
                    span Github Sponsors
              .column
                p.
                  <a href="https://www.patreon.com/bePatron?u=617966" target="_blank">
                    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="190">
                  </a>
            h3.title.is-size-2 Credits
            p.
              All of the code was written by yours truly (Jasper), but I couldn't
              have made it without <u>Sarah Berman</u>'s artistic direction and
              drawings, and <u>David Goldenberg</u>'s data research skills.
            p.
              And as always, this was made possible by the support of the
              <a href="https://minuteearth.com" target="_blank">MinuteEarth team</a>.


        .column
          .content
            h3.title.is-size-2 Data Sources
            dl.references
              dt Human
              dd Lifetables from United Nations -
                ReferenceLink(url="https://population.un.org/wpp/Download/Standard/Mortality/")

              dt Human decades (1810, 1860)
              dd Table 8 -
                ReferenceLink(url="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2885717/")

              dt Human decade (1910)
              dd Table 9 -
                ReferenceLink(url="https://www.cdc.gov/nchs/data/lifetables/life1890-1910.pdf")

              dt Human decade (1960)
              dd Table 5 -
                ReferenceLink(url="https://www.cdc.gov/nchs/data/lifetables/life59-61_1_1acc.pdf")

              dt Human decade (2010)
              dd Table 5 -
                ReferenceLink(url="https://www.cdc.gov/nchs/data/nvsr/nvsr63/nvsr63_07.pdf")

              dt Dog
              dd.
                Using a combination of <ReferenceLink url="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6068313/"/>
                (for past 1 year old) and <ReferenceLink url="https://www.researchgate.net/publication/319550148_A_review_of_Neonatal_mortality_in_Dogs"/> (to get 30% mortality in &lt; 1 year old puppies)

              dt Loggerhead Sea Turtles
              dd <ReferenceLink url="https://www.dropbox.com/s/e0rt3oqgiopcakm/A_Stage-Based_Population_Model_for_Loggerhead_Sea_.pdf?dl=0"/>

              dt Robin, Lapwing, Dall Mountain Sheep, Herring Gull, Fin Whales
              dd
                ReferenceLink(url="https://www.dropbox.com/s/9s0ox5wej84hg96/animallifetables.pdf?dl=0")

              dt Gopher Tortoises
              dd
                ReferenceLink(url="https://shareok.org/bitstream/handle/11244/321235/oksd_hellgren_variationintort_2000.pdf")

              dt Beavers
              dd (Table 1) of &nbsp;
                ReferenceLink(url="https://royalsocietypublishing.org/doi/pdf/10.1098/rstb.2014.0221")

              dt Cats
              dd
                ReferenceLink(url="https://www.jstage.jst.go.jp/article/jvms1939/51/5/51_5_905/_pdf")

              dt Red Wolf
              dd Extrapolated from &nbsp;
                ReferenceLink(url="https://www.fws.gov/southeast/pdf/report/red-wolf-population-viability-analysis-faust-et-al-2016.pdf")

            h3.title.is-size-3 Source Code
            p.
              As always, freely available on
              <a href="https://github.com/minutelabsio/survival-curves" target="_blank">github</a>.

            h3.title.is-size-3 Bug Reports
            p.
              If you find a bug, you can post it on
              <a href="https://www.patreon.com/minutelabsio" target="_blank">patreon</a>,
              <a href="mailto:bugs@minutelabs.io">email me</a>,
              or post it on <a href="https://github.com/minutelabsio/survival-curves" target="_blank">github</a>.
</template>

<script>
import ReferenceLink from '@/components/ReferenceLink'
export default {
  components: {
    ReferenceLink
  }
}
</script>

<style lang="sass" scoped>
.references
  overflow: hidden
  dt
    font-weight: bold
    color: $newBlue
  dd
    margin: 0
    margin-bottom: 0.5em
  .reference-link
    font-family: $family-monospace
    letter-spacing: -0.2px
</style>
