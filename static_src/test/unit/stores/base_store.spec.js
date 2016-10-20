
import Immutable from 'immutable';

import '../../global_setup.js';

import BaseStore from '../../../stores/base_store.js';

describe('BaseStore', () => {
  var sandbox,
      store;

  beforeEach(() => {
    store = new BaseStore();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('subscribe()', function() {
    it('it should set the dispatch token to an app dispatcher register',
        function() {

    });
  });

  describe('get dispatchToken()', function() {
    it('should return the hidden dispatch token', function() {
      var expected = {};

      store._dispatchToken = expected;

      expect(store.dispatchToken).toEqual(expected);
    });
  });

  describe('emitChange()', function() {
    it('should emit an event with string CHANGE', function() {
      var spy = sandbox.spy();

      store.on('CHANGE', spy);

      store.emitChange();

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('addChangeListener()', function() {
    it('should add a listener on CHANGE with the callback passed', function() {
      var spy = sandbox.spy();

      store.addChangeListener(spy);

      store.emit('CHANGE');

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('removeChangeListener()', function() {
    it('should remove a listener of type CHANGE with callback passed',
        function() {
      var spy = sandbox.spy();

      store.addChangeListener(spy);
      store.removeChangeListener(spy);

      store.emit('CHANGE');

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('get()', function() {
    it('should get an entity by guid if it exists', function() {
      var expectedGuid = 'adkfjlzcxv',
          expected = { guid: expectedGuid };

      store.push(expected);

      let actual = store.get(expectedGuid);

      expect(actual).toEqual(expected);
    });

    it('should returned undefined if entity with guid it doesn\'t exist',
        function() {
      let actual = store.get('adjlfk');

      expect(actual).toBe(undefined);
    });

    it('should return undefined if not guid is passed in', function() {
      store.push({ guid: 'adsf' });

      let actual = store.get();

      expect(actual).toBe(undefined);
    });
  });

  describe('getAll()', function() {
    it('should get all entities if there are some', function() {
      var expected = [{ guid: 'adf' }, { guid: 'adsfjk' }];

      expected.forEach((e) => store.push(e) );

      let actual = store.getAll();

      expect(actual).toBeTruthy();
      expect(actual.length).toEqual(2);
      expect(actual).toEqual(expected);
    });

    it('should return an empty array if there are no entities', function() {
      let actual = store.getAll();

      expect(actual).toBeEmptyArray();
    });
  });

  describe('push()', function() {
    it('should increment the count when an item is added', function() {
      let initialCount = store.getAll().length;
      store.push({ guid: 'pushtest' });
      let pushedCount = store.getAll().length;

      expect(pushedCount).toEqual(initialCount + 1);
    });

    it('should convert any pushed data to immutable types', function() {
      store.push({ guid: 'pushtest' });
      let pushed = store._data.get(0);

      expect(pushed.asImmutable).toBeDefined();
    });
  });

  describe('dataHasChanged()', function() {
    describe('passed regular JS objects', function() {
      it('should return true if new data is different from _data', function() {
        let oldData = { guid: 'pushtest'};
        let newData = { guid: 'pushtestyetagain' };

        store.push(oldData);

        expect(store.dataHasChanged(newData)).toBe(true);
      });

      it('should return false if the data is the same as _data', function() {
        let oldData = { guid: 'pushtest' };
        let newData = Immutable.fromJS([oldData]);

        store.push(oldData);

        expect(store.dataHasChanged(newData)).toBe(false);
      });
    });

    describe('passed ImmutableJS objects', function() {
      it('should return true if new data is different from _data', function() {
        let oldData = { guid: 'pushtest'};
        let newData = { guid: 'pushtestyetagain' };

        store.push(oldData);

        expect(store.dataHasChanged(newData)).toBe(true);
      });
    });
  });

  describe('delete()', function() {
    it('should remove items that match the guid and call .emitChange()', function () {
      var spy = sandbox.spy(store, 'emitChange');
      var guid = 'deleteFakeGuid';
      store._data = Immutable.fromJS([{ guid }]);

      expect(store.getAll().length).toEqual(1);

      store.delete(guid);

      expect(spy).toHaveBeenCalledOnce();
      expect(store.getAll().length).toEqual(0);
    });

    it('should do nothing if the guid does not match', function () {
      var spy = sandbox.spy(store, 'emitChange');
      var guid = 'deleteFakeGuid';
      store._data = Immutable.fromJS([{ guid }]);

      expect(store.getAll().length).toEqual(1);

      store.delete('nonExistentFakeGuid');

      expect(spy).not.toHaveBeenCalledOnce();
      expect(store.getAll().length).toEqual(1);
    });
  });

  describe('fetching', function() {
    it('should initially be false', function() {
      expect(store.fetching).toEqual(false);
    });

    it('should be able to be set to true', function () {
      store.fetching = true;
      expect(store.fetching).toEqual(true);
    });

    it('should cast all values to booleans', function () {
      store.fetching = 'true';
      expect(store.fetching).toEqual(true);

      store.fetching = undefined;
      expect(store.fetching).toEqual(false);
    });

    it('should not emit change', function () {
      var spy = sandbox.spy();

      store.on('CHANGE', spy);
      store.fetching = false;
      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('fetched', function() {
    it('should initially be false', function() {
      expect(store.fetched).toEqual(false);
    });

    it('should be able to be set to true', function () {
      store.fetched = true;
      expect(store.fetched).toEqual(true);
    });

    it('should cast all values to booleans', function () {
      store.fetched = 'true';
      expect(store.fetched).toEqual(true);

      store.fetched = undefined;
      expect(store.fetched).toEqual(false);
    });

    it('should not emit change if the value is the same', function () {
      var spy = sandbox.spy();

      store.on('CHANGE', spy);
      store.fetched = false;
      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('merge()', function() {
    var existingEntityA = {
      guid: 'zznbmbz',
      name: 'ea',
      cpu: 34
    };
    var existingEntityB = {
      guid: 'zzlkcxv',
      name: 'eb'
    };

    beforeEach(function() {
      store.push(existingEntityA);
      store.push(existingEntityB);
    });

    it('should call cb with true when data is updated', function () {
      var updateA = {
        guid: existingEntityA.guid,
        name: 'zzz',
        memory: 1024
      };

      store.merge('guid', updateA, (changed) => {
        expect(changed).toEqual(true);
      });
    });

    it('should call cb with false when no data is updated', function (done) {
      store.merge('guid', existingEntityA, (changed) => {
        expect(changed).toEqual(false);
        done();
      });
    });

    it('should update a single existing entity with the same guid ',
        function(done) {
      var updateA = {
        guid: existingEntityA.guid,
        name: 'zzz',
        memory: 1024
      };

      store.merge('guid', updateA, (changed) => {
        let updated = store.get(updateA.guid);
        expect(updated).toEqual(Object.assign({}, existingEntityA, updateA));
        expect(store.get(existingEntityB.guid)).toEqual(existingEntityB);

        done();
      });
    });

    it('should update a multiple existing entities with the same guids ',
        function() {
      var toUpdateA = {
        guid: existingEntityA.guid,
        name: 'ea',
        memory: 1024
      };
      var toUpdateB = {
        guid: existingEntityB.guid,
        name: 'eb',
        memory: 1024
      };

      store.mergeMany('guid', [toUpdateA, toUpdateB], (changed) => {
        expect(changed).toBeTruthy();

        let updatedA = store.get(toUpdateA.guid);
        expect(updatedA).toEqual(Object.assign({}, existingEntityA, toUpdateA));

        let updatedB = store.get(toUpdateB.guid);
        expect(updatedB).toEqual(Object.assign({}, existingEntityB, toUpdateB));
      });
    });
  });

  describe('mergeAll()', function () {
    var existingEntityA = {
      guid: 'fakeguidone',
      name: 'ea',
      cpu: 34
    };
    var existingEntityB = {
      guid: 'fakeguidtwo',
      name: 'eb'
    };
    var existingEntityC = {
      guid: 'fakeguidthree',
      name: 'eb'
    };

    beforeEach(function() {
      store.push(existingEntityA);
      store.push(existingEntityB);
      store.push(existingEntityC);
    });

    it('should do nothing if there is no match', function () {
      const oldData = Immutable.fromJS(store.getAll());
      const toMerge = {
        guid: 'mergeguid',
        name: 'fakename'
      };

      store.mergeAll('name', toMerge, function(changed) {
        const data = Immutable.fromJS(store.getAll());
        const merged = store.get(toMerge.guid);

        expect(Immutable.is(data, oldData)).toEqual(true);
        expect(merged).toEqual(undefined);
        expect(changed).toEqual(false);
      });
    });

    it('should merge into all matching entities based on the merge key', function () {
      const oldData = Immutable.fromJS(store.getAll());
      const toMerge = {
        name: 'eb',
        green: true
      };

      store.mergeAll('name', toMerge, function(changed) {
        const first = store.get('fakeguidone');
        const second = store.get('fakeguidtwo');
        const third = store.get('fakeguidthree');

        expect(first.green).toEqual(undefined);
        expect(second.green).toEqual(true);
        expect(third.green).toEqual(true);
        expect(changed).toEqual(true);
      });
    });
  });

  describe('setOptions()', function () {
    it('sets the options', function () {
      const entity = {guid: '123'};
      const spy = sandbox.spy();
      store.addChangeListener(spy);
      store.setOptions(entity, {
        removing: true,
        available: false
      });

      const newEntity = store.get(entity.guid);
      expect(newEntity.removing).toEqual(true);
      expect(newEntity.available).toEqual(false);
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
