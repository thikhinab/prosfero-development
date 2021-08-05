import { useState } from "react";

const CATEGORIES = [
  {
    _id: "1",
    name: "Food",
  },
  {
    _id: "2",
    name: "Electronics",
  },
  {
    _id: "3",
    name: "Stationary",
  },
  {
    _id: "4",
    name: "Furniture",
  },
  {
    _id: "5",
    name: "Other",
  },
];

const Filter = ({ handleFilters, handleOrder, customStyle }) => {
  const [checked, setChecked] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    value: "1",
    id: "latest",
  });

  const handleRadio = (e) => {
    const newOrder = {
      value: e.target.value,
      id: e.target.id,
    };
    setSortOrder(newOrder);
    handleOrder(newOrder);
  };

  const handleChange = (val) => {
    const currentIndex = checked.indexOf(val);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(val);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleFilters(newChecked);
  };

  const renderCheckbox = () => {
    return CATEGORIES.map((cat) => {
      return (
        <div className="form-check form-check-inline" key={cat._id}>
          <input
            className="form-check-input "
            type="checkbox"
            id={cat._id}
            checked={checked.includes(cat.name)}
            onChange={() => handleChange(cat.name)}
          />
          <label className="form-check-label" htmlFor={cat._id}>
            {cat.name}
          </label>
        </div>
      );
    });
  };

  return (
    <div style={customStyle}>
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#filter"
        aria-expanded="false"
        aria-controls="filter"
        style={{ marginBottom: "1rem" }}
      >
        {"Filter & Sort"}
      </button>
      <div className="collapse" id="filter" style={{ marginBottom: "1rem" }}>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">Filter by Category</div>
              <div className="card-body">{renderCheckbox()}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="card" s>
              <div className="card-header">Sort Posts</div>
              <div
                className="card-body text-center"
                style={{ paddingBottom: "0rem" }}
              >
                <div
                  className="btn-group"
                  role="group"
                  style={{ margin: "0rem", padding: "0rem" }}
                >
                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="latest"
                    autoComplete="off"
                    value="1"
                    checked={sortOrder.value === "1"}
                    onChange={() => handleRadio}
                  />
                  <label className="btn btn-outline-primary" htmlFor="latest">
                    Latest Posts first
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="oldest"
                    value="-1"
                    autoComplete="off"
                    checked={sortOrder.value === "-1"}
                    onChange={() => handleRadio}
                  />
                  <label className="btn btn-outline-primary" htmlFor="oldest">
                    Oldest Posts first
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
