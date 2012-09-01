/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountList",
    kind: "XV.List",
    label: "_accounts".loc(),
    collection: "XM.AccountInfoCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.AccountInfoParameters",
    workspace: "XV.AccountWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "primaryContact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "primaryContact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "primaryContact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "primaryContact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('primaryContact.primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  // ..........................................................
  // ADDRESS
  //

  enyo.kind({
    name: "XV.AddressList",
    kind: "XV.List",
    label: "_addresses".loc(),
    collection: "XM.AddressInfoCollection",
    query: {orderBy: [
      {attribute: 'country'},
      {attribute: 'state'},
      {attribute: 'city'},
      {attribute: 'line1'},
      {attribute: 'id'}
    ]},
    parameterWidget: "XV.AddressInfoParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "XV.ListAttr", attr: "id", formatter: "formatAddress",
          classes: "xv-addresslist-attr", allowHtml: true}
      ]}
    ],
    formatAddress: function (value, view, model) {
      return XM.Address.format(model, true);
    }
  });

  // ..........................................................
  // CONTACT
  //

  var ContactListMixin = {
    formatFirstName: function (value, view, model) {
      var lastName = (model.get('lastName') || "").trim();
      view.addRemoveClass("bold", _.isEmpty(lastName));
      return value;
    },
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  };

  var ContactList = {
    name: "XV.ContactList",
    kind: "XV.List",
    label: "_contacts".loc(),
    collection: "XM.ContactInfoCollection",
    query: {orderBy: [
      {attribute: 'lastName'},
      {attribute: 'firstName'},
      {attribute: 'primaryEmail'},
      {attribute: 'id'}
    ]},
    parameterWidget: "XV.ContactInfoParameters",
    workspace: "XV.ContactWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "firstName",
                  formatter: "formatFirstName"},
                {kind: "XV.ListAttr", attr: "lastName", fit: true, classes: "bold",
                  style: "padding-left: 0px;"}
              ]},
              {kind: "XV.ListAttr", attr: "phone", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "jobTitle",
                placeholder: "_noJobTitle".loc()},
              {kind: "XV.ListAttr", attr: "primaryEmail", ontap: "sendMail",
                classes: "right hyperlink", fit: true}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "address.formatShort"}
          ]}
        ]}
      ]}
    ]
  };
  ContactList = enyo.mixin(ContactList, ContactListMixin);
  enyo.kind(ContactList);
  
  /**
    Specifically for search on contacts in account workspace.
  */
  enyo.kind({
    name: "XV.AccountContactList",
    kind: "XV.ContactList",
    collection: "XM.AccountContactInfoCollection"
  });

  var AccountContactListRelations = {
    name: "XV.AccountContactListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "lastName"},
      {attribute: "firstName"}
    ],
    parentKey: "account",
    workspace: "XV.ContactWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "firstName",
                  formatter: "formatFirstName"},
                {kind: "XV.ListAttr", attr: "lastName", fit: true, classes: "bold",
                  style: "padding-left: 0px;"}
              ]},
              {kind: "XV.ListAttr", attr: "phone", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "jobTitle",
                placeholder: "_noJobTitle".loc()},
              {kind: "XV.ListAttr", attr: "primaryEmail", ontap: "sendMail",
                classes: "right hyperlink", fit: true}
            ]}
          ]}
        ]}
      ]}
    ]
  };
  AccountContactListRelations = enyo.mixin(AccountContactListRelations, ContactListMixin);
  enyo.kind(AccountContactListRelations);

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentList",
    kind: "XV.List",
    label: "_incidents".loc(),
    collection: "XM.IncidentInfoCollection",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'updated', descending: true},
      {attribute: 'id', descending: true}
    ]},
    parameterWidget: "XV.IncidentInfoParameters",
    workspace: "XV.IncidentWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "updated", fit: true, formatter: "formatDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description"}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic"},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "getIncidentStatusString"},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.ListAttr", attr: "category.name",
              placeholder: "_noCategory".loc()}
          ]}
        ]}
      ]}
    ],
    formatDate: function (value, view, model) {
      var isToday = !XT.date.compareDate(value, new Date());
      view.addRemoveClass("bold", isToday);
      return value;
    }
  });

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemList",
    kind: "XV.List",
    label: "_items".loc(),
    collection: "XM.ItemInfoCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.ItemInfoParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "inventoryUnit.name", fit: true,
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description1"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityList",
    kind: "XV.List",
    collection: "XM.OpportunityInfoCollection",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'targetClose'},
      {attribute: 'name'},
      {attribute: 'id'}
    ]},
    label: "_opportunities".loc(),
    parameterWidget: "XV.OpportunityInfoParameters",
    workspace: "XV.OpportunityWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "targetClose", fit: true,
                formatter: "formatTargetClose",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "opportunityStage.name",
              placeholder: "_noStage".loc()},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.ListAttr", attr: "opportunityType.name",
              placeholder: "_noType".loc()}
          ]}
        ]}
      ]}
    ],
    formatTargetClose: function (value, view, model) {
      var isLate = model && model.get('isActive') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    }
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectList",
    kind: "XV.List",
    label: "_projects".loc(),
    collection: "XM.ProjectInfoCollection",
    query: {orderBy: [
      {attribute: 'number' }
    ]},
    parameterWidget: "XV.ProjectInfoParameters",
    workspace: "XV.ProjectWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"},
            {kind: "XV.ListAttr", attr: "account.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "getProjectStatusString",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", style: "width: 80;",
            components: [
            {content: "_budgeted".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"},
            {content: "_actual".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"},
            {content: "_balance".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "budgetedExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "actualExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "balanceExpenses",
              classes: "text-align-right", formatter: "formatExpenses"}
          ]},
          {kind: "XV.ListColumn", classes: "money", fit: true, components: [
            {kind: "XV.ListAttr", attr: "budgetedHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "actualHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "balanceHours",
              classes: "text-align-right", formatter: "formatHours"}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        K = XM.Project,
        isLate = (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(value, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    },
    formatHours: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      return Globalize.format(value, "n" + 2) + " " + "_hrs".loc();
    },
    formatExpenses: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      return Globalize.format(value, "c" + XT.MONEY_SCALE);
    }
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoList",
    kind: "XV.List",
    label: "_toDos".loc(),
    collection: "XM.ToDoInfoCollection",
    parameterWidget: "XV.ToDoInfoParameters",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'dueDate'},
      {attribute: 'name'}
    ]},
    workspace: "XV.ToDoWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name", classes: "bold"},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate", placeholder: "_noDueDate".loc(),
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description",
              placeholder: "_noDescription".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "getToDoStatusString"},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        K = XM.ToDo,
        isLate = (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(value, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    }
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountList",
    kind: "XV.List",
    label: "_userAccounts".loc(),
    collection: "XM.UserAccountInfoCollection",
    query: {orderBy: [
      {attribute: 'username'}
    ]},
    workspace: "XV.UserAccountWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "username", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "propername"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "isActive", formatter: "formatActive"}
          ]}
        ]}
      ]}
    ],
    formatActive: function (value, view, model) {
      return value ? "_active".loc() : "";
    }
  });

  // ..........................................................
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificList",
    kind: "XV.List",
    label: "_honorifics".loc(),
    collection: "XM.HonorificCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    workspace: "XV.HonorificWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "XV.ListColumn", classes: "last", components: [
          {kind: "XV.ListAttr", attr: "code", classes: "bold"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // STATES AND COUNTRIES
  //

  enyo.kind({
    name: "XV.AbbreviationList",
    kind: "XV.List",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "abbreviation", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.StateList",
    kind: "XV.AbbreviationList",
    label: "_states".loc(),
    collection: "XM.StateCollection",
    query: {orderBy: [{ attribute: 'abbreviation' }] },
    workspace: "XV.StateWorkspace"
  });

  enyo.kind({
    name: "XV.CountryList",
    kind: "XV.AbbreviationList",
    label: "_countries".loc(),
    collection: "XM.CountryCollection",
    query: {orderBy: [
      {attribute: 'abbreviation'}
    ]},
    workspace: "XV.CountryWorkspace"
  });

  // ..........................................................
  // INCIDENT CATEGORIES, RESOLUTIONS, SEVERITIES,
  // PRIORITIES,
  // OPPORTUNITY SOURCES, STAGES, TYPES,
  //
  // Basically anything whose rows are name and description
  //

  enyo.kind({
    name: "XV.NameDescriptionList",
    kind: "XV.List",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ],
    /**
     * All of these lists follow a very similar naming convention.
     * Apply that convention unless the list overrides the label
     * or collection attribute.
     */
    create: function () {
      this.inherited(arguments);
      var kindName = this.kind.substring(0, this.kind.length - 4).substring(3);
      if (!this.getLabel()) {
        var label = "_" + kindName.camelize().pluralize();
        this.setLabel(label.loc());
      }
      if (!this.getCollection()) {
        this.setCollection("XM." + kindName + "Collection");
      }
      if (!this.getWorkspace()) {
        this.setWorkspace("XV." + kindName + "Workspace");
      }
    }
  });

  enyo.kind({
    name: "XV.IncidentCategoryList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentResolutionList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentSeverityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.PriorityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.OpportunitySourceList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityStageList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityTypeList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.UserAccountRoleList",
    kind: "XV.NameDescriptionList",
    collection: "XM.UserAccountRoleCollection"
  });
}());
