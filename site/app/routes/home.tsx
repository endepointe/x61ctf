import type { Route } from "./+types/home";
import { Link, Outlet } from "react-router";
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
      <nav>
        <Link to={"challenges/"}>
          Challenges
        </Link>
        <Link to={"scoreboard/"}>
          scoreboard
        </Link>
        <Link to={"rules/"}>
          rules
        </Link>
      </nav> 
    </div>
  );
}
