import SHA256 from "crypto-js/sha256.js";
import { signJwt } from "../utils/jwt";

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    code: 200 | 500 | 401;
    message: string;
    token?: string;
  }> => {
    try {
      const body = await readBody(event);
      const config = useRuntimeConfig();
      const { sitePassword, captchaToken } = config;
      if (!sitePassword) {
        throw new Error("Site password not configured");
      }
      // 输入验证
      if (!body?.password || body?.password.length === 0) {
        throw new Error("Password is required");
      }
      if (!body?.captchaToken || body?.captchaToken === 0) {
        throw new Error("captchaToken is required")
      }
      // 密码验证
      const hashedPassword = SHA256(sitePassword).toString();
      if (body?.password !== hashedPassword) {
        setResponseStatus(event, 401);
        return {
          code: 401,
          message: "password is incorrect",
        };
      }
      try {
        const result = await $fetch(captchaToken + 'api/validate', {
          method: 'POST',
          body: { token: body?.captchaToken, keepToken: false }
        })
        // 能执行到这里，说明 HTTP 状态码是 2xx
        if (!result.success) {
          throw new Error('验证失败：' + (result.message || ''))
        }
        // 验证成功
      } catch (error) {
        // 处理网络错误或 HTTP 错误（如 500）
        console.error('请求异常', error)
        throw new Error('验证请求失败')
      }
      // jwt token
      const token = await signJwt("30d");
      // 设置 Cookie
      setCookie(event, "authToken", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "strict",
      });
      return {
        code: 200,
        message: "password is correct",
        token,
      };
    } catch (error) {
      console.error("Password validation error:", error);
      setResponseStatus(event, 500);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);
