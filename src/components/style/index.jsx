import React from 'react';
import cssModules from 'react-css-modules';
import styles from '../../styles/mixins.css';

const Style = React.createClass({
  propTypes: {
    styles: React.PropTypes.object,
    settings: React.PropTypes.object.isRequired,
  },

  getStyle() {
    return (
      `
        .${this.props.styles.primaryBackground},
        .${this.props.styles.primaryBackground}:hover{
          background:${this.props.settings.primary_color}
        }
      `
    );
  },

  render() {
    return (
      <style>{this.getStyle()}</style>
    );
  },
});


export default cssModules(Style, styles, {allowMultiple: true});
