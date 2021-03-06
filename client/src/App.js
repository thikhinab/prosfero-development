import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { UserContext } from "./utils/UserContext";
import Welcome from "./pages/Welcome";
import WelcomeRouter from "./utils/WelcomeRouter";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import Post from "./pages/Post";
import EditPost from "./pages/EditPost";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import YourRequests from "./pages/YourRequests";
import Telebot from "./pages/Telebot";
import Archive from "./pages/Archive";
import Admin from "./pages/Admin";

function App() {
  const cast = (val) => {
    if (val === "true") {
      return true;
    } else {
      return false;
    }
  };

  const [user, setUser] = useState({
    token: localStorage.getItem("prosfero-token"),
    id: localStorage.getItem("prosfero-id"),
    admin: cast(localStorage.getItem("prosfero-admin")),
  });

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <>
      <UserContext.Provider value={value}>
        <Router>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/welcome" exact component={Welcome} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/home" exact component={Home} />
            <Route path="/post/:postId" exact component={Post} />
            <Route path="/editpost/:postId" exact component={EditPost} />
            <Route path="/chat" exact component={Chat} />
            <Route path="/requests" exact component={YourRequests} />
            <Route path="/telebot" exact component={Telebot} />
            <Route path="/archive" exact component={Archive} />
            <Route path="/admin" exact component={Admin} />
            <Route path="/search" component={Search} />
            <Route path="/" component={WelcomeRouter} />
          </Switch>
        </Router>
      </UserContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
