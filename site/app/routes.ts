import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/challenges", "routes/challenges.tsx"),
  route("/account", "routes/account.tsx"),
] satisfies RouteConfig;
