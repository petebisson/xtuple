// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT XM */

sc_require('views/record_list');
sc_require('views/tile_view');

var base03 =   "#002b36";
var base02 =   "#073642";
var base01 =   "#586e75";
var base00 =   "#657b83";
var base0 =    "#839496";
var base1 =    "#93a1a1";
var base2 =    "#eee8d5";
var base3 =    "#fdf6e3";
var yellow =   "#b58900";
var orange =   "#cb4b16";
var red =      "#dc322f";
var magenta =  "#d33682";
var violet =   "#6c71c4";
var blue =     "#268bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";

Postbooks.CharacteristicsListView = SC.IListView.extend(
  /** @scope Postbooks.CharacteristicsListView.prototype */{

  isTile: true, // Walk like a duck.

  layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

  rowHeight: Postbooks.HEIGHT_3_ROW,
  hasHorizontalScroller: false,

  /**
    Tile size.
    
    @default Postbooks.TileView.QUARTER_TILE;
  */
  size: null,

  didCreateElement: function(el) {
    arguments.callee.base.apply(this, arguments);
    var style = el.style;
    style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
    style.backgroundPosition = 'left top';
    style.backgroundRepeat = 'repeat';
  },

  willRenderLayers: function(ctx) {
    var content = this.get('content');

    if (content && content.get('length') === 0) {
      var w = ctx.width, h = ctx.height;

      var text = '_noRecords'.loc(),
          status = content? content.get('status') : null;

      if (status && status === SC.Record.BUSY_LOADING) {
        text = "_loading".loc();
      }

      // Clear background.
      ctx.clearRect(0, 0, w, h);

      // Draw view name.
      var K = Postbooks;
      ctx.fillStyle = 'white';
      ctx.font = "11pt "+K.TYPEFACE;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(text, w/2, h/2);
    }
  },
  
  createRenderLayerTree: function() {
    var tree =  SC.Widget.create({

      render: function(context) {
        var bounds = this.get('bounds'),
            width = bounds.width,
            height = bounds.height,
            index = this.get('rowIndex'),
            object = this.get('content'),
            isSelected = this.get('isSelected');
      
        context.fillStyle = 'clear';
        context.fillRect(0, 0, width, height);
      
        context.strokeStyle = 'black';
        context.lineWidth = 1;
      
        if (!this.get('isLast')) {
          context.beginPath();
          context.moveTo(0, height - 0.5);
          context.lineTo(width, height - 0.5);
          context.stroke();
        }
      }
    });

    var query = SC.Query.create({
      conditions: 'isContacts = YES',
      recordType: XM.Characteristic
    });

    var items = SC.RecordArray.create({
      store: XT.store,
      query: query
    });

    XT.dataSource.fetch(XT.store, query);

    var selectwidget = SC.SelectWidget.create({
      layout: { top: 8, left: 11, right: 11, height: 24 },
      theme: 'capsule',
      items: items,
      valueBinding: SC.Binding.from('*content.characteristic', tree).noDelay(),
      itemTitleKey: 'name'
    });
    tree.addSublayer(selectwidget);

    var textfield = SC.TextFieldWidget.create({
      layout: { bottom: 8, left: 12, right: 12, height: 22 }
      // valueBinding: SC.Binding.from('*content.value', tree)
    });
    tree.addSublayer(textfield);

    return tree;
  },

  init: function() {
    arguments.callee.base.apply(this, arguments);
    if (!this.get('size')) this.set('size', Postbooks.TileView.QUARTER_TILE);
  }

});
