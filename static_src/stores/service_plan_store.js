
/*
 * Store for service plans data. Service plans belong to a service so there's
 * separate functionality to get all plans under a particiular service.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';
import ServiceStore from './service_store.js';

class ServicePlanStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = Immutable.List();
  }

  getAllFromService(serviceGuid) {
    let fromService = this._data.filter((servicePlan) => {
      return servicePlan.get('service_guid') == serviceGuid;
    });

    return fromService.toJS();
  }

  parseJson(entities, key) {
    return entities.map((entity) => {
      if (entity[key]) {
        entity[key] = JSON.parse(entity[key]);
      }
      return entity;
    });
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_RECEIVED:
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        var services = this.formatSplitResponse(action.services);
        for (let service of services) {
          cfApi.fetchAllServicePlans(service.guid);
        }
        break;

      case serviceActionTypes.SERVICE_PLANS_FETCH:
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        cfApi.fetchAllServicePlans(action.serviceGuid);
        break;

      case serviceActionTypes.SERVICE_PLANS_RECEIVED:
        if (action.servicePlans) {
          var servicePlans = this.formatSplitResponse(action.servicePlans);
          servicePlans = this.parseJson(servicePlans, 'extra');

          this.mergeMany('guid', servicePlans, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;

      default:
        break;

    }
  }

};
let _ServicePlanStore = new ServicePlanStore();

export default _ServicePlanStore;
