import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "../index.css";
import Username from "./Username";

export default function PageNotFound() {
  return (
    <div>
      <Helmet>
        <title>Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <div className="container d-flex flex-column justify-content-around mainDiv">
          <div className="content d-flex justify-content-center">
            <h2>Golden-Box</h2>
            <h2>Golden-Box</h2>
          </div>

          <div className="bottomText_NotFound bottomText">
            Page not found...Head back to  <Link to={Username} className="mx-2">Login Page</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
