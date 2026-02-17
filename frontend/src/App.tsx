import { Outlet } from 'react-router-dom';
import './App.css';
import Logout from './features/auth/components/logout';

function App() {
  return (
    <>
      <Outlet />
      < Logout />
    </>
  );
}

export default App;