var Planning = Planning || {};

(function($, P) {

  P.MapView = Backbone.View.extend({
    initialize: function() {
      // Set the map, or get it from the options.
      this.map = this.options.map || new L.Map('map');
      this.feedViews = [];
      this.feedsLayerGroup = new L.LayerGroup();
      this.map.addLayer(this.feedsLayerGroup);

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.updateMap, this);
      this.collection.bind('remove', this.updateMap, this);
      this.collection.bind('reset', this.updateMap, this);
    },

    updateMap: function() {
      console.debug('updating the map');

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

      this.map.setView(new L.LatLng(2, 101), 6).addLayer(cloudmade);

      return this.map;
    }
  });

  P.MapFeedLayerView = Backbone.View.extend({
    initialize: function() {
      // Set the layer group, or get it from the options.
      this.group = this.options.group || new L.LayerGroup();
      this.feedItemViews = [];

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.updateLayerGroup, this);
      this.collection.bind('remove', this.updateLayerGroup, this);
      this.collection.bind('reset', this.updateLayerGroup, this);
    },

    updateLayerGroup: function() {
      console.debug('updating the layer group for feed: ', this.collection);

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
      this.layer.on('featureparse', this.styleLayer, this);
      this.layer.on('featureparse', this.setPopupContent, this);

      this.updateLayer();
    },

    styleLayer: function(e) {
      if (e.properties && e.layer.setStyle){
        // The setStyle method isn't available for Points. More on that below ...
        var style = e.properties.style || {
          "color": "#ff4070",
          "weight": 4,
          "opacity": 0.9
        };
        e.layer.setStyle(style);
      }
    },

    setPopupContent: function(e) {
      if (e.properties){
        var content = e.properties.popupContent || ('<p><b>' + this.model.get('title') + '</b><br/><i>by ' + this.model.get('author') + '</i></p>');
        e.layer.bindPopup(content);
      }
    },

    updateLayer: function() {
      console.debug('updating the layer for feed item: ', this.model);

      var geo = this.model.get('geo');
      if (geo) {
        this.layer.addGeoJSON(geo);
        console.log(this.layer)
      }
    },

    render: function() {
      return this.layer;
    }
  })

})(jQuery, Planning);
