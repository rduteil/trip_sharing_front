import React from "react";
import PropTypes from "prop-types";

import Icon from "./icon";
import { SVG } from "../../helpers/svg";
import { LanguagePropTypes } from "../../helpers/strings";
import "../styles/header.css";

const Header = ({ language, onSwitchLanguage, onPushUser }) => (
  <div className="HeaderWrapper">
    <div className="CaptionBox HeaderWelcome">{language.header.welcome}</div>
    <div className="FlexRow">
      <div
        className="CaptionBox Clickable HeaderLanguage"
        onClick={onSwitchLanguage}
      >
        {language.header.trigram}
      </div>
      <Icon
        overlay={false}
        enabled={true}
        defaultIcon={SVG.personWhite}
        hoverIcon={SVG.personBlack}
        onClick={onPushUser}
      />
    </div>
  </div>
);

Header.propTypes = {
  language: LanguagePropTypes,
  onSwitchLanguage: PropTypes.func.isRequired,
  onPushUser: PropTypes.func.isRequired
};

export default Header;
