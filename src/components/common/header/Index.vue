<template>
  <div :class="$style['common-header']">
    <HeaderWeb />
  </div>
</template>

<script>
import HeaderWeb from './HeaderWeb.vue'
export default {
  name: 'common-header',
  components: {
    HeaderWeb
  }
}
</script>

<style lang="scss" module>
.common-header {}
</style>
