<template>
  <link rel="preconnect" href="https://captcha.blowswind.cn" />
  <link rel="dns-prefetch" href="https://captcha.blowswind.cn" />
  <GlobalProvider>
    <n-scrollbar
      :content-style="{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
      style="height: 100vh"
      @scroll="siteScroll"
    >
      <Transition name="fade">
        <SiteHeader v-if="route.path !== '/login'" />
      </Transition>
      <SiteNav />
      <DashboardSide v-if="route.path.includes('/admin/')"/>
      <NuxtPage :style="route.path.includes('/admin/') ? 'position: fixed;left: 28vh;top: 10vh;' : ''"/>
      <Transition name="fade">
        <SiteFooter v-if="!route.path.includes('/admin/')" />
      </Transition>
      <!-- 回到顶部 -->
      <n-back-top :visibility-height="10" />
    </n-scrollbar>
  </GlobalProvider>
</template>

<script setup lang="ts">
const statusStore = useStatusStore();
const route = useRoute()

// 加载状态
const siteLoaded = ref<boolean>(false);
provide('siteLoaded', siteLoaded);

// 验证状态
const checkSite = async () => {
  try {
    const result = await $fetch("/api/check", { method: "POST" });
    // 更改登录状态
    statusStore.loginStatus = result.code === 200;
  } catch (error) {
    console.error("error in checkSite", error);
  } finally {
    siteLoaded.value = true;
  }
};

provide('checkSite', checkSite);

// 页面滚动
const siteScroll = (e: Event) => {
  // 滚动高度
  const scrollTop = (e.target as HTMLElement).scrollTop;
  statusStore.scrollTop = scrollTop;
};
</script>