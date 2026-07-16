/**
 * Jump to a link.
 * @param url The link to jump to.
 */
export const jumpLink = (url: string) => window.open(url, "_blank");

/**
 * Format a number.
 * @param num The number to format.
 * @returns The formatted number.
 */
export const formatNumber = (num: number) => Math.floor(num * 100) / 100;

/**
 * Sleep for a certain amount of time.
 * @param ms The amount of time to sleep in milliseconds.
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get site data.
 */
// 公共请求函数
const fetchSiteData = async (apiPath: string, signal?: AbortSignal) => {
  const statusStore = useStatusStore();
  try {
    statusStore.siteStatus = "loading";

    const data = await $fetch(apiPath, {
      method: "POST",
      signal,
      onResponse({ response }) {
        const serverHeader = response.headers.get('server');
        if (serverHeader || serverHeader === "Vercel" || serverHeader === "Netlify") {
          console.log(serverHeader)
          statusStore.platform = serverHeader;
        }
      }
    });

    if (data.code !== 200 || !data.data) {
      throw new Error("Error to get site data");
    }

    const { status: statusData } = data.data;
    statusStore.$patch({
      siteData: data.data,
      siteStatus:
        statusData.count === statusData.ok
          ? "normal"
          : statusData.count === statusData.error
            ? "error"
            : "warn",
    });
  } catch (error) {
    if (!signal?.aborted) {
      console.error(`error to get site data from ${apiPath}`, error);
      statusStore.siteStatus = "unknown";
      if (typeof window !== 'undefined') {
        window.$message?.error?.("站点数据获取失败，请重试");
      }
    }
  }
};

// 导出两个具体函数
export const getSiteData = (signal?: AbortSignal) => fetchSiteData('https://sitestatusk.netlify.app/api/getMonitors', signal);
export const getSiteDataDay = (signal?: AbortSignal) => fetchSiteData('https://sitestatusk.netlify.app/api/getMonitorsDay', signal);