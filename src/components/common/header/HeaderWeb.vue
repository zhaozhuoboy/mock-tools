<template>
  <div :class="$style['header']">
    <div :class="$style['inner']">
      <div :class="$style['logo']">
        Nuxt + Naive + Pinia
      </div>
      <nav :class="$style['nav-wrap']">
      </nav>

      <div :class="$style['account']">
        登录/注册
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header-web'
}
</script>

<style lang="scss" module>
.header {
  @extend %center;
  height: 60px;
  box-shadow: 0 1px 20px rgba($color: #000000, $alpha: 0.1);
}

.inner {
  flex-grow: 1;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  @extend %center;
  height: 60px;
  padding: 0 20px;
  @include font(20, 500);
}

.nav-wrap {
  @extend %center;
  margin: 0 30px;
}

.account {
  margin-left: auto;
  padding: 0 20px;
}
</style>
