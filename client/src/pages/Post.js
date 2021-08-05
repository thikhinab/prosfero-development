import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../utils/UserContext";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import { toast } from "react-toastify";
import "../style/Post.css";

const Post = () => {
  const { user, setUser } = useContext(UserContext);

  const history = useHistory();

  const { postId } = useParams();

  const [state, setState] = useState({
    text: "",
  });

  const change = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const formUrl = `/api/v1/posts/requests/${postId}`;

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        formUrl,
        {
          text: state.text,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        alert("Request submitted!");
      })
      .catch((err) => {
        err.response && alert(err.response.data);
        console.log(err);
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
        console.log(res.data);
        console.log(res.data, "fdsfadsfsadfdsfsf");
        setState(res.data);
      })
      .catch((err) => {
        alert(err);
        console.log(err, "fdskjf");
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
        if (res.status == 200) {
          toast.info("Post flagged!");
        }
      })
      .catch((err) => toast.error(err.response.data));
  };

  const deletePost = () => {

    

    const instance = axios.create({
      baseURL: `/api/v1/admin/delete/${postId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .delete()
      .then((res) => {
        if (res.status == 200) {
          toast.info("Post deleted!");
          history.push('/home')
        }
      })
      .catch((err) => toast.error(err.response.data));
  }

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
                {console.log(user.id, state.userid)}
                {state.userid === user.id ? (
                  <>
                  <Link class="btn btn-primary" style={{margin: '0.5rem'}} to={`/editpost/${postId}`}>
                    Edit
                  </Link>
                  <div class="btn btn-danger" style={{margin: '0.5rem'}} onClick={() => deletePost()}>
                     Delete
                  </div>
                  </>
                ) : (
                  <>
                    <div
                      class="btn btn-primary"
                      style={{margin: '0.5rem'}}
                      onClick={() => setShowForm(!showForm)}
                    >
                      Request
                    </div>
                    <div class="btn btn-danger" style={{margin: '0.5rem'}} onClick={() => flagPost()}>
                      Flag
                    </div>
                  </>
                )}
                {showForm && (
                  <div className="mb-3" style={{paddingTop: '1rem'}}>
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
                      style={{marginTop: '1rem', marginBottom: '0rem'}}
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
