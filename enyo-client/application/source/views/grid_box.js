/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.SalesOrderLineItemHeaders",
    classes: "xv-grid-row",
    components: [
      {classes: "xv-grid-header line-number", content: "#" },
      {classes: "xv-grid-header grid-item", content: "_item".loc()},
      {classes: "xv-grid-header quantity", content: "_quantity".loc()},
      {classes: "xv-grid-header discount", content: "_discount".loc()},
      {classes: "xv-grid-header price", content: "_price".loc()},
      {classes: "xv-grid-header schedule", content: "_schedDate".loc()}
    ]
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemReadOnlyGridRow",
    kind: "XV.ReadOnlyGridRow",
    components: [
      {classes: "xv-grid-column line-number", components: [
        {name: "lineNumber"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {name: "itemNumber"},
        {name: "itemDescription"},
        {name: "siteCode"},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {name: "quantity"},
        {name: "quantityUnit"}
      ]},
      {classes: "xv-grid-column discount", components: [
        {name: "discount"}
      ]},
      {classes: "xv-grid-column price", components: [
        {name: "price"},
        {name: "priceUnit"},
        {name: "extendedPrice"}
      ]},
      {classes: "xv-grid-column schedule", components: [
        {name: "scheduleDate"}
      ]}
    ],
    valueChanged: function () {
      var model = this.getValue(),
        quantity = model.get("quantity"),
        discount = model.get("discount"),
        price = model.get("price"),
        locale = XT.locale;

      if (!model) {
        return;
      }
      this.$.lineNumber.setContent(model.get("lineNumber"));
      this.$.itemNumber.setContent(model.getValue("item.number") || "_required".loc());
      this.$.itemNumber.addRemoveClass("xv-error", !model.getValue("item.number"));
      this.$.itemDescription.setContent(model.getValue("item.description1"));
      this.$.siteCode.setContent(model.getValue("site.code"));

      this.$.quantity.addRemoveClass("xv-error", !quantity);
      quantity = _.isNumber(quantity) ? Globalize.format(quantity, "n" + locale.quantityScale) : "_required".loc();
      this.$.quantity.setContent(quantity);

      this.$.quantityUnit.setContent(model.getValue("quantityUnit.name"));
      discount = _.isNumber(discount) ? Globalize.format(discount, "p" + XT.PERCENT_SCALE) : "";
      this.$.discount.setContent(discount);

      this.$.price.addRemoveClass("xv-error", !_.isNumber(price));
      this.$.price.setContent(Globalize.format(price, "n" + locale.salesPriceScale) || "_required".loc());
      this.$.priceUnit.setContent(model.getValue("priceUnit.name"));
      this.$.extendedPrice.setContent(Globalize.format(model.get("extendedPrice"), "n" + locale.extendedPriceScale));

      this.$.scheduleDate.setContent(Globalize.format(XT.date.applyTimezoneOffset(model.get("scheduleDate"), true), "d"));
    }
  });

  //
  // The implementation of GridRow and GridBox is here in the workspace kind.
  // We could move them to a grid_box.js if we want. It is currently the only
  // implementation of GridRow and GridBox. Once we have a second, we'll probably
  // want to generalize this code and move it to enyo-x.
  //
  var salesOrderGridRow = {
    name: "XV.SalesOrderLineItemGridRow",
    kind: "XV.GridRow",
    components: [
      // each field is grouped with its column header so that the alignment always
      // works out. All but the first column header will be invisible.
      {classes: "xv-grid-column line-number", components: [
        // Using XV.NumberWidget instead of XV.Number here (and elsewhere) because
        // of the pretty rounded corners, even though we have to hide the label with css
        {kind: "XV.NumberWidget", attr: "lineNumber"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {kind: "XV.QuantityWidget", attr: "quantity", name: "quantityWidget"},
        {kind: "XV.UnitCombobox", attr: "quantityUnit", name: "quantityUnitPicker",
          tabStop: false }
      ]},
      {classes: "xv-grid-column discount", components: [
        {kind: "XV.PercentWidget", name: "discount", attr: "discount" }
      ]},
      {classes: "xv-grid-column price", components: [
        {kind: "XV.MoneyWidget", attr:
          {localValue: "price", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.SALES_PRICE_SCALE},
        {kind: "XV.UnitCombobox", attr: "priceUnit", name: "priceUnitPicker",
          tabStop: false},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "extendedPrice", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.EXTENDED_PRICE_SCALE}
      ]},
      {classes: "xv-grid-column schedule", components: [
        {kind: "XV.DateWidget", attr: "scheduleDate"}
      ]},
      {classes: "xv-grid-column grid-actions", components: [
        {components: [
          {kind: "enyo.Button",
            classes: "icon-plus xv-gridbox-button",
            name: "addGridRowButton",
            onkeyup: "addButtonKeyup" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-search xv-gridbox-button",
            name: "expandGridRowButton" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-remove-sign xv-gridbox-button",
            name: "deleteGridRowButton" }
        ]}
      ]}
    ]
  };

  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);
  enyo.kind(salesOrderGridRow);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    associatedWorkspace: "XV.SalesOrderLineWorkspace",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "XV.SalesOrderLineItemHeaders"},
      {kind: "XV.Scroller", name: "mainGroup", horizontal: "hidden", fit: true, components: [
        {kind: "List", name: "aboveGridList", classes: "xv-above-grid-list",
            onSetupItem: "setupRowAbove", ontap: "gridRowTapAbove", components: [
          { kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "aboveGridRow"}
        ]},
        {kind: "XV.SalesOrderLineItemGridRow", name: "editableGridRow", showing: false},
        {kind: "List", name: "belowGridList", classes: "xv-below-grid-list",
            onSetupItem: "setupRowBelow", ontap: "gridRowTapBelow", components: [
          {kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "belowGridRow"}
        ]},
      ]},
      {
        kind: "FittableColumns",
        name: "navigationButtonPanel",
        classes: "xv-groupbox-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
            content: "_new".loc(), classes: "xv-groupbox-button-single"}
        ]
      },
      {kind: "XV.SalesSummaryPanel", name: "summaryPanel"}
    ],

    /**
      Set the current model into Summary Panel.
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.salesOrder || this.value.quote;
      this.$.summaryPanel.setValue(model);
    }
  });

  enyo.kind({
    name: "XV.QuoteLineItemGridBox",
    kind: "XV.SalesOrderLineItemGridBox",
    associatedWorkspace: "XV.QuoteLineWorkspace"
  });

}());
