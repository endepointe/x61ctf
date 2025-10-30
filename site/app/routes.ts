import { 
  type RouteConfig, 
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("challenges", "challenges/challenges.tsx"),
] satisfies RouteConfig;
