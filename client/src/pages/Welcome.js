import { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

const Welcome = () => {
  const { user } = useContext(UserContext);
  let history = useHistory();

  const click = (location) => {
    history.push(`${location}`);
  };

  if (user.token !== null) {
    return <Redirect to="/profile" />;
  } else if (user.admin === true) {
    return <Redirect to="/admin/home" />;
  }

  return (
    <div className="container-fluid main">
      <div className="text-center align-middle">
        <h1 id="welcome-title">Prosfero</h1>
        <p id="welcome-slogan">Giving made easy</p>
      </div>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-outline-primary btn-lng welcome-button"
          onClick={() => click("/registration")}
        >
          REGISTER
        </button>
        <button
          type="button"
          className="btn btn-outline-success btn-lng welcome-button"
          onClick={() => click("/login")}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default Welcome;
