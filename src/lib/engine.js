import { EventEmitter } from 'events';
import _ from 'lodash';

const CHANGE = 'CHANGE';

function cutoffParagraph(paragraph, cutoff) {
  if (cutoff <= 0) {
    paragraph.parentNode.removeChild(paragraph);
    return cutoff;
  }

  const text = paragraph.textContent;
  const length = text.length;

  if (length > cutoff) {
    const rest = length - cutoff;
    const remainingText = text.slice(0, rest);
    paragraph.textContent = `${remainingText}...`;
    return 0;
  }

  return cutoff - length;
}

export default class Engine extends EventEmitter {

  constructor(element, deployment, hull) {
    super();

    this._hull = hull;
    this._ship = deployment.ship;
    this._settings = this._ship.settings;
    this._cutoff = this._settings.cutoff;

    this._deployment_settings = deployment.settings;
    this.element = element;
    this.container = element.parentNode;

    this.setInitialState();

    if (!this._pristine) { this._pristine = this.container.innerHTML; }
    if (this.isGated()) { this.snip(this.container); }

    const onChange = () => {
      this._user = this._hull.currentUser();
      if (this.isOpen()) {
        this.restore();
      }
      this.emitChange();
    };

    this._hull.on('hull.user.*', onChange);
    onChange();
  }
  restore() {
    this.element.parentNode.innerHTML = this._pristine;
  }

  pageMatches() {
    return _.some(this._deployment_settings.gated_pages, (page)=>{
      return new RegExp(page).test(window.location.pathname);
    });
  }

  isGated() {
    return this.pageMatches() && !this.isOpen();
  }

  hasUser() {
    return this._user && (this._user.email || this._user.contact_email);
  }

  isOpen() {
    const action = this._settings.button_action;
    if (action === 'click') { return this._open; }
    return this._open || this.hasUser();
  }

  updateShip(ship) {
    this._ship = ship;
    this.emitChange();
  }

  setInitialState() {
    this._open = false;
    this._user = this._hull.currentUser();
  }


  getState() {
    return {
      settings: this._ship.settings,
      open: this.isOpen(),
    };
  }

  reveal() {
    this._hull.track('Reveal Article Content');
    const action = this._settings.button_action;
    if (action === 'open') {
      this._open = true;
      this.restore();
      this.emitChange();
    } else {
      this._hull.emit('hull.login.showDialog');
    }
  }

  snip(container) {
    const paragraphs = _.pull([...container.children], this.element);
    let cut = this._cutoff;
    if (paragraphs.length > 2) {
      // Skip paragraphs as long as we're not below cutoff.\
      while (paragraphs.length) {
        const paragraph = paragraphs.shift();
        cut = cutoffParagraph(paragraph, cut);
      }
    } else if (paragraphs.length === 1 ) {
      // only one paragraph. Search one step deeper ?
      this.snip(container);
    } else {
      // no paragraphs at all. We're in the content itself.
      cutoffParagraph(container, cut);
    }
    this.emitChange();
  }

  addChangeListener(listener) {
    this.addListener(CHANGE, listener);
  }

  removeChangeListener(listener) {
    this.removeListener(CHANGE, listener);
  }

  emitChange() {
    this.emit(CHANGE);
  }

}

