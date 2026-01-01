import type { Route } from "./+types/home";
import React, { useEffect } from "react";
import LandingPage from "../components/landing-page/landing_page.tsx"; 

export function meta({}: Route.MetaArgs) {
  return [
    { title: "x61ctf" },
    { name: "description", content: "CTF" },
  ];
}

export default function Home() {
  useEffect(() =>  {
    console.log("Loaded Home component.");
  }, []);
  return (
    <React.Fragment>
      <LandingPage message={""} />
    </React.Fragment>
  );
}
