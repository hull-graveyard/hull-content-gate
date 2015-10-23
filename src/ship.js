'use strict';

// For better integration in React apps, we recommend using this pattern.
// We've seen it work pretty well.
import Ship from './components/ship';
import start from './start';

if ( Hull && Hull.onEmbed ) {
  Hull.onEmbed(start);
}

export default Ship;
