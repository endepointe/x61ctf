import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome.tsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to Rect Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
    </div>
  );
}
