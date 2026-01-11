import type { Route } from "./+types/challenges";
import React, { useEffect, useState } from "react";
import { 
  AuthenticatedTemplate, UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { callApi } from "../utils/callApi";

// type returned from DB query
type Challenge = {
  id: number;
  name: string;
  location: string;
};

type ChallengeGridProps = {
  className?: string;
  gapClass?: string;
};


const Challenges: React.FC<ChallengeGridProps> = ({
  className = "",
  gapClass = "gap-4",
}) => {
  const { accounts }= useMsal();
  const [challenges, setChallenges] = useState(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { 
    (async () => {
      try {
        // this is a test api running from a docker container and network 
        // should be ip *.*.0.3. I will make this check in future.
        console.log(accounts.length,accounts[0]);
        if (accounts.length > 0) {
          const {
            idToken, idTokenClaims, localAccountId, name, username 
          } = accounts[0];
          console.log(name);
        }
        const res = await callApi(import.meta.env.VITE_FASTAPI_URL + "/challenges", "", null);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);
        setChallenges(data.challenges);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        return;
      }
    })();
  }, [accounts]);
  return (
    <React.Fragment>
      <AuthenticatedTemplate>
        <div
          className={[
            "grid",
            "[grid-template-columns:repeat(auto-fill,300px)]",
            "[grid-auto-rows:250px]",
            gapClass,
            "justify-center",
            className,
          ].join(" ")}
        >
          {challenges?.map((c) => (
            <div
              key={c.id}
              className={[
                "w-[300px] h-[250px]",
                "rounded-xl border border-neutral-700 bg-neutral-800/60",
                "shadow-sm hover:shadow-lg transition-shadow",
                "p-4 flex flex-col justify-between",
                "text-neutral-100",
              ].join(" ")}
            >
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-bold capitalize tracking-wide">
                  {c.name}
                </h2>

                <p className="text-sm text-neutral-400 break-words">
                  {c.location}
                </p>
              </div>

              <button
                className="w-full text-center rounded-md border border-neutral-500 hover:border-neutral-300 py-2 text-sm transition"
                onClick={() => {
                  // callback to connect / redirect / open challenge based on location
                  console.log("Launch challenge:", c);
                }}
              >
                Launch Challenge
              </button>
            </div>
          ))}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>

      </UnauthenticatedTemplate>
    </React.Fragment>
  );
};

export default Challenges;

