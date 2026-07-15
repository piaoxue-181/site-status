<template>
  <div class="feedback" v-if="statusStore.loginStatus">
    <div id="tcomment" ref="commentContainer"></div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { t, setLocale } = useI18n()
const statusStore = useStatusStore()
const { siteTitle } = config.public

// 动态 head
useHead({
  title: computed(() => siteTitle + t('dashboard.name')),
  htmlAttrs: {
    lang: computed(() => statusStore.siteLang)
  }
})

useFavicon('/favicon.ico')

// 同步语言设置
watch(
  () => statusStore.siteLang,
  (lang) => setLocale(lang),
  { immediate: true }
)

const commentContainer = ref<HTMLElement | null>(null)
let isInitialized = false

const loadScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.twikoo) {
      resolve()
      return
    }
    const existing = document.querySelector('script[src*="twikoo.min.js"]')
    if (existing) {
      if (window.twikoo) resolve()
      else {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject())
      }
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.14/dist/twikoo.min.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Load failed'))
    document.head.appendChild(script)
  })
}

const initTwikoo = async () => {
  if (isInitialized || !commentContainer.value) return
  try {
    await loadScript()
    if (typeof window.twikoo?.init !== 'function') {
      console.error('twikoo not ready')
      return
    }
    window.twikoo.init({
      envId: 'https://twikoo.blowswind.cn/.netlify/functions/twikoo',
      el: commentContainer.value,
      path: '/admin/feedback',
      lang: 'zh-CN',
    })
    isInitialized = true
  } catch (err) {
    console.error('Twikoo init error:', err)
  }
}

onMounted( async () => {
  const checkSite = inject('checkSite');
  await checkSite?.();
  if (!statusStore.loginStatus) {
    window.$message.warning(t("dashboard.last"));
    statusStore.siteData = undefined;
    navigateTo("/login");
  }
  await initTwikoo()
})
</script>

<style scoped>
.feedback {
  animationDelay: 0.1s;
  padding: 20px 20px 20px;
  min-height: 300px; 
  max-height: 90vh;
  background: var(--main-card-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 90;
  overflow: hidden;
  border-radius: 8px;
  box-sizing: border-box;
}
</style>