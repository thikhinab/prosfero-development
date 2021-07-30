import { useContext, useState, useEffect } from "react";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import "../style/CreatePost.css";
import axios from "axios";
import { Redirect } from "react-router";
import { useHistory, useParams } from "react-router-dom";
import LocationSelect from "../components/LocationSelect";
import { FetchLocations } from "../utils/FetchLocations";

const EditPost = () => {
  const { postId } = useParams();

  const url = `api/v1/posts/single/${postId}`;
  const editURL = `api/v1/posts/${postId}`;

  const [state, setState] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

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
    const newState = { ...state };
    newState["location"] = {
      label: object.label,
      lon: object.lon,
      lan: object.lan,
    };
    setState(newState);
  };

  useEffect(() => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.data.userid !== user.id) {
          alert("Unathorized");
          history.push("/home");
        }
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
        history.push("/home");
      });
  }, []);

  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const [image, setImage] = useState({
    file: null,
  });

  const fileSelectedHandler = (e) => {
    setImage({
      file: e.target.files[0],
    });
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    if (image.file !== null || image.file !== undefined) {
      const files = image.file;
      const data = new FormData();
      data.append("file", files);
      data.append("upload_preset", "prosfero");

      axios
        .post("https://api.cloudinary.com/v1_1/drv2gra8s/image/upload", data)
        .then((res) => {
          const file = res.data;
          const newState = { ...state };
          newState["image"] = file.secure_url;
          setState(newState);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    } else {
      alert("Please select an Image");
    }
  };

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        editURL,
        {
          title: state.title,
          desc: state.desc,
          category: state.category,
          image: state.image,
          location: state.location,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        alert("Post updated!");
        history.push(`/post/${postId}`);
      })
      .catch((err) => alert(err));
  };

  if (!user.token || user.expired) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <NavigationBar
        loggedin={true}
        func={() => {
          localStorage.removeItem("prosfero-token");
          localStorage.removeItem("prosfero-id");
          setUser({
            token: null,
            id: null,
          });
        }}
      />
      <div className="form-pad">
        <form className="form-post">
          <div className="text-center">
            <h1 style={{ fontFamily: "Dancing Script" }}>Edit Post</h1>
          </div>
          <h3>Title: {state.title}</h3>
          <div className="mb-3">
            <select
              className="form-select"
              name="category"
              value={state.category}
              onChange={(e) => change(e)}
              aria-label="choose chatergory"
            >
              <option value="" disabled>
                Choose category
              </option>
              <option value="Food">Food</option>
              <option value="Electronics">Electronics</option>
              <option value="Stationary">Stationary</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Location
            </label>
            <LocationSelect
              defaultValue={state.location}
              loading={loading}
              requests={getSuggestions}
              suggestions={suggestions}
              menuIsOpen={menuIsOpen}
              onSelect={onSelect}
              placeholder={"Please type in a location"}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripton of Item
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              name="desc"
              onChange={(e) => change(e)}
              value={state.desc}
            ></textarea>
          </div>
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={(e) => fileSelectedHandler(e)}
              id="image"
            />
            <button
              className="input-group-text"
              htmlFor="image"
              onClick={(e) => uploadImage(e)}
            >
              Upload
            </button>
          </div>
          {state.image && (
            <div className="text-center">
              <img
                src={state.image}
                className="img-thumbnail"
                alt={state.title}
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onSubmit(e)}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPost;
