import React from "react";
import PropTypes from "prop-types";

import Background from "../../commons/components/background";
import Dropzone from "../../commons/components/dropzone";

import Icon from "./icon";
import CarouselSlider from "./carouselSlider";
import CarouselThumbnail from "./carouselThumbnail";

import OpenLayers from "../../helpers/openLayers";
import { Toggles } from "../../helpers/enums";
import { SVG } from "../../helpers/svg";

import "../styles/carouselDisplayer.css";

class CarouselDisplayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Respectively close
      hoverFlags: [false],
      selectedPhoto: 0
    };
  }

  onAddPhoto = photo => {
    this.props.onAddPhoto(this.state.selectedPhoto, photo);
  };

  onUpdatePhoto = text => {
    this.props.onUpdatePhoto(this.state.selectedPhoto, text);
  };

  setFlag = (index, value) => {
    this.setState(state => {
      let copy = [...state.hoverFlags];
      copy[index] = value;
      return Object.assign({}, state, { hoverFlags: copy });
    });
  };

  selectIndex = index => {
    this.setState(state => {
      return Object.assign({}, state, { selectedPhoto: index });
    });
  };

  render = () => {
    if (!this.props.enabled) {
      return null;
    }

    let photos = this.props.layer
      .getSource()
      .getFeatureById(this.props.selectedStage)
      .get("photos");

    let captions = this.props.layer
      .getSource()
      .getFeatureById(this.props.selectedStage)
      .get("captions");

    return (
      <div>
        <Background />
        <div className="AbsolutePanel" style={{ zIndex: 2 }}>
          <div className="CarouselCloser">
            <Icon
              overlay={false}
              enabled={true}
              defaultIcon={SVG.closeWhite}
              hoverIcon={SVG.closeBlack}
              onClick={() =>
                this.props.onToggleValue(Toggles.CAROUSEL, false, undefined)
              }
            />
          </div>
          <div className="CarouselWrapper">
            <div className="CarouselColumn">
              {photos.map((photo, i) => {
                return (
                  <CarouselThumbnail
                    key={i}
                    source={photo}
                    index={i}
                    onSelectIndex={this.selectIndex}
                  />
                );
              })}
            </div>
            <div className="CarouselSlider">
              <CarouselSlider
                photos={photos}
                captions={captions}
                currentPhoto={this.state.selectedPhoto}
                onUpdatePhoto={this.onUpdatePhoto}
              />
            </div>
            <div className="CarouselDropzone">
              <Dropzone onAddPhoto={this.onAddPhoto} />
            </div>
          </div>
        </div>
      </div>
    );
  };
}

CarouselDisplayer.propTypes = {
  enabled: PropTypes.bool.isRequired,
  layer: PropTypes.instanceOf(OpenLayers.VectorLayer),
  selectedStage: PropTypes.number,
  onAddPhoto: PropTypes.func.isRequired,
  onUpdatePhoto: PropTypes.func.isRequired,
  onToggleValue: PropTypes.func.isRequired
};

export default CarouselDisplayer;
