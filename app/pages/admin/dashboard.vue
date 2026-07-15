<template>
  <main id="main" v-if="statusStore.loginStatus">
    <n-flex justify="space-between" wrap style="margin-bottom: 24px;">
      <!-- 卡片 1 -->
      <n-card
        style="flex: 1; animationDelay: 0.1s; border-left: 7px solid var(--normal-color);"
        class="site-item"
        hoverable
      >
        <n-flex vertical justify="space-between" style="height: 100%;">
          <!-- 左上：站点名称 + 数字（垂直排列） -->
          <n-flex vertical :size="0">
            <n-text class="site-name" style="color: var(--normal-color);">正常站点</n-text>
            <n-text class="site-message">7</n-text>
          </n-flex>
          <!-- 右下：标签气泡 -->
          <n-flex justify="flex-end">
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>90%</n-tag>
              </template>
              <n-text>还可以吧~</n-text>
            </n-popover>
          </n-flex>
        </n-flex>
      </n-card>

      <!-- 卡片 2 -->
      <n-card
        style="flex: 1; animationDelay: 0.1s; border-left: 7px solid var(--warn-color);"
        class="site-item"
        hoverable
      >
        <n-flex vertical justify="space-between" style="height: 100%;">
          <n-flex vertical :size="0">
            <n-text class="site-name" style="color: var(--warn-color);">正常站点</n-text>
            <n-text class="site-message">6</n-text>
          </n-flex>
          <n-flex justify="flex-end">
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>90%</n-tag>
              </template>
              <n-text>还可以吧~</n-text>
            </n-popover>
          </n-flex>
        </n-flex>
      </n-card>

      <!-- 卡片 3 -->
      <n-card
        style="flex: 1; animationDelay: 0.1s; border-left: 7px solid var(--error-color);"
        class="site-item"
        hoverable
      >
        <n-flex vertical justify="space-between" style="height: 100%;">
          <n-flex vertical :size="0">
            <n-text class="site-name" style="color: var(--error-color);">正常站点</n-text>
            <n-text class="site-message">8</n-text>
          </n-flex>
          <n-flex justify="flex-end">
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>90%</n-tag>
              </template>
              <n-text>还可以吧~</n-text>
            </n-popover>
          </n-flex>
        </n-flex>
      </n-card>

      <!-- 卡片 4 -->
      <n-card
        style="flex: 1; animationDelay: 0.1s; border-left: 7px solid var(--unknown-color);"
        class="site-item"
        hoverable
      >
        <n-flex vertical justify="space-between" style="height: 100%;">
          <n-flex vertical :size="0">
            <n-text class="site-name" style="color: var(--unknown-color);">正常站点</n-text>
            <n-text class="site-message">9</n-text>
          </n-flex>
          <n-flex justify="flex-end">
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>90%</n-tag>
              </template>
              <n-text>还可以吧~</n-text>
            </n-popover>
          </n-flex>
        </n-flex>
      </n-card>
    </n-flex>
    <!-- 下部区域 -->
    <n-flex :size="16" wrap>
      <!-- 左侧 Release -->
      <n-flex vertical :size="0" style="flex: 2;">
        <n-card
          style="flex: 2; animationDelay: 0.2s;"
          class="releases-item"
          hoverable
        >
          <n-flex vertical justify="space-between" style="height: 100%;">
            <n-flex vertical :size="0">
              <n-text class="site-name" style="color: var(--unknown-color);">
                时过境迁 · {{ releases.length ? releases[0].tag_name : '' }}
              </n-text>
              <n-text v-if="releases.length" size="small" depth="3">
                发布于 {{ new Date(releases[0].published_at).toLocaleDateString() }}
              </n-text>
            </n-flex>

            <n-flex vertical class="flex" :size="8" v-if="releases.length">
              <n-text v-for="release in releases" :key="release.id">
                <strong style="color: var(--normal-color); font-weight: bold;">{{ release.tag_name }}</strong>
                <span v-html="release.body ? renderMarkdown(release.body) : '无更新说明'"></span>
              </n-text>
            </n-flex>
            <n-flex v-else justify="center" style="padding: 20px 0;">
              <n-spin v-if="loading" size="small" />
              <n-text v-else depth="3">暂无 Release 数据</n-text>
            </n-flex>
          </n-flex>
        </n-card>
      </n-flex>
      <n-flex vertical :size="12" style="flex: 1;">
        <n-card
          class="server-item"
          hoverable
          style="flex: 1; animationDelay: 0.2s;"
        >
          <n-flex vertical justify="space-between" style="height: 100%; padding: 8px 0;">
            <!-- 标题 -->
            <n-flex vertical :size="0">
              <n-text class="site-name" style="color: var(--normal-color);">个人信息</n-text>
            </n-flex>

            <!-- 头像居中 -->
            <n-flex justify="center">
              <NuxtImg
                src="https://image.blowswind.cn/v2/Bc7hWrr.jpeg"
                width="80"
                height="80"
                style="border-radius: 50%; object-fit: cover;"
                placeholder
                placeholder-img="/images/loading.gif"
              />
            </n-flex>

            <!-- 名字居中 -->
            <n-flex justify="center">
              <n-text style="font-size: 2vh; font-weight: bold; color: var(--text-color);">
                斥念
              </n-text>
            </n-flex>

            <!-- 描述居中 -->
            <n-flex justify="center">
              <n-text style="font-size: 1.6vh; color: var(--text-color); opacity: 0.7;">
                斥去想念
              </n-text>
            </n-flex>

            <!-- 其他信息（点击跳转） -->
            <n-flex vertical :size="4">
              <n-flex justify="start" align="center" :size="4" @click="goTo('https://github.com/piaoxue-181')" style="cursor: pointer;">
                <Icon name="icon:github" size="16" />
                <n-text style="font-size: 1.4vh;">GITHUB：piaoxue-181</n-text>
              </n-flex>
              <n-flex justify="start" align="center" :size="4" @click="goTo('mailto:admin@blowswind.cn')" style="cursor: pointer;">
                <Icon name="icon:email" size="16" />
                <n-text style="font-size: 1.4vh;">EMAIL：admin@blowswind.cn</n-text>
              </n-flex>
              <n-flex justify="start" align="center" :size="4" @click="goTo('https://www.blowswind.cn')" style="cursor: pointer;">
                <Icon name="icon:home" size="16" />
                <n-text style="font-size: 1.4vh;">主页：https://www.blowswind.cn</n-text>
              </n-flex>
            </n-flex>
          </n-flex>
        </n-card>
        <n-card
          class="server-item"
          hoverable
          style="flex: 1; animationDelay: 0.2s;"
        >
          <n-flex vertical justify="space-between" style="height: 100%;">
            <n-flex vertical :size="0">
              <n-text class="site-name" style="color: var(--normal-color);">部署环境</n-text>
            </n-flex>
            <n-flex :size="0" justify="center" align="center">
              <Icon 
                :name="platformIcon" 
                style="width: 100%; height: 15vh" 
              />
              <n-text 
                class="site-name"
              >
                {{ platform in map && platform !== 'auto' && platform !== 'self-host' ? platform : '自建' }}
              </n-text>
            </n-flex>
          </n-flex>
        </n-card>
      </n-flex>
    </n-flex>
  </main>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { t, setLocale } = useI18n()
