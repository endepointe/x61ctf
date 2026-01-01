import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    route("account", "routes/account.tsx"),
    // other routes, exclusive to those who have created an account
  ]),
  route("rules","routes/rules.tsx"),
  route("challenges/*", "routes/challenges.tsx"),
  
] satisfies RouteConfig;
