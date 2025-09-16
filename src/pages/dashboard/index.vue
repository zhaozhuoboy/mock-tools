<template>
  <div :class="$style['page-dashboard']">
    <h1>Dashboard</h1>

    <div :class="$style['content']">
      
    </div>

    <div :class="$style['footer']">
      foot
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-dashboard',
  setup () {
    definePageMeta({
      layout: 'admin'
    })
  }
}
</script>

<style lang="scss" module>
.page-dashboard {
  padding: 20px;
}

.content {
  min-height: 3000px;
}
</style>
