import React from "react";
import "./Styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function MySlider() {
  return (
    <div id="mySlider" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="Images/image1.jpg"
            className="d-block w-100"
            alt="Slide 1"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image2.jpg"
            className="d-block w-100"
            alt="Slide 2"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image3.jpg"
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image4.jpg"
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image5.jpg"
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mySlider"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mySlider"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default MySlider;
