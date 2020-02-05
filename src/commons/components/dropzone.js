import React, { Component } from "react";
import PropTypes from "prop-types";

import { SVG } from "../../helpers/svg";

import "../styles/dropzone.css";

class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  render = () => {
    return (
      <div
        className="DropzoneIcon"
        onClick={() => this.refs.dropzoneInputRef.click()}
        onDrop={event => {
          AddPhoto(event.dataTransfer.files, this.props.onAddPhoto);
        }}
        onDragOver={event => {
          event.stopPropagation();
          event.preventDefault();
          event.dataTransfer.effectAllowed = "copyMove";
          this.setState(() => {
            return { hovered: true };
          });
        }}
        onDragLeave={() =>
          this.setState(() => {
            return { hovered: false };
          })
        }
        onMouseEnter={() =>
          this.setState(() => {
            return { hovered: true };
          })
        }
        onMouseLeave={() =>
          this.setState(() => {
            return { hovered: false };
          })
        }
      >
        {this.props.override &&
        this.props.image !== undefined &&
        this.props.image.length > 0 ? (
          <img src={this.props.image} alt="Drop files here" />
        ) : (
          <div>
            <img
              src={SVG.addImageWhite}
              alt="Drop files here"
              style={{ opacity: this.state.hovered ? "0" : "1" }}
            />
            <img
              src={SVG.addImageBlack}
              alt="Drop files here"
              style={{ opacity: this.state.hovered ? "1" : "0" }}
            />
          </div>
        )}
        <input
          className="DropzoneInput"
          ref="dropzoneInputRef"
          type="file"
          accept="image/*"
          multiple
          onChange={event =>
            AddPhoto(event.target.files, this.props.onAddPhoto)
          }
        />
      </div>
    );
  };
}

const AddPhoto = (files, onAddPhoto) => {
  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    reader.onload = event => {
      let image = new Image();
      image.onload = () => {
        onAddPhoto(event.target.result);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(files.item(i));
  }
};

Dropzone.propTypes = {
  onAddPhoto: PropTypes.func.isRequired,
  override: PropTypes.bool,
  image: PropTypes.string
};

export default Dropzone;
