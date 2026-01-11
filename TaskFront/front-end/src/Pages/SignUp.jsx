import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function SignUp() {
  const { login } = useAuth();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name.length < 4) {
      setMsg("Invalid Username!! Username must be atleast 4 characters!");
      return;
    }
    if (form.email === "") {
      setMsg("Email is Required!!!");
      return;
    }
    if (form.password.length < 6) {
      setMsg("Password must be atleast 6 characters!!");
      return;
    }
    if (form.password !== form.confirm) {
      setMsg("Passwords does match !!");
      return;
    }
    login({
      id: Date.now(),
      name: form.name,
      email: form.email,
    });
    resetForm();
    setMsg("User is successfully registered");
    navigate("/login");
  };
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirm: "",
    });
  };
  return (
    <>
      <div>
        <h1>Welcome to portal</h1>
        <h3>You can register here...</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={form.name}
              name="name"
              onChange={handleChange}
              placeholder="Enter your user-name:"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email:"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={form.password}
              name="password"
              onChange={handleChange}
              placeholder="Enter your password:"
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Re-enter your password:"
            />
          </label>
          <button type="submit">Submit</button>
          <button type="reset" onClick={resetForm}>
            Reset
          </button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </>
  );
}
export default SignUp;
