<template>
  <div :class="$style['layout-admin']">
    <div :class="$style['left']">
      
    </div>
    <div :class="$style['right']">
      <header :class="$style['header']">
        头部导航
      </header>

      <main :class="$style['main']">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout-admin'
}
</script>

<style lang="scss" module>
.layout-admin {
  display: flex;
  width: 100%; height: 100vh;
}

.left {
  flex-shrink: 0;
  width: 256px;
  background-color: #fafafa;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky; top: 0; z-index: 100;
  flex-shrink: 0;
  width: 100%; height: 56px;
  background-color: orchid;
}

.main {
  box-sizing: border-box;
  flex-grow: 1;
  height: 0;
  padding: 16px;
  overflow-y: auto;
}
</style>
