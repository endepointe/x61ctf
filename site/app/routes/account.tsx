import { 
  MsalProvider, AuthenticatedTemplate, 
  useMsal, useAccount,
  UnauthenticatedTemplate,
  useIsAuthenticated
} from '@azure/msal-react';

import { InteractionType, InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

export default function AccountPage() {
  const isAuthenticated = useIsAuthenticated();
  const msalCtx = useMsal();
  console.log(msalCtx);
  return (
    <>
    <div>account page</div>
    <span>Is &nbsp;</span>
    { isAuthenticated && (<span>...&nbsp;</span>) }
    { !isAuthenticated && (<span>...not...&nbsp;</span>) }
    <span>authenticated.</span>
    <p>TODO: create crud component.</p>
    </>
  );
}
