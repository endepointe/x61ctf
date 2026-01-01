import type { Route } from "./+types/root";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router";

import { 
  MsalProvider, useMsal 
} from "@azure/msal-react";
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from "./authConfig.js";
const pca = new PublicClientApplication(msalConfig);

import Nav from "./components/navigation/nav.tsx"
import "./app.css";
import { State } from "./state.ts";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() =>  {
    console.log(window.location);
    console.log("children:", children);
  });
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MsalProvider instance={ pca }>
          <Nav />
          {children}
        </MsalProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function HydrateFallback() {
  return (<div>TODO: fallback</div>);
}


async function loggingMiddleware({ request, context }, next,) {
  console.log("called loggingMiddleware from app/root.tsx");
  console.log(State);
  console.log(context);
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    pca.initialize().then(() =>  {
      // Default to using the first account if no account is active on page load
      if (!pca.getActiveAccount() && pca.getAllAccounts().length > 0) {
        // Account selection logic is app dependent. 
        // Adjust as needed for different use cases.
        pca.setActiveAccount(pca.getAllAccounts()[0]);
        console.log(pca);
      }

      // Listen for sign-in event and set active account
      pca.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {

          const account = event.payload.account;
          console.log(account);
          pca.setActiveAccount(account);
          
        }
      });   
      if (mounted) setReady(true);
    })
    .catch((error) => {
      if (!mounted) setReady(false);
      console.error(error);
    });
  }, []);
  
  if (!ready) return <div>todo: create the loading widget</div>;

  return (
    <div>
      <Outlet context={null}/>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export const clientMiddleware = [loggingMiddleware];
