import React, { useContext, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import { toast } from "react-toastify";

const Login = () => {
  let history = useHistory();

  document.body.style = "background: white";

  const { user, setUser } = useContext(UserContext);

  const url = "/api/v1/users/login";

  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const validation = () => {
    let bool = true;

    if (state.username === "") {
      toast.error("Please enter the username");
      bool = false;
    }

    if (state.password === "") {
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
          username: state.username,
          password: state.password,
        })
        .then((res) => {
          if (res.data.error === undefined) {
            localStorage.setItem("prosfero-token", res.data.token);
            localStorage.setItem("prosfero-id", res.data.id);
            localStorage.setItem("prosfero-admin", res.data.admin);
            setUser({
              token: res.data.token,
              id: res.data.id,
              expired: false,
              admin: res.data.admin,
            });
            history.push("/profile");
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => toast.error(err));
    }

    setState({
      username: "",
      password: "",
    });
  };

  return (
    <>
      {user.token !== null ? (
        <Redirect to="profile" />
      ) : (
        <>
          <NavigationBar loggedin={false} />
          <form className="login-form needs-validation" novalidate>
            <div className="text-center">
              <h1
                id="login-title"
                style={{ fontFamily: "Dancing Script", fontSize: "3rem" }}
              >
                Login
              </h1>
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                onChange={(e) => change(e)}
                value={state.username}
              />
              <div class="invalid-feedback">Looks good!</div>
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
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => onSubmit(e)}
              >
                Login
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Login;