const statusStore = useStatusStore()
const { siteTitle, platform } = config.public
import markdownit from 'markdown-it'
import DOMPurify from 'dompurify'
import { Icon } from "#components";

const map: Record<string, string> = {
  vercel: 'icon:vercel',
  netlify: 'icon:netlify',
  'cloudflare': 'icon:cloudflare',
  'self-host': 'icon:server',
}

// 图标名称映射（根据你的图标库调整）
const platformIcon = computed(() => {
  return map[platform] || 'icon:server'
})

const goTo = (url: string) => {
  window.open(url, '_blank')
}

const md = markdownit({
    html: true,          // 允许内联 HTML（例如 <br>）
    linkify: true,       // 自动识别链接
    typographer: true,   // 优化排版（引号、破折号等）
})

// 渲染并净化函数
const renderMarkdown = (raw: string | null | undefined): string => {
  if (!raw) return ''
  const html = md.render(raw)
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }, // 安全的白名单配置
  })
}
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

const releases = ref<any[]>([]);
const loading = ref(false);

const githubApi = async (repoPath: string) => {
  const url = `https://api.github.com/repos/${repoPath}/releases`;
  try {
    const data = await $fetch(url, { timeout: 10000 });
    return data;
  } catch (error) {
    console.error('获取 Releases 失败:', error);
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        window.$message.error('API 请求频率过高，请稍后重试');
      } else if (status === 404) {
        window.$message.error('仓库或 Release 不存在');
      } else {
        window.$message.error(`服务器错误 (${status})`);
      }
    } else if (error.name === 'TimeoutError') {
      window.$message.error('请求超时，请检查网络');
    } else {
      window.$message.error('网络异常，请重试');
    }
    return null;
  }
};

const fetchReleases = async (repoPath: string) => {
  loading.value = true;
  try {
    const data = await githubApi(repoPath);
    releases.value = data || [];
  } catch (e) {
    releases.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const checkSite = inject('checkSite');
  await checkSite?.();
  if (!statusStore.loginStatus) {
    window.$message.warning(t("dashboard.last"));
    statusStore.siteData = undefined;
    navigateTo("/login");
  }
  await fetchReleases('imsyy/site-status');
});
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  flex-direction: column;
  margin: 30px auto 20px;
  padding: 0 20px;
  .site-item {
    width: 40vh;
    height: 15vh;
    opacity: 0;
    border-radius: 12px;
    animation: float-up 0.5s forwards;
    overflow: hidden;
    .site-name {
      font-size: 1.8vh;
      font-weight: bold;
    }
    .site-message {
      font-size: 3vh;
      font-weight: bold;
    }
  }
  .releases-item {
    opacity: 0;
    border-radius: 12px;
    animation: float-up 0.5s forwards;
    overflow: hidden;
    .flex {
      height: 60vh;
      overflow-y: auto;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--border-color, #d9d9d9);
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: var(--text-color, #888);
      }
    }
  }
  .server-item {
    min-height: 20vh; 
    height: auto; 
    overflow: auto; 
    opacity: 0;
    border-radius: 12px;
    animation: float-up 0.5s forwards;
    .site-name {
      font-size: 1.8vh;
      font-weight: bold;
    }
  }
  &.loading {
    .site-item {
      min-height: 200px;
      :deep(.n-card__content) {
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .n-spin-body {
      --n-size: 40px;
      --n-color: var(--color);
    }
  }
}
@keyframes float-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>