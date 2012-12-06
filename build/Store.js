// Generated by CoffeeScript 1.4.0
var PRIVATE_COLLECTION, storePlugin;

PRIVATE_COLLECTION = require('./constants').PRIVATE_COLLECTION;

storePlugin = module.exports = function(racer) {
  return racer.mixin({
    type: "Store",
    events: {
      init: function(store) {
        store.serverRequest = {
          _handlers: {},
          register: function(type, cb) {
            return this._handlers[type] = cb;
          }
        };
      },
      middleware: function(store, middleware, createMiddleware) {
        middleware.fetchServerRequest = createMiddleware();
        middleware.fetchServerRequest.add(function(req, res, next) {
          var handler, ns, target;
          target = req.target;
          ns = target.ns;
          if (!(handler = store.serverRequest._handlers[ns])) {
            return console.error("Could not find handler for `" + ns + "` request");
          }
          handler.apply({
            session: req.session,
            done: function(data) {
              res.send([[PRIVATE_COLLECTION + ns, data]]);
              next();
            }
          }, target.arg);
        });
      }
    },
    decorate: function(Store) {
      Store.dataDescriptor({
        name: 'ServerRequest',
        normalize: function(x) {
          return x;
        },
        isInstance: function(x) {
          return x;
        }
      });
    }
  });
};

storePlugin.decorate = "racer";

storePlugin.useWith = {
  server: true,
  browser: false
};
