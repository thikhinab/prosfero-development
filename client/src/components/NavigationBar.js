import { useState } from "react";
import { useHistory, Link } from "react-router-dom";

const NavigationBar = ({ loggedin, func: logout, admin }) => {
  const history = useHistory();

  const [searchString, setSearchString] = useState("");

  const handleChange = (e) => {
    setSearchString(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    if (searchString.replace(/\s/g, "").length !== 0 && searchString.length > 0) {
      return history.push(`/search?q=${searchString}`);
    }
  };

  const fontStyle = {
    fontFamily: "Dancing Script",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand" style={fontStyle}>
          Prosfero
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {loggedin ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/createpost">
                    Create Post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/telebot">
                    Telebot
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/archive">
                    Post Archive
                  </Link>
                </li>
                {admin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      logout();
                      history.push("/login");
                    }}
                  >
                    Logout
                  </span>
                </li>
              </ul>
              <form className="d-flex" style={{ height: "2.5rem" }}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={handleChange}
                />
                <button
                  className="btn btn-outline-light"
                  style={{
                    margin: "0rem",
                  }}
                  onClick={submit}
                >
                  Search
                </button>
              </form>
            </>
          ) : (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/registration">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
