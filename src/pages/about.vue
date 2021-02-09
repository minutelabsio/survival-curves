<template lang="pug">
.about
  .inner.scrollbars
    .container
      .section
        .content
          .level
            .level-left
              router-link(:to="{ name: 'home' }")
                b-icon(icon="chevron-left")
                span Back to the Lab
            .level-right
              a(href="https://minutelabs.io", target="_blank")
                span See more Labs!
                b-icon(icon="launch", size="is-small")

          .logo
            figure.image.is-128x128
              img.is-rounded.has-background-white(src="//cdn.minutelabs.io/logos/logo-minutelabs-no-text.png")

          h1.title.has-text-centered Project
          p.
            Project Info
</template>

<style lang="sass" scoped>
a
  color: $text
  text-decoration: underline
  .icon
    vertical-align: middle
    padding-bottom: 4px
.about
  position: relative
  z-index: 1
  font-family: $family-sans-serif
  font-size: 18px
  height: 100%
  overflow: auto

.inner
  min-height: 100%
  max-width: 1080px
  margin: auto
.logo .image
  margin: auto
</style>
