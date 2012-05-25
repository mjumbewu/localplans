var Planning = Planning || {};

(function($, P) {

  P.MapView = Backbone.View.extend({
    initialize: function() {
      // Set the map, or get it from the options.
      this.map = this.options.map || new L.Map('map');
      this.feedViews = [];
      this.feedsLayerGroup = new L.LayerGroup();

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.updateMap, this);
      this.collection.bind('remove', this.updateMap, this);
      this.collection.bind('reset', this.updateMap, this);
    },

    updateMap: function() {
      this.feedsLayerGroup.clearLayers();
      this.feedViews = [];

      this.collection.each(function(feed) {
        var items = feed.getItems();
        var view = new P.MapFeedLayerView({collection: items});
        this.feedsLayerGroup.addLayer(view.group);
      }, this);
    },

    render: function() {
      var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

      this.map.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade);

      return this.map;
    }
  });

  P.MapFeedLayerView = Backbone.View.extend({
    initialize: function() {
      // Set the layer group, or get it from the options.
      this.group = this.options.group || new L.LayerGroup('map');
      this.feedItemViews = [];

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.updateLayerGroup, this);
      this.collection.bind('remove', this.updateLayerGroup, this);
      this.collection.bind('reset', this.updateLayerGroup, this);
    },

    updateLayerGroup: function() {
      this.group.clearLayers();
      this.feedItemViews = [];

      this.collection.each(function(feedItem) {
        var view = new P.MapFeedItemLayerView({model: feedItem});
        this.group.addLayer(view.layer);
      }, this);
    },

    render: function() {
      return this.group;
    }
  })

  P.MapFeedItemLayerView = Backbone.View.extend({
    initialize: function() {
      this.layer = this.options.layer || new L.GeoJSON();

      // When the model is changed, update the layer
      this.model.bind('change', this.updateLayer, this);
    },

    updateLayer: function() {
      var geo = this.model.get('geo');
      if (geo) {
        this.layer.addGeoJSON(geo);
      }
    },

    render: function() {
      return this.layer;
    }
  })

})(jQuery, Planning);
