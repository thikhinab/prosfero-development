import axios from "axios";
import { useContext, useState, useEffect, useRef } from "react";
import { Redirect } from "react-router";
import Conversation from "../components/Conversation";
import Message from "../components/Message";
import NavigationBar from "../components/NavigationBar";
import { UserContext } from "../utils/UserContext";
import { io } from "socket.io-client";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import "./../style/Chat.css";

const Chat = () => {
  const { user, setUser } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [chatUsername, setChatUsername] = useState("");
  const [expanded, setExpanded] = useState(true);
  const socket = useRef();

  useEffect(() => {
    const setExpandValue = () => {
      if (window.innerWidth > 992) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    window.addEventListener("resize", setExpandValue);
  }, []);

  useEffect(() => {
    socket.current = io();
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.emit("addUser", user.id);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`api/v1/conversations/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`api/v1/messages/${currentChat?._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const recieverId = currentChat.members.find((member) => member !== user.id);

    socket.current.emit("sendMessage", {
      senderId: user.id,
      recieverId,
      text: newMessage,
    });

    try {
      const instance = axios.create({
        baseURL: `api/v1/messages`,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const res = await instance.post(``, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="container" style={{ margin: "auto", padding: "1rem" }}>
        <div className="chat row">
          <div
            className="col-lg-3 xcxcsidebar"
            style={{
              backgroundColor: "#e6f5ff",
              borderRadius: "1rem",
              padding: "1rem",
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col">
                  <h3>Conversations</h3>
                </div>
                {expanded ? (
                  <div className="col-3 toggle-wrapper">
                    <ExpandLessIcon
                      className="chat-toggle"
                      onClick={() => setExpanded((prev) => !prev)}
                    />
                  </div>
                ) : (
                  <div className="col-3 toggle-wrapper">
                    <ExpandMoreIcon
                      className="chat-toggle"
                      onClick={() => setExpanded((prev) => !prev)}
                    />
                  </div>
                )}
              </div>
            </div>

            <hr />
            <div
              className="toggleConversation"
              style={{ display: !expanded && "none" }}
            >
              {conversations.map((c) => {
                return (
                  <div
                    key={c._id}
                    onClick={() => {
                      setCurrentChat(c);
                    }}
                  >
                    <Conversation
                      conversation={c}
                      currentUser={user}
                      onCustomClick={(name) => setChatUsername(name)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col cxcxchatbox">
            {chatUsername !== "" && (
              <>
                <h3 style={{ paddingTop: "1rem" }}>{chatUsername}</h3>
                <hr />
              </>
            )}

            <div className="chatbox-wrapper">
              {currentChat ? (
                <>
                  <div className="chat-window">
                    {messages.length === 0 && (
                      <div
                        className="text-center"
                        style={{ marginTop: "2rem" }}
                      >
                        <span className="text-muted">No messages yet</span>
                      </div>
                    )}
                    {messages.map((m) => {
                      return (
                        <div ref={scrollRef} key={m._id}>
                          <Message message={m} own={m.sender === user.id} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="chat-input">
                    <textarea
                      className="chat-input-textarea"
                      rows="3"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="button-wrapper">
                      <button
                        className="chat-input-button btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="text-center"
                  style={{
                    fontSize: "3rem",
                    color: "lightgrey",
                    marginTop: "6rem",
                    height: "65vh",
                  }}
                >
                  <span>Open a conversation to start a chart</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
