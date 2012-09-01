/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // BASE CLASS
  //

  enyo.kind({
    name: "XV.OrderedReferenceWorkspace",
    kind: "XV.Workspace",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.NumberWidget", attr: "order"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountContactsBox",
    kind: "XV.Groupbox",
    title: "_contacts".loc(),
    classes: "panel",
    published: {
      attr: null,
      value: null
    },
    events: {
      onSearch: "",
      onWorkspace: ""
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged"
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contacts".loc()},
      {kind: "XV.AccountContactListRelations", name: "list",
        attr: "contactRelations", fit: true},
      {kind: 'FittableColumns', classes: "xv-groupbox-buttons", components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newContact",
          content: "_new".loc(), classes: "xv-groupbox-button-left",
          disabled: true},
        {kind: "onyx.Button", name: "attachButton", onclick: "attachContact",
          content: "_attach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "detachButton", onclick: "detachContact",
          content: "_detach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "openButton", onclick: "openContact",
          content: "_open".loc(), classes: "xv-groupbox-button-right",
          disabled: true, fit: true}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(!XM.Contact.canCreate());
      this.$.attachButton.setDisabled(!XM.Contact.canUpdate());
    },
    attachContact: function () {
      var list = this.$.list,
        accountId = list.getParent().id,

        // Callback to handle selection...
        callback = function (contactInfo) {

          // Instantiate the models involved
          var contact = new XM.Contact({id: contactInfo.id}),
            contactAccountInfo = new XM.ContactAccountInfo({id: accountId}),
            setAndSave = function () {
              var K = XM.Model,
                options = {};
              if (contact.getStatus() === K.READY_CLEAN &&
                  contactAccountInfo.getStatus() === K.READY_CLEAN) {
                contact.off('statusChange', setAndSave);
                contactAccountInfo.off('statusChange', setAndSave);

                // Callback to update our list with changes when save complete
                options.success = function () {
                  list._collection.add(contactInfo);
                  list.setCount(list._collection.length);
                  list.refresh();
                };

                // Set and save our contact with the new account relation
                contact.set('account', contactAccountInfo);
                contact.save(null, options);
              }
            };

          // When fetch complete, trigger set and save
          contact.on('statusChange', setAndSave);
          contactAccountInfo.on('statusChange', setAndSave);

          // Go get the data
          contact.fetch();
          contactAccountInfo.fetch();
        };

      this.doSearch({list: "XV.ContactList", callback: callback});
    },
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    detachContact: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        contactInfo = list.getModel(index),
        contact = new XM.Contact({id: contactInfo.id}),
        setAndSave = function () {
          var K = XM.Model,
            options = {};
          if (contact.getStatus() === K.READY_CLEAN) {
            contact.off('statusChange', setAndSave);

            // Callback to update our list with changes when save complete
            options.success = function () {
              list._collection.remove(contactInfo);
              list.setCount(list._collection.length);
              list.refresh();
            };

            // Set and save our contact without account relation
            contact.set('account', null);
            contact.save(null, options);
          }
        };

      // When fetch complete, trigger set and save
      contact.on('statusChange', setAndSave);

      // Go get the data
      contact.fetch();
    },
    newContact: function () {
      var list = this.$.list,
        account = this.$.list.getParent(),
        id = account ? account.id : null,
        attributes = {account: id},
        callback = function (model) {
          var Model = list._collection.model,
            value = new Model({id: model.id}),
            options = {};
          options.success = function () {
            list._collection.add(value);
            list.setCount(list._collection.length);
            list.refresh();
          };
          value.fetch(options);
        },
        inEvent = {
          originator: this,
          workspace: "XV.ContactWorkspace",
          attributes: attributes,
          callback: callback
        };
      this.doWorkspace(inEvent);
    },
    openContact: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index),
        id = model.id,
        callback = function () {
          var options = {};
          options.success = function () {
            list.refresh();
          };
          // Refresh
          model.fetch(options);
        },
        inEvent = {
          workspace: "XV.ContactWorkspace",
          id: id,
          callback: callback
        };

      this.doWorkspace(inEvent);
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        couldNotRead = model ? !model.couldRead() : true,
        couldNotUpdate = model ? !model.couldUpdate() : true;
      this.$.detachButton.setDisabled(couldNotUpdate);
      this.$.openButton.setDisabled(couldNotRead);
    },
    valueChanged: function () {
      this.$.list.setValue(this.value);
    }
  });

  enyo.kind({
    name: "XV.AccountWorkspace",
    kind: "XV.Workspace",
    title: "_account".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Account",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.AccountTypePicker", attr: "accountType"},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "onyx.GroupboxHeader", content: "_primaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "primaryContact",
              list: "XV.AccountContactList", showAddress: true},
            {kind: "onyx.GroupboxHeader", content: "_secondaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "secondaryContact",
              list: "XV.AccountContactList", showAddress: true}
          ]}
        ]},
        {kind: "XV.AccountContactsBox", attr: "contactRelations"},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.AccountCommentBox", attr: "comments"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactWorkspace",
    kind: "XV.Workspace",
    title: "_contact".loc(),
    model: "XM.Contact",
    headerAttrs: ["firstName", "lastName"],
    handlers: {
      onError: "errorNotify"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "onyx.GroupboxHeader", content: "_name".loc()},
            {kind: "XV.InputWidget", attr: "honorific"},
            {kind: "XV.InputWidget", attr: "firstName"},
            {kind: "XV.InputWidget", attr: "middleName"},
            {kind: "XV.InputWidget", attr: "lastName"},
            {kind: "XV.InputWidget", attr: "suffix"},
            {kind: "onyx.GroupboxHeader", content: "_address".loc()},
            {kind: "XV.AddressWidget", attr: "address"},
            {kind: "onyx.GroupboxHeader", content: "_information".loc()},
            {kind: "XV.InputWidget", attr: "jobTitle"},
            {kind: "XV.InputWidget", attr: "primaryEmail"},
            {kind: "XV.InputWidget", attr: "phone"},
            {kind: "XV.InputWidget", attr: "alternate"},
            {kind: "XV.InputWidget", attr: "fax"},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.UserAccountWidget", attr: "owner"}
          ]}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ContactCommentBox", attr: "comments"}
        ]}
      ]},
      {kind: "onyx.Popup", name: "multipleAddressPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_addressShared".loc() + " " + "_whatToDo".loc()},
        {tag: "br"},
        {kind: "onyx.Button", content: "_changeOne".loc(), ontap: "addressChangeOne", classes: "onyx-blue"},
        {kind: "onyx.Button", content: "_changeAll".loc(), ontap: "addressChangeAll" },
        {kind: "onyx.Button", content: "_cancel".loc(), ontap: "addressCancel"}
      ]}
    ],
    addressChangeAll: function () {
      var options = {address: XM.Address.CHANGE_ALL};
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
      this.save(options);
    },
    addressChangeOne: function () {
      var options = {address: XM.Address.CHANGE_ONE};
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
      this.save(options);
    },
    addressCancel: function () {
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
    },
    errorNotify: function (inSender, inEvent) {
      // Handle address questions
      if (inEvent.error.code === 'xt2007') {
        this._popupDone = false;
        this.$.multipleAddressPopup.show();
        return true;
      }
    },
    popupHidden: function () {
      if (!this._popupDone) {
        this.$.multipleAddressPopup.show();
      }
    }
  });

  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.CountryWorkspace",
    kind: "XV.Workspace",
    title: "_country".loc(),
    model: "XM.Country",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "abbreviation"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "currencyName"},
          {kind: "XV.InputWidget", attr: "currencySymbol"},
          {kind: "XV.InputWidget", attr: "currencyAbbreviation"},
          {kind: "XV.InputWidget", attr: "currencyNumber"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificWorkspace",
    kind: "XV.Workspace",
    title: "_honorific".loc(),
    model: "XM.Honorific",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "code"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentWorkspace",
    kind: "XV.Workspace",
    title: "_incident".loc(),
    headerAttrs: ["number", "-", "description"],
    model: "XM.Incident",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "XV.IncidentCategoryPicker", attr: "category"},
            {kind: "onyx.GroupboxHeader", content: "_status".loc()},
            {kind: "XV.IncidentStatusPicker", attr: "status"},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "XV.IncidentSeverityPicker", attr: "severity"},
            {kind: "XV.IncidentResolutionPicker", attr: "resolution"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.ItemWidget", attr: "item"}
          ]}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.IncidentCommentBox", attr: "comments"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentCategory".loc(),
    model: "XM.IncidentCategory"
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentResolution".loc(),
    model: "XM.IncidentResolution"
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentSeverityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentSeverity".loc(),
    model: "XM.IncidentSeverity"
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityWorkspace",
    kind: "XV.Workspace",
    title: "_opportunity".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Opportunity",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "XV.MoneyWidget", attr: "amount"},
            {kind: "XV.PercentWidget", attr: "probability"},
            {kind: "onyx.GroupboxHeader", content: "_status".loc()},
            {kind: "XV.OpportunityStagePicker", attr: "opportunityStage",
              label: "_stage".loc()},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "XV.OpportunityTypePicker", attr: "opportunityType",
              label: "_type".loc()},
            {kind: "XV.OpportunitySourcePicker", attr: "opportunitySource",
              label: "_source".loc()},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "targetClose"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "actualClose"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"}
          ]}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.OpportunityCommentBox", attr: "comments"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //

  enyo.kind({
    name: "XV.OpportunitySourceWorkspace",
    kind: "XV.Workspace",
    title: "_opportunitySource".loc(),
    model: "XM.OpportunitySource"
  });

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStageWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityStage".loc(),
    model: "XM.OpportunityStage"
  });

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypeWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityType".loc(),
    model: "XM.OpportunityType"
  });

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_priority".loc(),
    model: "XM.Priority"
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectWorkspace",
    kind: "XV.Workspace",
    title: "_project".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Project",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.ProjectStatusPicker", attr: "status"},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "completeDate"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"}
          ]}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ProjectCommentBox", attr: "comments"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_tasks".loc(), components: [
          {kind: "XV.ProjectTaskRepeaterBox", attr: "tasks"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // STATE
  //

  enyo.kind({
    name: "XV.StateWorkspace",
    kind: "XV.Workspace",
    title: "_state".loc(),
    model: "XM.State",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "abbreviation"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.CountryPicker", attr: "country"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoWorkspace",
    kind: "XV.Workspace",
    title: "_toDo".loc(),
    headerAttrs: ["name"],
    model: "XM.ToDo",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "completeDate"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"}
          ]}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), classes: "panel",
          components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ToDoCommentBox", attr: "comments"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWorkspace",
    kind: "XV.Workspace",
    title: "_userAccount".loc(),
    model: "XM.UserAccount",
    handlers: {
      onRefreshPrivileges: "refreshPrivileges"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.UserAccountRoleAssignmentBox", attr: "grantedUserAccountRoles"},
        {kind: "XV.UserAccountPrivilegeAssignmentBox", attr: "grantedPrivileges", name: "grantedPrivileges" },
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "username"},
          {kind: "XV.InputWidget", attr: "properName"},
          {kind: "XV.InputWidget", attr: "initials"},
          {kind: "XV.InputWidget", attr: "email"},
          {kind: "XV.CheckboxWidget", attr: "isActive"}
        ]}
      ]}
    ],
    refreshPrivileges: function (inSender, inEvent) {
      this.$.grantedPrivileges.mapIds();
      this.$.grantedPrivileges.tryToRender();
    }
  });

  // ..........................................................
  // USER ACCOUNT ROLE
  //

  enyo.kind({
    name: "XV.UserAccountRoleWorkspace",
    kind: "XV.Workspace",
    title: "_userAccountRole".loc(),
    model: "XM.UserAccountRole",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"}
        ]},
        {kind: "XV.UserAccountRolePrivilegeAssignmentBox", attr: "grantedPrivileges"}
      ]}
    ]
  });

}());
