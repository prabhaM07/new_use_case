import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      }
      
    ],
  },
]);

export default router;
