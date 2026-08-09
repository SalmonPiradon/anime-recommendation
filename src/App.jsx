import { Toaster } from "sonner";

import { useAuth } from "./contexts/authentication";
import { LoadingState } from "./components/page-components/LoadingState";
import AuthenticatedApp from "./pages/AuthenticatedApp";
import UnauthenticatedApp from "./pages/UnauthenticatedApp";

function App() {
  const { isAuthenticated, state } = useAuth();

  // รอเช็ค token / ดึง user ก่อน แล้วค่อยเลือกชุด route
  if (state.getUserLoading !== false) {
    return <LoadingState />;
  }

  return (
    <>
      {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      <Toaster position="bottom-right" closeButton />
    </>
  );
}

export default App;
