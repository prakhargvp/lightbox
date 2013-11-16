// Generated by CoffeeScript 1.6.3
/*
Lightbox for Bootstrap 3 by @ashleydw
https://github.com/ashleydw/lightbox

License: https://github.com/ashleydw/lightbox/blob/master/LICENSE
*/


(function() {
  "use strict";
  var EkkoLightbox;

  EkkoLightbox = function(element, options) {
    var content, footer, header, youtube;
    this.options = $.extend({
      gallery_parent_selector: '*:not(.row)',
      title: null,
      footer: null,
      remote: null,
      keyboard: true,
      onShow: function() {},
      onShown: function() {},
      onHide: function() {},
      onHidden: function() {
        if (this.gallery) {
          $(document).off('keydown.ekkoLightbox');
        }
        return this.modal.remove();
      },
      id: false
    }, options || {});
    this.$element = $(element);
    content = '';
    this.modal_id = this.options.modal_id ? this.options.modal_id : 'ekkoLightbox-' + Math.floor((Math.random() * 1000) + 1);
    header = '<div class="modal-header"' + (this.options.title ? '' : ' style="display:none"') + '><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div>';
    footer = '<div class="modal-footer"' + (this.options.footer ? '' : ' style="display:none"') + '>' + this.options.footer + '</div>';
    $(document.body).append('<div id="' + this.modal_id + '" class="ekko-lightbox modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content">' + header + '<div class="modal-body"></div>' + footer + '</div></div></div>');
    this.modal = $('#' + this.modal_id);
    this.modal_body = this.modal.find('.modal-body').first();
    this.padding = {
      left: parseFloat(this.modal_body.css('padding-left'), 10),
      right: parseFloat(this.modal_body.css('padding-right'), 10),
      bottom: parseFloat(this.modal_body.css('padding-bottom'), 10),
      top: parseFloat(this.modal_body.css('padding-top'), 10)
    };
    if (!this.options.remote) {
      this.error('No remote target given');
    } else {
      if (this.isImage(this.options.remote)) {
        this.preloadImage(this.options.remote, true);
      } else if (youtube = this.getYoutubeId(this.options.remote)) {
        this.showYoutubeVideo(youtube);
      } else if (this.isSwf(this.options.remote)) {
        console.log('todo');
      }
      this.gallery = this.$element.data('gallery');
      if (this.gallery) {
        if (this.options.gallery_parent_selector === 'document.body' || this.options.gallery_parent_selector === '') {
          this.gallery_items = $(document.body).find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
        } else {
          this.gallery_items = this.$element.parents(this.options.gallery_parent_selector).first().find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
        }
        this.gallery_index = this.gallery_items.index(this.$element);
        $(document).on('keydown.ekkoLightbox', this.navigate.bind(this));
      }
    }
    this.modal.on('show.bs.modal', this.options.onShow.bind(this)).on('shown.bs.modal', this.options.onShown.bind(this)).on('hide.bs.modal', this.options.onHide.bind(this)).on('hidden.bs.modal', this.options.onHidden.bind(this)).modal('show', options);
    return this.modal;
  };

  EkkoLightbox.prototype = {
    isImage: function(str) {
      return str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
    },
    isSwf: function(str) {
      return str.match(/\.(swf)((\?|#).*)?$/i);
    },
    getYoutubeId: function(str) {
      var match;
      match = str.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (match && match[2].length === 11) {
        return match[2];
      } else {
        return false;
      }
    },
    navigate: function(event) {
      var next, src, youtube;
      event = event || window.event;
      if (event.keyCode === 39 || event.keyCode === 37) {
        if (event.keyCode === 39 && this.gallery_index + 1 < this.gallery_items.length) {
          this.gallery_index++;
          this.$element = $(this.gallery_items.get(this.gallery_index));
          src = this.$element.attr('data-source') || this.$element.attr('href');
          this.updateTitleAndFooter();
          if (this.isImage(src)) {
            this.preloadImage(src, true);
          } else if (youtube = this.getYoutubeId(src)) {
            this.showYoutubeVideo(youtube);
          }
          if (this.gallery_index + 1 < this.gallery_items.length) {
            next = $(this.gallery_items.get(this.gallery_index + 1), false);
            src = next.attr('data-source') || next.attr('href');
            if (this.isImage(src)) {
              return this.preloadImage(src, false);
            }
          }
        } else if (event.keyCode === 37 && this.gallery_index > 0) {
          this.gallery_index--;
          this.$element = $(this.gallery_items.get(this.gallery_index));
          this.updateTitleAndFooter();
          src = this.$element.attr('data-source') || this.$element.attr('href');
          if (this.isImage(src)) {
            return this.preloadImage(src, true);
          } else if (youtube = this.getYoutubeId(src)) {
            return this.showYoutubeVideo(youtube);
          }
        }
      }
    },
    updateTitleAndFooter: function() {
      var caption, footer, header, title;
      header = this.modal.find('.modal-dialog .modal-content .modal-header');
      footer = this.modal.find('.modal-dialog .modal-content .modal-footer');
      title = this.$element.data('title') || "";
      caption = this.$element.data('footer') || "";
      if (title) {
        header.css('display', '').find('.modal-title').html(title);
      } else {
        header.css('display', 'none');
      }
      if (caption) {
        footer.css('display', '').html(caption);
      } else {
        footer.css('display', 'none');
      }
      return this;
    },
    showLoading: function() {
      this.modal_body.html('<div class="modal-loading">Loading..</div>');
      return this;
    },
    showYoutubeVideo: function(id) {
      this.resize(560);
      return this.modal_body.html('<iframe width="560" height="315" src="//www.youtube.com/embed/' + id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
    },
    error: function(message) {
      this.modal_body.html(message);
      return this;
    },
    preloadImage: function(src, onLoadShowImage) {
      var img,
        _this = this;
      img = new Image();
      if ((onLoadShowImage == null) || onLoadShowImage === true) {
        img.onload = function() {
          var width;
          width = img.width;
          _this.checkImageDimensions(img);
          _this.modal_body.html(img);
          return _this.resize(width);
        };
        img.onerror = function() {
          return _this.error('Failed to load image: ' + src);
        };
      }
      img.src = src;
      return img;
    },
    close: function() {
      return this.modal.modal('hide');
    },
    resize: function(width) {
      width = width + this.padding.left + this.padding.right;
      this.modal.find('.modal-content').css({
        'width': width
      });
      this.modal.find('.modal-dialog').css({
        'width': width + 20
      });
      return this;
    },
    checkImageDimensions: function(img) {
      var w;
      w = $(window);
      if ((img.width + (this.padding.left + this.padding.right + 20)) > w.width()) {
        img.width = w.width() - (this.padding.left + this.padding.right + 20);
      }
      return this;
    }
  };

  $.fn.ekkoLightbox = function(options) {
    return this.each(function() {
      var $this;
      $this = $(this);
      options = $.extend({
        remote: $this.attr('data-source') || $this.attr('href'),
        gallery_parent_selector: $this.attr('data-parent')
      }, $this.data());
      new EkkoLightbox(this, options);
      return this;
    });
  };

  $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    var $this;
    event.preventDefault();
    $this = $(this);
    return $this.ekkoLightbox({
      remote: $this.attr('data-source') || $this.attr('href'),
      gallery_parent_selector: $this.attr('data-parent')
    }).one('hide', function() {
      return $this.is(':visible') && $this.focus();
    });
  });

}).call(this);
