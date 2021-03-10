<template>
  <a :href="url" target="blank" class="reference-link">{{url | truncate(50)}}</a>
</template>
<script>
export default {
  name: 'ReferenceLink'
  , props: ['url']
}
</script>
