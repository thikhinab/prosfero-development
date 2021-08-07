import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../utils/UserContext";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { Redirect } from "react-router";
import { toast } from 'react-toastify';
import Card from "./../components/Card";
import Filter from "../components/Filter";
import "../style/Home.css";

const LIMIT = 8;
const BASE_URL = "/api/v1/posts";

const Search = () => {
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

  const escapeRegExpChars = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const params = new URLSearchParams(document.location.search.substring(1));
  const query = params.get("q");

  const fetchData = () => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    instance
      .get(`/filter`, {
        params: {
          q: escapeRegExpChars(query),
          limit: LIMIT,
          skip: skip,
          order: parseInt(sortOrder.value),
        },
      })
      .then((res) => {
        if (res.data.length < 8) {
          setMore(false);
        }
        const newState = [...state, ...res.data];
        setState(newState);
        setSkip(skip + LIMIT);
        setLoading(false);
        showResults(filters, newState);
      })
      .catch((err) => toast.error(err));
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
    setState([]);
    setFilteredList([]);
    setSkip(0);
    setMore(true);
    setLoading(false);
  }, [query]);

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

  if (!user.token || user.expired) {
    return <Redirect to="/login" />;
  }

  const showResults = (fil, list) => {
    if (fil.length > 0) {
      setFilteredList(list.filter((post) => fil.includes(post.category)));
    } else {
      setFilteredList(list);
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
      setSkip(0);
      setState([]);
      setFilteredList([]);
      setLoading(false);
      setMore(true);
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
      <div className="container" style={{ marginTop: "1rem" }}>
        <div style={{ fontWeight: "bold", paddingBottom: "1rem" }}>
          <h2>Search Results for "{query}"</h2>
        </div>
        <div className="filter">
          <Filter
            handleFilters={(filters) => handleFilters(filters)}
            handleOrder={handleOrder}
            customStyle={state.length === 0 ? { display: "none" } : {}}
          />
        </div>
        {filteredList.length > 0 ? (
          <>
            <div
              className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"
              id="post-container"
            >
              {filteredList.map((post, index) => (
                <Card post={post} index={index} />
              ))}
            </div>
          </>
        ) : (
          `Your search "${query}" did not match any listings.`
        )}

        {!loading && more ? (
          <div ref={setElement} style={{ padding: "2rem" }}></div>
        ) : (
          <div id="footer" style={{ padding: "1rem" }}>
            {" "}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
