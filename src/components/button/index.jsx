import React from 'react';
import cssModules from 'react-css-modules';
import classnames from 'classnames';
import styles from './index.css';

const Button = React.createClass({
  displayName: 'Button',

  propTypes: {
    icon: React.PropTypes.element,
    block: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    padding: React.PropTypes.number,
    shape: React.PropTypes.string,
    provider: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array,
      React.PropTypes.string,
    ]).isRequired,
  },

  render() {
    const { block, disabled, shape, provider, padding, icon, children } = this.props;
    const cn = classnames({
      button: true,
      block: block,
      disabled: disabled,
      [shape]: !!shape,
      [provider]: !!provider,
    });
    return (
      <button {...this.props} style={{padding}} styleName={cn}>{icon}{children}</button>
    );
  },
});


export default cssModules(Button, styles, {allowMultiple: true});
