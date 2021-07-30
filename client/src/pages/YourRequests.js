import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";

const YourRequests = () => {
  const [requests, setRequests] = useState([""]);
  const { user, setUser } = useContext(UserContext);
  let history = useHistory();

  const url = "api/v1/requests";

  useEffect(() => {
    if (user.token !== null) {
      const instance = axios.create({
        baseURL: url,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      instance
        .post("", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setRequests(res.data);
          console.log("requests: ", res);
        })
        .catch((err) => alert(err));
    }
  }, []);

  if (!user.token || user.expired) {
    return <Redirect to="/login" />;
  }

  const success = (e, reqData) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance
      .post(`/requests/success/${reqData[5]}`)
      .then(alert("Congatulations!"));
  };

  const fail = (e, reqData) => {
    e.preventDefault();
    const instance = axios.create({
      baseURL: "api/v1",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    instance.post(`/requests/fail/${reqData[6]}`).then(alert("Oh wells :("));
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
    {
      console.log(reqData);
    }
    if (reqData[3] === "approved") {
      return (
        <div className="card h-100">
          <div className="card-body">
            Your request on <b>{reqData[0]}</b> has been accepted!
            <br /> Contact them at <b>{reqData[4]}</b>
            <br />
            <br />
            <button
              className="btn btn-primary"
              onClick={() => startConversation(reqData[7])}
            >
              Start Conversation
            </button>
            <div class="p-3 border bg-light">
              <i> Request made on {new Date(reqData[1]).toUTCString()}</i>
              <br />
              You said:
              <br />
              {reqData[2]}
            </div>
          </div>
          Were you able to receive the item?
          <br /> <br />
          <a
            href="#"
            class="btn btn-outline-success"
            onClick={(e) => success(e, reqData)}
          >
            Able
          </a>
          <a
            href="#"
            class="btn btn-outline-danger"
            onClick={(e) => fail(e, reqData)}
          >
            Unable
          </a>
        </div>
      );
    } else if (reqData[3] === "declined") {
    } else {
      return (
        <div class="col">
          <div class="p-3 border bg-light">
            You requested <b>{reqData[0]}</b> <br />
            <i> On {new Date(reqData[1]).toUTCString()}</i>
            <br />
            You said:
            <br />
            {reqData[2]}
          </div>
        </div>
      );
    }
  };

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
      <div className="container profile" style={{ marginTop: "1rem" }}>
        <div className="text-center" style={{ fontFamily: "Dancing Script" }}>
          <h2>Requests You Made</h2>
        </div>
        <div class="container px-4">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 gx-5">
            {requests && requests.map((item) => createReqData(item))}
          </div>
        </div>
      </div>
    </>
  );
};

export default YourRequests;
