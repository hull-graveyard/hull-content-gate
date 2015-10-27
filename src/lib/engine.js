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

    const isGated = _.some(deployment.settings.gated_pages, (page)=>{
      return new RegExp(page).test(window.location.pathname);          
    });


    this._ship = deployment.ship;
    this._hull = hull;
    this.element = element;
    this.container = element.parentNode;

    const onChange = () => {
      this.resetUser();
      this.emitChange();
    };
    if (!this._pristine) { this._pristine = this.container.innerHTML; }
    this.cutoff = deployment.ship.settings.cutoff;
    if (isGated) {
      this.snip(this.container);
    }
    this._hull.on('hull.user.*', onChange);
    onChange();
  }

  resetUser() {
    this._user = this._hull.currentUser();
    this.unsnip();
  }


  snip(container) {
    const paragraphs = _.pull([...container.children], this.element);
    let cut = this.cutoff;
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

  unsnip() {
    if (this._user && (this._user.email || this._user.contact_email)) {
      this.element.parentNode.innerHTML = this._pristine;
    }
  }

  updateShip(ship) {
    this._ship = ship;
    this.emitChange();
  }

  getState() {
    return {
      settings: this._ship.settings,
      user: this._user,
    };
  }

  login() {
    this._hull.emit('hull.login.showDialog');
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

