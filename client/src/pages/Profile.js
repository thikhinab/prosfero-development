import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, Redirect, Router } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { UserContext } from "../utils/UserContext";
import Person from "@material-ui/icons/Person";

const Profile = () => {
  const fileInput = useRef();

  let history = useHistory();

  const { user, setUser } = useContext(UserContext);

  const [image, setImage] = useState("");
  const [file, setFile] = useState("");

  const [profile, setProfile] = useState({});
  const [requests, setRequests] = useState([]);
  const [notifs, setNotifs] = useState([]);

  const url = "api/v1/profile";
  const reqsurl = "api/v1/requests";
  const notifsUrl = "api/v1/profile/notifs";

  const fileSelectedHandler = (e) => {
    setFile({
      selectedFile: e.target.files[0],
    });
  };

  const uploadImage = async () => {
    if (file.selectedFile !== undefined) {
      const files = file.selectedFile;
      const data = new FormData();
      data.append("file", files);
      data.append("upload_preset", "prosfero");

      axios
        .post("https://api.cloudinary.com/v1_1/drv2gra8s/image/upload", data)
        .then((res) => {
          const file = res.data;
          setImage(file.secure_url);
          const data = { profilePicture: file.secure_url };

          fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((res) => console.log("Profile updated"))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      alert("Please select an Image");
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return dd + "/" + mm + "/" + yyyy;
  };

  useEffect(() => {
    if (user.token !== null)
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setProfile(res.data);
          setImage(res.data.profilePicture);
        })
        .catch((err) => alert(err));
    document.body.style = "background: #b3e0ff;";

    axios
      .get(reqsurl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => alert(err));

    axios
      .get(notifsUrl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setNotifs(res.data);
      })
      .catch((err) => alert(err));
  }, []);

  // useEffect(() => {
  //     axios.get(reqsurl,
  //         {
  //             headers: {
  //                 'Authorization': `Bearer ${user.token}`
  //             }
  //          }).then( res => {
  //         setRequests(res.data)
  //     }).catch(
  //         err => alert(err)
  //     )
  // }, [requests])

  const approve = (e, reqData) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .post(`/requests/approve/${reqData[3]}`)
      .then((res) => {
        alert(`The email of the approved user is: ${res.data}`);
        //setRequests([])
      })
      .catch((err) => alert(err));
  };

  const decline = (e, reqData) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(reqData);
    instance
      .post(`/requests/decline/${reqData[3]}`)
      .then((res) => {
        alert("The user's request has been declined");
        console.log(res.data);
      })
      .catch((err) => alert(err));
  };

  const closeNotif = (e, notif) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .post(`/profile/notifs/${notif.requestid}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => alert(err));
  };

  const startConversation = (receiverId) => {
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    instance
      .post(`/conversations`, {
        senderId: user.id,
        receiverId,
      })
      .then((res) => {
        history.push("/chat");
      })
      .catch((err) => alert(err));
  };

  const createReqData = (reqData) => {
    if (reqData[5] === "approved") {
      return (
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Approved!</h5>
            <p className="card-text">
              You approved {reqData[1]}'s request on {reqData[0]}
            </p>
            <p className="card-text">Contact them at {reqData[4]}</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => startConversation(reqData[6])}
          >
            Start Conversation
          </button>
        </div>
      );
    } else if (reqData[5] === "declined") {
    } else {
      return (
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">{reqData[0]}</h5> {/*post*/}
            <h5 className="card-title">{reqData[1]}</h5> {/*user*/}
            <p className="card-text">{reqData[2]}</p> {/*text*/}
          </div>
          <a
            href="#"
            class="btn btn-outline-success"
            onClick={(e) => approve(e, reqData)}
          >
            Approve
          </a>
          <a
            href="#"
            class="btn btn-outline-danger"
            onClick={(e) => decline(e, reqData)}
          >
            Decline
          </a>
        </div>
      );
    }
  };

  const createNotifs = (notif) => {
    if (notif.status === "declined") {
      return (
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          Your request on <strong>{notif.title}</strong> by{" "}
          <strong>{notif.username}</strong> was declined
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={(e) => closeNotif(e, notif)}
          ></button>
        </div>
      );
    } else if (notif.status === "approved") {
      return (
        <div
          class="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Your request on <strong>{notif.title}</strong> by{" "}
          <strong>{notif.username}</strong> was accepted! Check out the{" "}
          <b>Your Requests</b> page
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={(e) => closeNotif(e, notif)}
          ></button>
        </div>
      );
    }
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
      <div className="profile-background">
        <div className="container profile">
          <div className="row">
            <div className="col">
              <div
                className="text-center"
                style={{ fontFamily: "Dancing Script" }}
              >
                <h2>About you</h2>
              </div>
              <div className="profile-box text-center">
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Name</h6>
                  <p>{`${profile.firstName} ${profile.lastName}`}</p>
                </div>
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Email</h6>
                  <p>{profile.email}</p>
                </div>
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Date Joined</h6>
                  <p>{formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="col text-center" style={{ margin: "1rem" }}>
              {image ? (
                <img
                  className="profile-picture"
                  src={image}
                  alt="profile pif"
                />
              ) : (
                <div style={{ margin: "3rem" }}>
                  <Person style={{ transform: "scale(5)" }} />
                </div>
              )}
              <input
                style={{ display: "none" }}
                type="file"
                name="file"
                placeholder="Upload Profile Picture"
                onChange={fileSelectedHandler}
                ref={fileInput}
              />
              <div
                className="d-grid gap-2 d-md-block"
                style={{ margin: "1rem" }}
              >
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  style={{ margin: "0.25rem" }}
                  onClick={() => fileInput.current.click()}
                >
                  Choose Profile Picture
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  style={{ margin: "0.25rem" }}
                  onClick={uploadImage}
                >
                  Upload
                </button>
              </div>
              <h2 style={{ fontFamily: "Dancing Script", marginTop: "1rem" }}>
                {profile.username}
              </h2>
            </div>
            <div className="col">
              <div
                className="text-center"
                style={{ fontFamily: "Dancing Script" }}
              >
                <h2>Stats</h2>
              </div>
              <div className="profile-box text-center">
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Posts</h6>
                  <p>{profile.noOfPosts || 0}</p>
                </div>
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Requests</h6>
                  <p>{requests.length}</p>
                </div>
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Achievement Level</h6>
                  <p>{profile.achievementLevel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ color: "#b3e0ff" }}>...</div>
        <div className="container profile">
          <div className="text-center" style={{ fontFamily: "Dancing Script" }}>
            <h2>Your Notifications</h2>
          </div>
          {notifs && notifs.map((item) => createNotifs(item))}
        </div>
        <div style={{ color: "#b3e0ff" }}>...</div>
        <div className="text-center">
          <Link to="/requests" class="btn btn-primary">
            Your Requests
          </Link>
        </div>
        <div className="container profile">
          <div className="text-center" style={{ fontFamily: "Dancing Script" }}>
            <h2>Incoming Requests</h2>
          </div>
          <div class="container px-4">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 gx-5">
              {requests && requests.map((item) => createReqData(item))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
