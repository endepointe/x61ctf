import { loginRequest } from "../authConfig.js";

import { 
  AuthenticatedTemplate, UnauthenticatedTemplate, 
  useMsal 
} from "@azure/msal-react"

export default function AccountPage() {
  const { instance } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  }

  const handleLogoutRedirect = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  }
  return (<div>account page</div>);
}
