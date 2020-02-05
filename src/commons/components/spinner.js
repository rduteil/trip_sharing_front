import React from "react";
import PropTypes from "prop-types";

import Background from "./background";
import XWing from "./xWing";

import "../styles/spinner.css";

const Spinner = ({ zIndex, xWings }) => (
  <div className="AbsolutePanel" style={{ zIndex: zIndex }}>
    <Background />
    {xWings ? (
      <div className="RedLeader">
        <XWing scale={0.25} angle={90} />
      </div>
    ) : (
      undefined
    )}
    {xWings ? (
      <div className="RedFive">
        <XWing scale={0.25} angle={90} />
      </div>
    ) : (
      undefined
    )}
    <div className="SpinnerOuter">
      <div className="SpinnerMarsOrbit SpinnerOrbit">
        <div className="SpinnerPlanet" />
        <div className="SpinnerEarthOrbit SpinnerOrbit">
          <div className="SpinnerPlanet">
            <div className="SpinnerMoonOrbit SpinnerOrbit">
              <div className="SpinnerMoon" />
            </div>
          </div>
          <div className="SpinnerVenusOrbit SpinnerOrbit">
            <div className="SpinnerPlanet" />
            <div className="SpinnerSun" />
          </div>
        </div>
      </div>
    </div>
    <div className="SpinnerRayBox" style={{ display: "none" }}>
      <div className="SpinnerRay ray1" />
      <div className="SpinnerRay ray2" />
      <div className="SpinnerRay ray3" />
      <div className="SpinnerRay ray4" />
      <div className="SpinnerRay ray5" />
      <div className="SpinnerRay ray6" />
      <div className="SpinnerRay ray7" />
      <div className="SpinnerRay ray8" />
      <div className="SpinnerRay ray9" />
    </div>
  </div>
);

Spinner.propTypes = {
  zIndex: PropTypes.number.isRequired,
  xWings: PropTypes.bool.isRequired
};

export default Spinner;
