import React from "react";
import PropTypes from "prop-types";

import "../styles/carouselSlider.css";

const CarouselSlider = ({ photos, captions, currentPhoto, onUpdatePhoto }) => (
  <div className="CarouselSliderWrapper">
    {photos.map((photo, i) => {
      return (
        <div
          key={i}
          className={"SlideWrapper"}
          style={{ opacity: i === currentPhoto ? 1 : 0 }}
        >
          <img src={photo} alt="Unable to load" />
          <div className="SlideCaption">
            <input
              className="CaptionBox"
              type="text"
              value={captions[i]}
              onChange={event => onUpdatePhoto(event.target.value)}
            />
          </div>
        </div>
      );
    })}
  </div>
);

CarouselSlider.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
  captions: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentPhoto: PropTypes.number.isRequired,
  onUpdatePhoto: PropTypes.func.isRequired
};

export default CarouselSlider;
