var Planning = Planning || {};

(function($, P) {

  var hubUrl = '/proxy/http://planning-feeds-hub.herokuapp.com/api/feeds/';

  /*
   * Planning.Feed(s)
   * ----------------
   * The feed models get populated from the hub.  Each individual feed has a
   * publisher, description, and url where the planning updates can be found.
   */
  P.Feed = Backbone.Model.extend({
    /*
     * Planning.Feed.getItems
     * ----------------------
     * Get a collection that contains the Planning.FeedItem models based on the
     * feed URL.
     */
    getItems: function(options) {
      var feedItems = new P.FeedItems();
      feedItems.url = '/proxy/' + this.get('source_url');
      feedItems.fetch(options);
      return feedItems;
    }
  });

  P.Feeds = Backbone.Collection.extend({
    url: hubUrl,
    model: P.Feed,

    /*
     * Planning.Feeds.sync
     * -------------------
     * Override Backbone.sync to take into account the pagination of the
     * planning feeds.
     */
    sync: function(method, model, options) {
      var sync = Backbone.Collection.prototype.sync || Backbone.sync,
          self = this;
      options || (options = {});

      // Override the success callback to intercept the paginated results. Save
      // the meta info for future reference.
      var success = options.success;
      options.success = function(resp, status, xhr) {
          self.page = resp.page;
          self.pages = resp.pages;
          self.total = resp.total;
          if (success) success(resp.results, status, xhr);
      }

      // Call the original sync method to do the rest of the work.
      return sync.apply(this, arguments);
    }
  });

  P.FeedItem = Backbone.Model.extend();
  P.FeedItems = Backbone.Collection.extend();

})(jQuery, Planning);
