import { useContext, useState, useEffect } from "react";
import { UserContext } from "../utils/UserContext";
import { Redirect } from "react-router";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const Telebot = () => {
  const [state, setState] = useState({
    username: "",
    category: "",
  });

  const { userInfo, setUserInfo } = useState({});
  const { user, setUser } = useContext(UserContext);

  const url = "/api/v1/telebots";
  const updateurl = "/api/v1/telebots/update";
  const userurl = "/api/v1/profile";

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  useEffect(() => {
    axios
      .get(userurl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        //console.log(res.data);
        setUserInfo(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  if (!user.token || user.expired) {
    return <Redirect to="/login" />;
  }

  const onUsernameSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        url,
        {
          username: state.username,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        alert("Telegram Username Registered!");
      })
      .catch((err) => alert(err));
  };

  const onUsernameUpdate = (e) => {
    e.preventDefault();

    axios
      .post(
        updateurl,
        {
          username: state.username,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        alert("Telegram Username Updated!");
        console.log(res);
      })
      .catch((err) => alert(err));
  };

  const onCategorySubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        url,
        {
          category: state.category,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        alert(res.data);
      })
      .catch((err) => alert(err));
  };

  const generateCategories = (userInfo) => {
    return <>{}</>;
  };

  const usernameForm = (userInfo) => {
    if (userInfo.telebot === "") {
      return (
        <>
          <div className="text-center">
            <h1 style={{ fontFamily: "Dancing Script" }}>
              Set up your telebot!
            </h1>
          </div>
          <div className="text-left">
            <h8>
              You can set up your Telegram bot extension and receive
              notifications whenever a new item is posted!
            </h8>
            <br />
            <br />
            <h8>
              Once you have set up your username go to @prosferobot and run the
              /start command.
            </h8>
          </div>
          <br />
          <br />
          <div className="mb-3">
            <h8>
              Enter the Telegram username you want to connect your Prosfero
              account with.
            </h8>
            <br />
            <br />
            <label htmlFor="title" className="form-label">
              Telegram Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={(e) => change(e)}
              value={state.username}
              placeholder="Enter Telegram username"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onUsernameSubmit(e)}
            >
              Submit
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="text-center">
            <h1 style={{ fontFamily: "Dancing Script" }}>
              Set up your telebot!
            </h1>
          </div>
          <div className="text-left">
            <h8>
              You have set up your Telegram bot extension and receive
              notifications whenever a new item is posted!
            </h8>
            <br />
            <br />
            <h8>
              To get started go to to @prosferobot and run the /start command.
            </h8>
          </div>
          <br />
          <br />
          <div className="mb-3">
            <h8>
              If you want to update your telegram username you can do so! All
              your interested catrgories will be copied over. You'll need to run
              /start again.
            </h8>
            <br />
            <br />
            <label htmlFor="title" className="form-label">
              Telegram Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={(e) => change(e)}
              value={state.username}
              placeholder="Enter Telegram username"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onUsernameUpdate(e)}
            >
              Submit
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <NavigationBar
        loggedin={true}
        admin={user.admin}
        func={() => {
          localStorage.removeItem("prosfero-token");
          localStorage.removeItem("prosfero-id");
          localStorage.removeItem("prosfero-admin");
          setUser({
            token: null,
            id: null,
            admin: null,
          });
        }}
      />
      <div className="form-pad">
        <form className="form-post">{usernameForm(userInfo)}</form>
      </div>
      <br />
      <div className="container profile">
        Your current <i>Interested</i> categories
        <br />
        {userInfo.botcategories &&
          userInfo.botcategories.map((cat) => <div>{cat}</div>)}
      </div>
      <br />
      <div className="form-pad">
        <form className="form-post">
          <div className="mb-3">
            <h8>
              Add a category to your <i>Interested</i>
              <br />
              You will then recieve a notification whenever an item is posted in
              that category!
            </h8>
            <br />
            <br />
            <select
              className="form-select"
              name="category"
              value={state.category}
              onChange={(e) => change(e)}
              aria-label="choose chatergory"
            >
              <option value="" defaultValue disabled>
                Choose category
              </option>
              <option value="Food">Food</option>
              <option value="Electronics">Electronics</option>
              <option value="Stationary">Stationary</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onCategorySubmit(e)}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Telebot;
