import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import '../style/Registration.css'

const Registration = () => {
  const { setUser } = useContext(UserContext);
  document.body.style = "background: white";

  let history = useHistory();

  const url = "/api/v1/users/register";

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const validation = () => {
    let bool = true;

    if (state.firstName.length === 0) {
      toast.error("Please enter the First name");
      bool = false;
    }

    if (state.lastName.length === 0) {
      toast.error("Please enter the Last name");
      bool = false;
    }
    if (state.username.length < 3) {
      toast.error("Please enter the username with at least 3 characters");
      bool = false;
    }
    if (state.email === "@" || !state.email.includes("@")) {
      toast.error("Please enter a valid email");
      bool = false;
    }

    if (state.password.length > 0) {
      if (state.password.length < 8) {
        bool = false;
        toast.error("Password must have at least 8 characters");
      }

      if (state.password.search(/[a-z]/i) < 0) {
        bool = false;
        toast.error("Password must contain at least one letter");
      }

      if (state.password.search(/[0-9]/) < 0) {
        bool = false;
        toast.error("Password must contain at least one number");
      }

      if (state.password.search(/[!@#$%^&*(),.?":{}|<>]/g) < 0) {
        bool = false;
        toast.error("Password must contain at least one special character");
      }
    } else {
      toast.error("Please enter the password");
      bool = false;
    }

    return bool;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validation()) {   
      axios
        .post(url, {
          firstName: state.firstName,
          lastName: state.lastName,
          username: state.username,
          email: state.email,
          password: state.password,
        })
        .then((res) => {
          toast.success("User Registered!");
          history.push("/login");
          setState({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
          });
        })
        .catch((err) => toast.error(err));

  

    }
  };

  useEffect(() => {
    localStorage.removeItem("prosfero-token");
    localStorage.removeItem("prosfero-id");
    setUser({
      token: localStorage.getItem("prosfero-token"),
      id: localStorage.getItem("prosfero-id"),
    });
  }, []);

  return (
    <>
      <NavigationBar loggedin={false} />
      <form className="registration-form">
        <div className="text-center">
          <h1
            id="registration-title"
            style={{ fontFamily: "Dancing Script", fontSize: "3rem" }}
          >
            Registration
          </h1>
        </div>
        <div className="mb-3">
          <label className="form-label">First name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            onChange={(e) => change(e)}
            value={state.firstName}
            id="registration-first-name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            onChange={(e) => change(e)}
            value={state.lastName}
            id="registration-last-name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={(e) => change(e)}
            value={state.username}
            id="registration-username"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={(e) => change(e)}
            value={state.email}
            id="registration-email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={(e) => change(e)}
            value={state.password}
            id="registation-password"
          />
        </div>
        <div className="form-text" style={{ paddingBottom: "1rem" }}>
          {
            "Please use a password with at least 8 characters mixed with letters, numbers and special characters."
          }
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => onSubmit(e)}
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Registration;
