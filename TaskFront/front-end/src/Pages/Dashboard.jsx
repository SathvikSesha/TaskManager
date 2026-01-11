import { useAuth } from "../Context/AuthContext";
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <>
      <h1>Welcome {user.name}</h1>
      <button onClick={logout}>logout</button>
    </>
  );
}
export default Dashboard;
