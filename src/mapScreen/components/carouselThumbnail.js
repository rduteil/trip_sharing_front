import React from "react";
import PropTypes from "prop-types";

import "../styles/carouselThumbnail.css";

const CarouselThumbnail = ({ source, index, onSelectIndex }) => (
  <div className="ThumbnailWrapper" onClick={() => onSelectIndex(index)}>
    <img src={source} alt="Unable to load" />
  </div>
);

CarouselThumbnail.propTypes = {
  source: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onSelectIndex: PropTypes.func.isRequired
};

export default CarouselThumbnail;
