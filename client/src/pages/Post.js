import { useContext, useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import "../style/Post.css";

const Post = () => {
  const { user, setUser } = useContext(UserContext);

  const history = useHistory();

  const { postId } = useParams();

  const [state, setState] = useState({
    text: "",
  });

  const closeModal = useRef(null);

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const formUrl = `/api/v1/posts/requests/${postId}`;

  const onSubmit = (e) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: formUrl,
      headers:{
        Authorization: `Bearer ${user.token}`,
      },
    })

    instance
      .post(
        '',
        {
          text: state.text,
        },
        
      )
      .then((res) => {
          toast.info('Request submitted!')
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const [showForm, setShowForm] = useState(false);

  const url = `/api/v1/posts/single/${postId}`;

  useEffect(() => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        toast.error(err);
        history.push("/home");
      });
  }, []);

  const flagPost = () => {
    const instance = axios.create({
      baseURL: `/api/v1/posts/flag/${postId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .post()
      .then((res) => {
        if (res.status === 200) {
          toast.info("Post flagged!");
        }
      })
      .catch((err) => toast.error(err.response.data));
  };

  const deletePost = () => {
    closeModal.current.click();

    const instance = axios.create({
      baseURL: `/api/v1/admin/delete/${postId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .delete()
      .then((res) => {
        if (res.status === 200) {
          toast.info("Post deleted!");
          history.push("/home");
        }
      })
      .catch((err) => toast.error(err.response.data));
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
      <div
        class="modal fade"
        id="modal"
        tabindex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">
                Delete Confirmation
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeModal}
              ></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete the post?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-danger"
                onClick={() => deletePost()}
                style={{ marginBottom: "0rem" }}
              >
                Yes
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                style={{ marginBottom: "0rem" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col content">
              <div className="text-center">
                <img
                  src={state.image}
                  style={{ maxWidth: "20rem", maxHeight: "20rem" }}
                  className="img-thumbnail"
                  alt={state.title}
                />
              </div>
            </div>
            <div className="col info-box">
              <h1 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                {state.title}
              </h1>
              <h5>Posted by: {state.username}</h5>
              <hr />
              <p>{state.desc}</p>
              <p>
                <strong>Location:</strong> <br />
                {state.location?.label}
              </p>
              <hr />
              <p>Category: {state.category}</p>
              <p>Created at: {new Date(state.createdAt).toUTCString()}</p>
              <div className="text-center">
                {state.userid === user.id ? (
                  <>
                    <Link
                      class="btn btn-primary"
                      style={{ margin: "0.5rem" }}
                      to={`/editpost/${postId}`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      style={{ margin: "0.5rem" }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      class="btn btn-primary"
                      style={{ margin: "0.5rem" }}
                      onClick={() => setShowForm(!showForm)}
                    >
                      Request
                    </div>
                    <div
                      class="btn btn-danger"
                      style={{ margin: "0.5rem" }}
                      onClick={() => flagPost()}
                    >
                      Flag
                    </div>
                  </>
                )}
                {showForm && (
                  <div className="mb-3" style={{ paddingTop: "1rem" }}>
                    <label htmlFor="text" className="form-label">
                      Text
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="text"
                      name="text"
                      autoComplete="off"
                      onChange={(e) => change(e)}
                      value={state.text}
                      placeholder="(Optional) Enter request text"
                    />
                    <div className="text-center"></div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ marginTop: "1rem", marginBottom: "0rem" }}
                      onClick={(e) => onSubmit(e)}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
