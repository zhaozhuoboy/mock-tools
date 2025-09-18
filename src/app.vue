<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <NMessageProvider>
      <NNotificationProvider>
        <NLoadingBarProvider>
          <NDialogProvider>
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
          </NDialogProvider>
        </NLoadingBarProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
<script>
import { watch } from 'vue'
import { zhCN, dateZhCN, NConfigProvider, NMessageProvider, NNotificationProvider, NLoadingBarProvider, NDialogProvider } from 'naive-ui'
import { useBaseStore } from '@/store/base'

export default {
  name: 'NuxtApp',
  components: {
    NConfigProvider,
    NMessageProvider,
    NNotificationProvider,
    NLoadingBarProvider,
    NDialogProvider
  },
  setup () {
    useHead({
      titleTemplate: (titleChunk) => {
        console.log('titleChunk', titleChunk)
        return titleChunk ? `${titleChunk} - Mock Tool` : 'Mock Tool';
      }
    })

    const baseStore = useBaseStore()
    const theme = computed(() => baseStore.theme)

    watch(() => theme.value, (val) => {
      console.log(
        'theme change',
        val
      )
    })

    const checkMobile = () => {
      const ua = navigator.userAgent.toLowerCase()
      if (/ipad/i.test(ua)) {
        return window.innerWidth <= 1024
      } else {
        return /iphone|android|ucweb|ucbrowser|nokia|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|cldc|midp|wap|mobile/i.test(ua) || window.innerWidth <= 860
      }
    }

    const setMobile = (mobile) => {
      baseStore.isMobile = mobile
    }

    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // 自定义 vh 单位
    const initVh = () => {
      setVh()

      window.addEventListener('resize', setVh)
    }

    const initAttribute = (isMobile) => {
      setMobile(isMobile)
      document.body.setAttribute('app-layout-type', isMobile ? 'mobile' : 'pc')
    }

    onMounted(() => {
      window.addEventListener('resize', () => {
        initAttribute(checkMobile())
      })

      initVh()
      initAttribute(checkMobile())
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', () => {})
    })

    return {
      theme,
      zhCN,
      dateZhCN
    }
  }
}


</script>
<style lang="scss">
body {
  margin: 0;
}
</style>
