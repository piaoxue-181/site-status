<template>
  <aside class="dashboard-sidebar">
    <n-menu
      :value="activeKey"
      :options="menuOptions"
      :indent="16"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      @update:value="handleMenuSelect"   
    />
    <div class="sidebar-footer">
      <n-button quaternary size="large" class="logout-btn" @click="handleLogout">
        <template #icon><Icon name="icon:logout" /></template>
        退出登录
      </n-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { NMenu, NButton, type MenuOption } from 'naive-ui'
import { Icon } from '#components'
const statusStore = useStatusStore();
const route = useRoute()

// 当前激活的菜单项 key
const activeKey = computed(() => {
  const path = route.path
  if (path === '/admin/dashboard') return 'dashboard'
  if (path === '/admin/controll') return 'controll'
  if (path === '/admin/setting') return 'setting'
  if (path === '/admin/feedback') return 'feedback'
  return '' // 无匹配时不选中
})

// 菜单配置（移除所有 props.onClick）
const menuOptions = computed<MenuOption[]>(() => [
  {
    key: 'dashboard',
    label: '已通过',
    icon: () => h(Icon, { name: 'icon:dashboard' }),
  },
  {
    key: 'controll',
    label: '已拒绝',
    icon: () => h(Icon, { name: 'icon:dashboard' }),
  },
  {
    key: 'setting',
    label: '设置',
    icon: () => h(Icon, { name: 'icon:dashboard' }),
  },
  {
    key: 'divider-1',
    type: 'divider',
  },
  {
    key: 'feedback',
    label: '建议反馈',
    icon: () => h(Icon, { name: 'icon:dashboard' }),
  },
])

// 处理菜单选择，执行跳转
const handleMenuSelect = (key: string) => {
  const routeMap: Record<string, string> = {
    dashboard: '/admin/dashboard',
    controll: '/admin/controll',   // 或 '/admin/rejected'，根据实际情况
    setting: '/admin/setting',
    feedback: '/admin/feedback',
  }
  const path = routeMap[key]
  if (path) {
    navigateTo(path)
  }
}

// 退出登录
const handleLogout = async (event: Event) => {
	const btn = event.currentTarget as HTMLElement
  btn?.blur()
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
	  onNegativeClick: () => {
      btn?.blur() // 取消时也失焦（额外保险）
    },
    onClose: () => {
      btn?.blur() // 关闭对话框时再次失焦
    }
	});
}
</script>

<style lang="scss" scoped>
.dashboard-sidebar {
  position: fixed;
  left: 0;
  top: 10vh;
  width: 24vh;
  height: 90vh;
  background: var(--main-card-color);
  display: flex;
  flex-direction: column;
  z-index: 90;
  overflow: hidden;

  // Naive UI 菜单样式覆盖
  :deep(.n-menu) {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    background: transparent;

    :deep(.n-menu-item) {
      :deep(.n-menu-item-content) {
        // ===== 统一默认样式 =====
        font-size: 14px;                      // 与按钮字号一致
        padding: 0 16px;
        height: 40px;
        border-radius: 0;
        transition: all 0.15s;

        &:hover {
          background: var(--main-box-shadow); // 与按钮悬停背景一致
        }

        &::before {
          display: none;
        }

        // 图标样式统一
        :deep(.n-menu-item-icon) {
          margin-right: 12px;
          font-size: 18px;
        }
      }
    }

    // 分割线样式
    .n-menu-divider {
      margin: 8px 16px;
      border-color: rgba(255, 255, 255, 0.06);
    }
  }

	// ===== 激活状态增强 =====
	:deep(.n-menu-item-content.n-menu-item-content--selected) {
		border-left: 3px solid var(--normal-color);  // 直接写颜色
		font-weight: 600;
	}

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;

    .logout-btn {
      width: 100%;
      justify-content: flex-start;
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 8px;
      transition: all 0.15s;

      &:hover {
        background: var(--main-box-shadow);
      }

      :deep(.n-button__icon) {
        margin-right: 12px;
        font-size: 18px;
      }
    }
  }

  // 自定义滚动条
  :deep(.n-menu)::-webkit-scrollbar {
    width: 4px;
  }
  :deep(.n-menu)::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  :deep(.n-menu)::-webkit-scrollbar-track {
    background: transparent;
  }
}

// 移动端适配
@media (max-width: 1023px) {
  .dashboard-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;

    &.sidebar-open {
      transform: translateX(0);
    }
  }
}
</style>