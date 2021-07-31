import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import "../style/CreatePost.css";
import axios from "axios";
import { Redirect } from "react-router";
import "../style/Home.css";
import Card from "../components/Card";
import Filter from "../components/Filter";
import { toast } from "react-toastify";

const LIMIT = 8;
const BASE_URL = "api/v1/posts";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);
  const [skip, setSkip] = useState(0);
  const [element, setElement] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [sortOrder, setSortOder] = useState({
    value: "1",
    id: "latest",
  });

  const fetchData = () => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    instance
      .get(`/limited/${LIMIT}/${skip}`, {
        params: {
          order: parseInt(sortOrder.value),
        },
      })
      .then((res) => {
        if (res.data.length < 8) {
          setMore(false);
        }
        setState([...state, ...res.data]);
        setSkip(skip + LIMIT);
        setLoading(false);
        showResults(filters, [...state, ...res.data]);
      })
      .catch((err) => alert(err));
  };

  const loader = useRef(fetchData);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          setLoading(true);
          loader.current();
        }
      },
      { rootMargin: "50px", threshold: 0.25 }
    )
  );

  useEffect(() => {
    loader.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  const showResults = (fil, newState) => {
    if (fil.length > 0) {
      setFilteredList(newState.filter((post) => fil.includes(post.category)));
    } else {
      setFilteredList(newState);
    }
  };

  const handleFilters = (fil) => {
    const newFilters = fil;
    showResults(newFilters, state);
    setFilters(newFilters);
  };

  const handleOrder = (order) => {
    if (order.value !== setSortOder.value) {
      setSortOder(order);
      setLoading(false);
      setMore(true);
      setSkip(0);
      setState([]);
      setFilteredList([]);
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
      <div className="container" style={{ marginTop: "1rem" }}>
        <div
          className="title text-center"
          style={{ fontFamily: "Dancing Script", fontWeight: "bold" }}
        >
          <h1>Listings</h1>
        </div>
        <div className="filter">
          <Filter
            handleFilters={(filters) => handleFilters(filters, "Category")}
            handleOrder={handleOrder}
            customStyle={state.length === 0 ? { display: "none" } : {}}
          />
        </div>
        <div
          className="col row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"
          id="post-container"
        >
          {filteredList.length > 0 &&
            filteredList.map((post, index) => (
              <Card post={post} index={index} />
            ))}

          {!loading && more ? (
            <div ref={setElement} style={{ padding: "2rem" }}></div>
          ) : (
            <div id="footer" style={{ padding: "1rem" }}>
              {" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
