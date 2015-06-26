'use strict';
var P = require('bluebird');
var JSONAPISerializer = require('jsonapi-serializer');

function ResourceFinder(model, params) {
  function find() {
    return new P(function (resolve, reject) {
      model
        .findById(params.recordId)
        .lean()
        .exec(function (err, record) {
          if (err) { return reject(err); }
          resolve(record);
        });
    });
  }

  this.perform = function () {
    return find()
      .then(function (record) {
        return new JSONAPISerializer(model.collection.name, record, {
          id: '_id',
          attributes: Object.keys(model.schema.paths)
        });
      });
  };
}

module.exports = ResourceFinder;
