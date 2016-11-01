
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import OrgStore from '../../../stores/org_store.js';
import { orgActionTypes } from '../../../constants';

describe('OrgStore', () => {
  var sandbox;

  beforeEach(() => {
    OrgStore._currentOrgGuid = null;
    OrgStore._fetching = false;
    OrgStore._fetched = false;
    OrgStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should start with an empty array', () => {
      expect(OrgStore.getAll()).toBeEmptyArray();
    });
  });

  describe('get currentOrgGuid', function() {
    it('should start with null, none selected', function() {
      expect(OrgStore.currentOrgGuid).toBe(null);
    });

    it('should return the current org its on', function() {
      var expected = 'asdlfkja;';
      OrgStore._currentOrgGuid = expected;
      expect(OrgStore.currentOrgGuid).toEqual(expected);
    });
  });

  describe('updateOpenOrgs()', function() {
    it('should return an array', function() {
      var guid = 'orgguid';
      var actual = OrgStore.updateOpenOrgs(guid);
      expect(actual.length).toEqual(0);
    });

    it('should set the org to open', function (){
      var guid = 'orgguid';
      OrgStore._data = Immutable.fromJS([{ guid: guid }]);
      var expected = [{ guid: guid, space_menu_open: true }];
      var actual = OrgStore.updateOpenOrgs(guid);

      expect(actual).toEqual(expected);
    });

    it('should set all other orgs to not open', function () {
      var guid = 'orgguid';
      var initial = [{ guid: guid }, { guid: guid * 2 }, { guid: guid * 3 }];
      var expected = [
        { guid: guid, space_menu_open: true },
        { guid: guid * 2, space_menu_open: false },
        { guid: guid * 3, space_menu_open: false },
      ];
      OrgStore._data = Immutable.fromJS(initial);
      var actual = OrgStore.updateOpenOrgs(guid);
      expect(actual).toEqual(expected);
    });
  });

  describe('on orgs received', () => {
    it('should set data to passed in orgs', () => {
      var expected = [{guid: '1as'}, {guid: '2as'}];
      expect(OrgStore.getAll()).toBeArray();

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: expected
      });

      expect(OrgStore.getAll().length).toEqual(2);
      expect(OrgStore.getAll()).toEqual(expected);
    });

    it('should set fetching to false', () => {
      var expected = [{guid: '1as'}, {guid: '2as'}];

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: expected
      });

      expect(OrgStore.fetching).toEqual(false);
    });

    it('should merge data with existing orgs', () => {
      var updates = [{guid: 'aaa1', name: 'sue'},
            {guid: 'aaa2', name: 'see'}],
          current = [{guid: 'aaa1', memory: 1024}];

      OrgStore._data = Immutable.fromJS(current);
      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: updates
      });

      expect(OrgStore.getAll().length).toEqual(2);
      let actual = OrgStore.get('aaa1');
      expect(actual).toBeTruthy();
      expect(actual.name).toEqual('sue');
      expect(actual.memory).toEqual(1024);
    });
  });

  describe('on org fetch', function() {
    it('should set fetching to true, fetched to false', function() {
      expect(OrgStore.fetching).toEqual(false);

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_FETCH,
        orgGuid: 'orgGuid'
      });

      expect(OrgStore.fetching).toEqual(true);
      expect(OrgStore.fetched).toEqual(false);
    });

    it('should call the api org fetch function', function() {
      var spy = sandbox.spy(cfApi, 'fetchOrg'),
          expected = 'xsfewq';

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_FETCH,
        orgGuid: expected
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });
  });

  describe('on org received', function() {
    it('should emit a change event', function() {
      var spy = sandbox.spy(OrgStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_RECEIVED,
        org: { guid: 'asdf' }
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should ensure org passed in has data added to it', () => {
      var testGuid = 'xaaddf',
          expected = {
            guid: testGuid,
            name: 'orgA',
            spaces: [
              { guid: 'xaaddf1', name: 'spaceA'},
              { guid: 'xaaddf2', name: 'spaceB'}
            ]
          };

      OrgStore.push({ guid: testGuid, spaceUrl: 'https://space' });
      expect(OrgStore.get(testGuid)).toBeObject();

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_RECEIVED,
        org: expected
      });

      expect(OrgStore.get(testGuid).guid).toEqual(expected.guid);
      expect(OrgStore.get(testGuid).spaces).toEqual(expected.spaces);
    });
  });

  describe('on a space menu toggle', function() {
    let expected;
    beforeEach(function () {
      expected = { guid: 'sdsf', name: 'testA' };
      OrgStore.push(expected);
    });

    xit('should toggle space_menu_open on the correct org', function() {
      var spy = sandbox.spy(OrgStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_TOGGLE_SPACE_MENU,
        orgGuid: expected.guid
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(OrgStore.get(expected.guid).space_menu_open).toEqual(true);
    });
  });

  describe('get currentOrgName()', function() {
    it('should return emtpy string if no org', function() {
      const actual = OrgStore.currentOrgName;

      expect(actual).toEqual('');
    });

    it('should return org name if org', function() {
      const guid = 'zmn,vweiqodnjt7';
      const expected = 'orgname';
      const org = { guid: guid, name: expected };

      OrgStore.push(org);
      OrgStore._currentOrgGuid = guid;

      const actual = OrgStore.currentOrgName;

      expect(actual).toEqual(expected);
    });
  });
});
