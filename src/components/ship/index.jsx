'use strict';
/* global Hull, module*/

// Our boilerplate uses React.
import React from 'react';

// CSS Modules for sandboxed styles.
import reactCSSModules from 'react-css-modules';
import shipStyles from './index.css';
import Style from '../style';
import Button from '../button';
import { translate } from '../../lib/i18n';

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

  handleReveal = () => {
    this.props.engine.reveal();
  }
  render() {
    const shape = 'radius';
    if (this.state.open) {
      return <div></div>;
    }
    return (
      <div styleName="overlay">
        <Style settings={this.state.settings}/>
        <div styleName="gradient"></div>
        <Button
          block={false}
          shape={shape}
          onClick={this.handleReveal}>{translate('Read More')}</Button>
      </div>
    );
  }
}
