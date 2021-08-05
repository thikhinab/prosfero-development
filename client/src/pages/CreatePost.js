import { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import "../style/CreatePost.css";
import axios from "axios";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { FetchLocations } from "../utils/FetchLocations";
import LocationSelect from "../components/LocationSelect";
import { toast } from "react-toastify";

const CreatePost = () => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const url = "/api/v1/posts";
  const [image, setImage] = useState({
    file: null,
  });

  const [state, setState] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    label: "",
    lon: "",
    lat: "",
  });
  const [uploading, setUploading] = useState(false);

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

  const fileSelectedHandler = (e) => {
    setImage({
      file: e.target.files[0],
    });
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    setUploading(true);

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
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    } else {
      toast.error("Please select an Image");
    }
  };

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const validation = () => {
    let bool = true;

    if (state.title === "") {
      toast.error("Please enter the title");
      bool = false;
    }

    if (state.category === "") {
      toast.error("Please choose a category");
      bool = false;
    }

    if (selected.label === "") {
      toast.error("Please select a location");
      bool = false;
    }

    if (state.description === "") {
      toast.error("Please enter the description");
      bool = false;
    }

    if (state.image === "") {
      toast.error("Please upload the image");
      bool = false;
    }

    return bool;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validation()) {
      axios
        .post(
          url,
          {
            title: state.title,
            desc: state.description,
            category: state.category,
            image: state.image,
            location: {
              label: selected.label,
              lon: selected.lon,
              lat: selected.lat,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          toast.success("Post submitted!");
          history.push(`/post/${res.data.id}`);
        })
        .catch((err) => toast.error(err));
    }
  };

  if (!user.token || user.expired) {
    return <Redirect to="/login" />;
  }

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
          <div className="text-center">
            <h1 style={{ fontFamily: "Dancing Script" }}>Create Your Post</h1>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              id="title"
              name="title"
              onChange={(e) => change(e)}
              value={state.title}
              placeholder="Enter the title of your post"
            />
          </div>
          <div className="mb-3">
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
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripton of Item
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              name="description"
              onChange={(e) => change(e)}
              value={state.description}
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
          {uploading && (
            <>
              <div className="text-center" style={{ padding: "1rem" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div>Uploading...</div>
              </div>
            </>
          )}
          {state.image && !uploading && (
            <div className="text-center">
              <img src={state.image} className="img-thumbnail" alt="" />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onSubmit(e)}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
