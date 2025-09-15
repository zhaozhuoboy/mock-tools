<template>
  <div :class="$style['footer']">
    <p class="text-center">
      Copyright © {{ year }} <a href="https://github.com/zhaozhuoboy" target="_blank">Nuxt Starter - By zhaozhuo</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'common-footer',
  setup () {
    const year = new Date().getFullYear()

    return {
      year
    }
  }
}
</script>

<style lang="scss" module>
.footer {}
</style>
