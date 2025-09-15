<template>
  <div :class="$style['page-index']">
    <!-- <div :class="$style['logo']">
      <img src="~/assets/img/article-default.jpg" alt="" />
    </div> -->
    <Welcome />
  </div>
</template>

<script>
export default {
  name: 'page-index',
  setup () {
  }
}
</script>

<style lang="scss" module>
.page-index {
}

.logo {
  width: 600px; height: fit-content;

  & img {
    width: 100%; height: auto;
  }
}
</style>
