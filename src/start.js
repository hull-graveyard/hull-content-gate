import React from 'react';
import ReactDOM from 'react-dom';

// Starts the React Ship
import Ship from './components/ship';
import Engine from './lib/engine';
import I18n from './lib/i18n';

// This method, when called, starts the ship
export default function(element, deployment, hull) {
  const engine = new Engine(element, deployment, hull);
  I18n.setTranslations(deployment.ship.translations);
  // Render Ship into the designated root
  ReactDOM.render(<Ship engine={engine} hull={hull}/>, element);
  if (deployment.onUpdate && typeof deployment.onUpdate === 'function') {
    deployment.onUpdate(function(ship) {
      engine.updateShip(ship);
    });
  }
}
