'use strict';
/* global Hull, module*/

// Our boilerplate uses React.
import React from 'react';

// CSS Modules for sandboxed styles.
import reactCSSModules from 'react-css-modules';
import shipStyles from './index.css';
import Icon from '../icon';
import Button from '../button';
import { translate } from '../lib/i18n';

@reactCSSModules(shipStyles, {allowMultiple: true})
export default class Ship extends React.Component {

  static propTypes = {
    hull: React.PropTypes.object.isRequired,
    engine: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object,
  }

  state = this.props.engine.getState()

  componentWillMount() {
    this.props.engine.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(this.props.engine.getState());
  }

  handleLogin = () => {
    this.props.engine.login();
  }
  render() {
    const shape = 'radius';
    if (this.state.user) {
      return <div></div>;
    }
    return (
      <div styleName="overlay">
        <p className="right">
          <Button
            block={false}
            shape={shape}
            onClick={this.handleLogin}><Icon colorize={shape !== 'text'} name="user_circle"/>{translate('log in')}</Button>
        </p>
        <p><strong>{translate('log in to view content')}</strong></p>
      </div>
    );
  }
}
