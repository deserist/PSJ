!function(){function i(t){this.options=n.extend({},i.defaults,t),this.container=this.options.element,"auto"!==this.options.container&&(this.container=this.options.container),this.$container=n(this.container),this.$more=n(this.options.more),this.$more.length&&(this.setupHandler(),this.waypoint=new s(this.options))}var n=window.jQuery,s=window.Waypoint;i.prototype.setupHandler=function(){this.options.handler=n.proxy(function(){this.options.onBeforePageLoad(),this.destroy(),this.$container.addClass(this.options.loadingClass),n.post(n(this.options.more).attr("href"),n.proxy(function(t){var i=(t=n(n.parseHTML(t))).find(this.options.more),o=t.find(this.options.items);o.length||(o=t.filter(this.options.items)),this.$container.append(o),this.$container.removeClass(this.options.loadingClass),(i=i.length?i:t.filter(this.options.more)).length?(this.$more.replaceWith(i),this.$more=i,this.waypoint=new s(this.options)):this.$more.remove(),this.options.onAfterPageLoad(o)},this))},this)},i.prototype.destroy=function(){this.waypoint&&this.waypoint.destroy()},i.defaults={container:"auto",items:".infinite-item",more:".infinite-more-link",offset:"bottom-in-view",loadingClass:"infinite-loading",onBeforePageLoad:n.noop,onAfterPageLoad:n.noop},s.Infinite=i}();