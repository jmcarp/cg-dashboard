
/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { appActionTypes } from '../constants.js';

class AppStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this._currentAppGuid = null;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case appActionTypes.APP_FETCH:
        cfApi.fetchApp(action.appGuid);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        break;

      case appActionTypes.APP_STATS_FETCH:
        cfApi.fetchAppStats(action.appGuid);
        break;

      case appActionTypes.APP_RECEIVED:
        this.fetching = false;
        this.fetched = true;
        this.merge('guid', action.app, () => { });
        this.emitChange();
        break;

      case appActionTypes.APP_STATS_RECEIVED: {
        this.setOptions(action.app, { guid: action.appGuid });
        break;
      }

      case appActionTypes.APP_ALL_FETCH: {
        cfApi.fetchAppAll(action.appGuid);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_ALL_RECEIVED: {
        this.fetching = false;
        this.fetched = true;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_CHANGE_CURRENT: {
        this._currentAppGuid = action.appGuid;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  get currentAppGuid() {
    return this._currentAppGuid;
  }
}

const _AppStore = new AppStore();

export default _AppStore;
