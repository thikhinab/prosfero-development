import { useContext, useState, useEffect } from "react";
import { UserContext } from "../utils/UserContext";
import { Redirect } from "react-router";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { FetchLocations } from "../utils/FetchLocations";
import LocationSelect from "../components/LocationSelect";
import { toast } from 'react-toastify'

const Telebot = () => {
  const [state, setState] = useState({
    username: "",
    category: "",
  });

  const [ userInfo, setUserInfo ] = useState(null)
  const [ teleInfo, setTeleInfo] = useState({})
  const [ submit, setSubmit ] = useState(false)
  const { user, setUser } = useContext(UserContext);

  const url = "api/v1/telebots/";
  const updateurl = "api/v1/telebots/update";
  const userurl = "api/v1/profile";
  const rmurl = "api/v1/telebots/remove"
  const locurl = "api/v1/telebots/location"

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
        setUserInfo(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
      axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTeleInfo(res.data);
        console.log(res.data, "text")
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [submit]);

  // if (!user.token || user.expired) {
  //   return <Redirect to="/login" />;
  // }

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
        toast.success("Telegram Username Registered!");
        setSubmit(bool => !bool)
      })
      .catch((err) => toast.error(err));
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
        toast.success("Telegram Username Updated!");
        console.log(res)
      })
      .catch((err) => toast.success(err));
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
        toast.success(res.data);
        setSubmit(bool => !bool)
      })
      .catch((err) => toast.error(err));
  };

  const onCategoryRemove = (e) => {
    e.preventDefault();

    axios
      .put(
        rmurl,
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
        toast.success(res.data);
        setSubmit(bool => !bool)
      })
      .catch((err) => toast.error(err));
  };

  const usernameForm = () => {
    //console.log(userInfo)
    if (userInfo?.telebot === "") {
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
              Update your username!
            </h1>
          </div>
          <div className="text-left">
            <h8>
              Your account is currently linked with the Telegram username: <b>{teleInfo?.teleusername}</b>
            </h8>
          </div>
          <br />
          <div className="mb-3">
            <h8>
              If you want to update your telegram username you can do so! All your interested categories will 
              be copied over. You'll need to run /start again.
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
              Update
            </button>
          </div>
        </>
      );
    }
  };

  const restOfForm = () => {
    if (teleInfo?.confirmed) {
      return (
      <>
      <div className="container profile">
        Your current <i>Interested</i> categories
        <br />
        {userInfo?.botcategories && userInfo?.botcategories.map((cat) =>
         <div>
           {cat}
         </div>
        )}
      </div>
      <br />
      <div className="form-pad">
        <form className="form-post">
          <div className="mb-3">
            <h8>
              Add/Remove a category from your <i>Interested</i>
              <br />
              You will recieve a notification whenever an item is posted in
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
              style={{margin: '0.5rem'}}
              onClick={(e) => onCategorySubmit(e)}
            >
              Submit
            </button>
            <button
              type="submit"
              class="btn btn-danger"
              style={{margin: '0.5rem'}}
              onClick={(e) => onCategoryRemove(e)}
              >
              Remove
            </button>
          </div>
        </form>
      </div>
      <br/>
      <div className="form-pad">
      <form className="form-post">
      <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Location
            </label>
            <LocationSelect
              loading={loading}
              requests={getSuggestions}
              suggestions={suggestions}
              menuIsOpen={menuIsOpen}
              onSelect={onSelect}
              placeholder={"Please type in a location"}
            />
        <br/>
        <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onLocationSubmit(e)}
            >
              Submit
            </button>
        </div>
      </div>
      </form>
      </div>
      </>
      )
    } else {
      return(
      <>
      <div className="container profile">
        You need to run /start before you can start adding Categories and Location!
      </div>
      </>
      )
    }
  }

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    label: "",
    lon: "",
    lat: "",
  });

  const getSuggestions = async (word) => {
    if (word) {
      setLoading(true);
      let response = await FetchLocations(word);

      setSuggestions(response);
      setLoading(false);
      setMenuIsOpen(true);
    } else {
      setSuggestions([]);
      setMenuIsOpen(false);
    }
  };

  const onSelect = (object) => {
    setSelected(object);
  };

  const onLocationSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        locurl,
        {
          location: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => toast.error(err));
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
        <form className="form-post">
          { usernameForm() }
        </form>
      </div>
      <br />
      { restOfForm() }
    </>
  );
};

export default Telebot;
