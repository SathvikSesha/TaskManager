import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <>
      <h1>Welcome to the Task Manager...</h1>
      <div>
        <div>
          <Link to={"/login"}>Login</Link>
        </div>
        <div>
          <Link to={"/signup"}>Sign Up</Link>
        </div>
      </div>
    </>
  );
}
export default LandingPage;
