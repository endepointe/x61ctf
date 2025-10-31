import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  future: {
    unstable_viteEnvironmentApi: false,
  },
} satisfies Config;
