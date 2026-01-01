import { callApi } from "../utils/callApi";
import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { 
  AuthenticatedTemplate, UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export default function Dashboard() {
  const { instance, accounts, inProgress } = useMsal();
  useEffect(() => {
    if (inProgress === InteractionStatus.None &&
       accounts.length > 0) {
      console.log(accounts);
      const tokenRequest = {
        account: accounts[0],
        scopes: ["User.Read"]
      }
      instance.acquireTokenSilent(tokenRequest).then((res) => {
        console.log(res);
        if (res.tokenType === "Bearer") {
          callApi("http://localhost:33567/user",res.idToken).then((res) =>{  
            console.log(res);
          }).catch((err) => {
            console.error(err);
          });
        }
      }).catch((err) => { 
        console.error(err);
      }); 
    }
  }, [instance,inProgress,accounts]);
  return (
    <React.Fragment>
      <AuthenticatedTemplate>
        <h1>Dashboard</h1>
        <Outlet />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>you have not logged in but nice try.</p>
      </UnauthenticatedTemplate>
    </React.Fragment>
  );
}
