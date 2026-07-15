<template>
    <main id="main" v-if="statusStore.loginStatus">
        1111
    </main>
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

onMounted(async () => {
  const checkSite = inject('checkSite');
  await checkSite?.();
  if (!statusStore.loginStatus) {
    window.$message.warning(t("dashboard.last"));
    statusStore.siteData = undefined;
    navigateTo("/login");
  }
});
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
</style>