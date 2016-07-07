
/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { orgActionTypes, spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_RECEIVED: {
        const spaces = action.org.spaces || [];
        const spacesWithOrgGuid = spaces.map((space) => {
          const org = { org: action.org.guid };
          return Object.assign({}, space, org);
        });
        if (spacesWithOrgGuid.length > 0) {
          this.mergeMany('guid', spacesWithOrgGuid, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case spaceActionTypes.SPACE_FETCH: {
        this.fetching = true;
        break;
      }

      case spaceActionTypes.SPACE_RECEIVED: {
        this.fetching = false;
        this.merge('guid', action.space, () => {});
        break;
      }

      default:
        break;
    }
  }
}

const _SpaceStore = new SpaceStore();

export default _SpaceStore;
