import welcomeTo from "./welcome-to.svg"
import logo from "./logo.svg";
import logo2 from "./logo2.svg";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-row items-center">
          <div className="w-[300px] max-w-[100vw]">
            <img
              src={welcomeTo}
              alt="welcome to"
              className="hidden w-full dark:block"
            />
          </div>
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logo2}
              alt="x61ctf"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <pre className="w-full p-4 overflow-x-auto">
          <code>welcome</code>
        </pre>
      </div>
    </main>
  );
}
