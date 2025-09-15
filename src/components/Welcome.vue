<template>
  <div :class="$style['welcome']">

    <h1 class="text-3xl font-bold">
      Hello 快速启动
    </h1>
    <div :class="$style['demo']">
      <NButton @click="toggleTheme">切换主题: {{ currentTheme }}</NButton>
    </div>

    <div :class="$style['list']">
      <template :key="item.name" v-for="item in blocks">
        <a :href="item.link" target="_blank">
          <NCard :class="$style['card']">
            <div :class="$style['block']">
              <div :class="$style['logo']">
                <img :src="item.icon" alt="">
              </div>
              <span :class="$style['label']">{{ item.name }}</span>
            </div>
          </NCard>
        </a>
      </template>
    </div>
    
  </div>
</template>

<script>
import { NButton, darkTheme, NCard } from 'naive-ui'
import { useBaseStore } from '@/store/base'
import navieLogo from '../assets/img/naivelogo.svg'
import piniaLogo from '@/assets/img/pinia.svg'
import tailwindLogo from '@/assets/img/tailwind.webp'
export default {
  name: 'welcome',
  components: {
    NButton,
    NCard
  },
  setup () {
    const blocks = [
      {
        name: 'Naive UI',
        icon: navieLogo,
        link: 'https://www.naiveui.com?utm_source=github_zhaozhuoboy'
      },
      {
        name: 'Pinia',
        icon: piniaLogo,
        link: 'https://pinia.vuejs.org/?utm_source=github_zhaozhuoboy'
      },
      {
        name: 'Tailwind CSS',
        icon: tailwindLogo,
        link: 'https://tailwindcss.com'
      }
    ]

    const baseStore = useBaseStore()
    const theme = computed(() => baseStore.theme)

    const currentTheme = computed(() => theme.value ? '暗色' : '浅色')


    const toggleTheme = () => {
      if (!theme.value) {
        baseStore.theme = darkTheme
      } else {
        baseStore.theme = null
      }
    }

    return {
      blocks,
      toggleTheme,
      currentTheme
    }
  }
}
</script>

<style lang="scss" module>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
}

.demo {
  margin-top: 30px;
  // color: #353535;
}

.demo-title {
  line-height: 26px;
  @include font(20, 500);
}

.list {
  display: flex;
  flex-wrap: wrap;
  margin: 50px 0;
  gap: 30px;

  .card {
    transform: all 0.3s ease;
  }

  & a {
    text-decoration: none;
    transform: all 0.3s ease;
  }


  @include sm() {
    & a {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    & .card {
      width: 100%;
    }
  }

  @include lg() {
    flex-direction: row;

    & a {
      width: auto;
    }
    & .card {
      width: auto;
    }
  }

}

.block {
  width: 100px; height: 150px;
  @extend %center;
  flex-direction: column;
  transform: all 0.3s ease;

  @include sm() {
    margin: 0 auto;
  }

  & .logo {
    display: flex;
    width: 80%; height: 100px;

    & img {
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  & .label {
    margin-top: 10px;
    @include font(14, 500);
  }
}
</style>
