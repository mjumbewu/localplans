var Planning = Planning || {};

(function($, P) {

  /*
   * Planning.FeedsMapView
   * ---------------------
   * A view that will show Planning.FeedItemsLayerGroupView on a map.  In this
   * case, the map is what gets updated when feeds are added or removed from
   * the collection.
   */
  P.FeedsMapView = Backbone.View.extend({
    initialize: function() {
      // Set the map, or get it from the options.
      this.map = this.options.map || new L.Map('map');

      // Create a layer group where the feed geometry layers will live. This is
      // so that, when the feeds are reset, we can just clear this layer group
      this.feedsLayerGroup = new L.LayerGroup();
      this.map.addLayer(this.feedsLayerGroup);

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.resetFeedsLayer, this);
      this.collection.bind('remove', this.resetFeedsLayer, this);
      this.collection.bind('reset', this.resetFeedsLayer, this);
    },

    resetFeedsLayer: function() {
      console.debug('updating the map');

      this.feedsLayerGroup.clearLayers();

      // Fetch the collection of feed items for each feed, and create a layer
      // group for the set of items.
      this.collection.each(function(feed) {
        var items = feed.getItems();
        var view = new P.FeedItemsLayerGroupView({collection: items});
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

  /*
   * Planning.FeedItemsLayerGroupView
   * --------------------------------
   * A view that updates a layer group with layers for each of the feed items
   * in the collection.
   */
  P.FeedItemsLayerGroupView = Backbone.View.extend({
    initialize: function() {
      // Set the layer group, or get it from the options.
      this.group = this.options.group || new L.LayerGroup();

      this.render();

      // When our collection is changed, update the map
      this.collection.bind('add', this.updateLayerGroup, this);
      this.collection.bind('remove', this.updateLayerGroup, this);
      this.collection.bind('reset', this.updateLayerGroup, this);
    },

    updateLayerGroup: function() {
      console.debug('updating the layer group for feed: ', this.collection);

      this.group.clearLayers();

      this.collection.each(function(feedItem) {
        var view = new P.FeedItemLayerView({model: feedItem});
        this.group.addLayer(view.layer);
      }, this);
    },

    render: function() {
      return this.group;
    }
  })

  /*
   * Planning.FeedItemLayerView
   * --------------------------
   * A view that updates a layer with features based on the 'geo' attribute in
   * its model.
   */
  P.FeedItemLayerView = Backbone.View.extend({
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
