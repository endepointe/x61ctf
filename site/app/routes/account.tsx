import { useLocation } from "react-router";
export default function AccountPage() {
  const location = useLocation();
  console.log(location);
  return (<div>account page</div>);
}
