<!-- 导航栏 -->
<template>
  <nav id="nav" 
  :class="{ scroll: statusStore.scrollTop > 0 }" 
  :style="{ color: iconColor }" 
  >
    <div class="nav-content" :style="navContentStyle">
      <button tabindex="-1" class="logo" @click="handleLogoClick">{{ config.public.siteTitle }}</button>
      <n-flex align="center" justify="end">
        <!-- 明暗切换 -->
        <Transition name="fade" mode="out-in">
          <n-button
            :key="themeIcon"
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
            @click="toggleTheme"
          >
            <template #icon>
              <Icon :name="themeIcon" />
            </template>
          </n-button>
        </Transition>
        <!-- 语言 -->
        <n-popselect
          v-model:value="statusStore.siteLang"
          :options="langData"
          trigger="click"
        >
          <n-button
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
          >
            <template #icon>
              <Icon name="icon:language" />
            </template>
          </n-button>
        </n-popselect>
        <!-- 菜单 -->
        <n-dropdown trigger="click" :options="navMenu">
          <n-button
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
          >
            <template #icon>
              <Icon name="icon:menu" />
            </template>
          </n-button>
        </n-dropdown>
      </n-flex>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { NIcon, type DropdownOption } from "naive-ui";
import { Icon } from "#components";
import { langData } from "~/assets/data/text";

const { t } = useI18n();
const colorMode = useColorMode();
const config = useRuntimeConfig();
const statusStore = useStatusStore();
const route = useRoute();
const isAdmin = computed(() => route.path.includes('/admin/'));

const navContentStyle = computed(() => ({
  width: isAdmin.value ? '100%' : '900px',
  maxWidth: '100%',
}));
const handleLogoClick = () => {
  // 如果不在首页，则跳转
  if (route.path !== '/') {
    navigateTo('/');
    statusStore.siteData = undefined;
  }
};

// 图标渲染
const renderIcon = (icon: string) => () =>
  h(NIcon, null, () => h(Icon, { name: icon }));

// 导航栏菜单
const navMenu = computed<DropdownOption[]>(() => [
  {
    key: "github",
    label: "GitHub",
    icon: renderIcon("icon:github"),
    props: {
      onClick: () => window.open("https://github.com/imsyy/site-status"),
    },
  },
  {
    key: "about",
    label: t("nav.about"),
    icon: renderIcon("icon:info"),
    props: {
      onClick: () => {
        window.$dialog.info({
          title: "关于",
          content: () => h('div', { style: { fontSize: '16px', fontWeight: 'bold' } }, [
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h(Icon, { name: 'icon:github', size: '1.3em' }),
              h('span', null, 'site-status v' + config.public.version)
            ]),
            h('div', { style: { marginTop: '4px' } }, '作者：imsyy，斥念')
          ]),
          positiveText: "确定",
        });
      },
    },
  },
  {
    ksy: "login",
    label: t("nav.login"),
    show: route.path !== "/login" && !statusStore.loginStatus,
    icon: renderIcon("icon:account"),
    props: {
      onClick: () => {
        navigateTo('/login');
      }
    }
  },
  {
    key: "back",
    label: t("nav.back"),
    show: route.path === "/login",
    icon: renderIcon("icon:baseline-settings-backup-restore"),
    props: {
      onClick: () => {
        statusStore.siteData = undefined;
        navigateTo('/');
      }
    }
  },
  {
    key: "dashboard",
    label: t("nav.dashboard"),
    show: statusStore.loginStatus && !route.path.includes('/admin/'),
    icon: renderIcon("icon:dashboard"),
    props: {
      onClick: () => {
        navigateTo('/admin/dashboard');
      }
    }
  },
  {
    key: "logout",
    label: t("nav.logout"),
    show: statusStore.loginStatus && !route.path.includes('/admin/'),
    icon: renderIcon("icon:logout"),
    props: {
      onClick: () => {
        window.$dialog.warning({
          title: "退出登录",
          content: "确定要退出登录吗?",
          positiveText: "确定",
          negativeText: "取消",
          transformOrigin: "center",
          onPositiveClick: async () => {
            const { code } = await $fetch("/api/logout", {
              method: "POST",
            });
            if (code !== 200) {
              window.$message.error("退出登录失败");
              return;
            }
            window.$message.success("退出登录成功");
            statusStore.loginStatus = false;
            if (route.path.includes("/admin")) statusStore.siteData = undefined;
            localStorage.removeItem("authToken");
            navigateTo('/');
          },
        });
      },
    },
  },
]);

// 模式图标
const themeIcon = computed(() => `icon:${colorMode.preference}-mode`);

// 图标颜色
const iconColor = computed<string | undefined>(() =>
  route.path !== "/login" && statusStore.scrollTop === 0 ? "#fff" : undefined
);

// 切换明暗模式
const toggleTheme = () => {
  const themeList = ["light", "dark", "system"];
  const themeValue =
    themeList[(themeList.indexOf(colorMode.preference) + 1) % 3];
  if (themeValue) colorMode.preference = themeValue;
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    padding: 30px 5% 5%;
    padding: 30px 20px;
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    @media (max-width: 920px) {
      width: 100% !important; // 覆盖内联样式
    }
  }

  &.scroll {
    background-color: var(--main-card-color);
    border-bottom: solid 1px var(--mian-border-color);
    box-shadow: 0px 0px 8px 4px var(--main-box-shadow);
    .nav-content {
      padding: 12px 20px; // 触发 padding 过渡
    }
  }
  .logo {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: inherit;    /* 继承父级 .logo 的 font-size */
    font-weight: inherit;
    line-height: inherit;
    display: inline-block;
    text-align: left;
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: bold;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    @media (max-width: 512px) {
      font-size: 16px;
    }
  }
  .n-button,
  .logo {
    pointer-events: auto;
  }
}
</style>
