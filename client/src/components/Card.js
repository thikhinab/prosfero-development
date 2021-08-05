import React from "react";
import { Link } from "react-router-dom";

const Card = ({ post, index, archive }) => {
  return (
    <div key={index} className="col col-xl-3 col-lg-4 col-md-6 col-sm-12">
      <div className="card h-100">
        {archive ? (
          <img
            src={post.image}
            alt={post.id}
            className="card-img-top crop"
            style={{ maxHeight: "15rem" }}
          />
        ) : (
          <Link to={`/post/${post.id}`}>
            <img
              src={post.image}
              alt={post.id}
              className="card-img-top crop"
              style={{ maxHeight: "15rem" }}
            />
          </Link>
        )}

        <div className="card-body">
          {archive ? (
            <div style={{ textDecoration: "none", color: "black" }}>
              {" "}
              <h5 className="card-title">{post.title}</h5>{" "}
            </div>
          ) : (
            <Link
              to={`/post/${post.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h5 className="card-title">{post.title}</h5>
            </Link>
          )}
          <small className="text-muted">{post.category}</small>
          <hr />
          <p className="card-text">{post.desc}</p>
        </div>
        <div className="card-footer">
          <small>{post.username}</small>
          <br />
          <small className="text-muted">
            {archive
              ? new Date(post.originalDate).toUTCString()
              : new Date(post.createdAt).toUTCString()}
          </small>
          <hr />
          <small>{post.location?.label}</small>
        </div>
      </div>
    </div>
  );
};

export default Card;
