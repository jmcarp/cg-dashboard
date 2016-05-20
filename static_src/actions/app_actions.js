
/*
 * Actions for app entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { appActionTypes } from '../constants';

export default {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_FETCH,
      appGuid: appGuid
    });
  },

  receivedApp(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RECEIVED,
      app: app
    });
  },

  fetchStats(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_STATS_FETCH,
      appGuid: appGuid
    });
  },

  receivedAppStats(appGuid, app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_STATS_RECEIVED,
      appGuid: appGuid,
      app: app
    });
  }
};
