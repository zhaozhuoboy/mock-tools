<template>
  <div :class="$style['page-prifile']">
    profile {{ $route.params.uid }}
  </div>
</template>

<script>
import { useRoute } from 'vue-router'


export default {
  name: 'page-prifile',
  setup () {
    definePageMeta({
      title: '个人主页',
      validate: async (route) => {
        const uid = route.params.uid
        console.log('uid', uid)
        // 判断uid 是否合法然后返回true 或者重定向到 404
        return true
      }
    })

    const route = useRoute()

    useSeoMeta({
      title: 'My Amazing Site' +  route.params.uid,
      ogTitle: 'My Amazing Site',
      description: 'This is my amazing site, let me tell you all about it.',
      ogDescription: 'This is my amazing site, let me tell you all about it.',
      ogImage: 'https://example.com/image.png',
      twitterCard: 'summary_large_image',
    })
  }
}
</script>

<style lang="scss" module>
.page-prifile {
  color: #000;
}
</style>
