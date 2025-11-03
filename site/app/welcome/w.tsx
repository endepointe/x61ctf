import welcomeTo from "./welcome-to.svg"
import logo from "./logo.svg";
import logo2 from "./logo2.svg";
import comingSoon from "./comingsoon.svg";
import { useEffect } from "react";

export default function Welcome() {
  return (
    <main className="min-h-screen flex justify-center pt-16 pb-6 px-4 sm:px-6">
      <div className="w-full max-w-5xl flex flex-col items-center gap-10 sm:gap-14">
        <header className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="w-40 sm:w-48 md:w-52 max-w-full shrink-0">
            <img
              src={welcomeTo}
              alt="welcome to"
              className="hidden w-full dark:block"
            />
          </div>
          <div className="w-60 sm:w-72 md:w-80 max-w-full p-2 sm:p-4">
            <img
              src={logo2}
              alt="x61ctf"
              className="hidden w-full dark:block"
            />
          </div>
        </header>

        <pre className="w-full rounded-lg border border-zinc-700/40 p-3 sm:p-4 text-xs sm:text-sm md:text-base overflow-x-auto">
          <code className="language-python">
{`cipher1 = 1001
cipher2 = 0111
print("recover the keyspace and plaintexts")`}
          </code>
        </pre>

        <div className="w-full flex flex-col items-center">
          <img
            src={comingSoon}
            alt="Coming soon (eta 30 days)"
            className="hidden dark:block w-full max-w-xs sm:max-w-md md:max-w-2xl"
          />
        </div>
      </div>
    </main>
  );
}
