import { 
  type RouteConfig, 
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("challenges", "./challenges/challenges.tsx"),
  route("scoreboard", "./scoreboard/scoreboard.tsx"),
  route("rules", "./rules/rules.tsx"),
] satisfies RouteConfig;
