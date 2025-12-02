import type { Route } from "./+types/home";
import Welcome from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "x61ctf" },
    { name: "description", content: "CTF" },
  ];
}

export default function Home() {
  return (
      <Welcome message={""} />
  );
}
