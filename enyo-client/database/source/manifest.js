{
  "name": "_application_",
  "databaseScripts": [
    "drop_deprecated.sql",
    "xt/trigger_functions/comment_did_change.sql",
    "xt/trigger_functions/owner_record_did_change.sql",
    "xt/trigger_functions/taxtype_record_did_change.sql",
    "xt/trigger_functions/usr_did_change.sql",
    "xt/trigger_functions/usrpref_did_change.sql",
    "public/functions/geteffectivextuser.sql",
    "public/tables/cohead.sql",
    "public/tables/comment.sql",
    "public/tables/cntct.sql",
    "public/tables/coitem.sql",
    "public/tables/cohist.sql",
    "public/tables/crmacct.sql",
    "public/tables/custinfo.sql",
    "public/tables/docass.sql",
    "public/tables/grppriv.sql",
    "public/tables/incdt.sql",
    "public/tables/itemsite.sql",
    "public/tables/metric.sql",
    "public/tables/poitem.sql",
    "public/tables/prj.sql",
    "public/tables/prjtask.sql",
    "public/tables/ophead.sql",
    "public/tables/quitem.sql",
    "public/tables/todoitem.sql",
    "public/tables/usrpref.sql",
    "public/tables/usrpriv.sql",
    "xt/functions/add_priv.sql",
    "xt/functions/average_cost.sql",
    "xt/functions/change_password.sql",
    "xt/functions/check_password.sql",
    "xt/functions/co_allocated_credit.sql",
    "xt/functions/co_line_at_shipping.sql",
    "xt/functions/co_line_base_price.sql",
    "xt/functions/co_line_customer_discount.sql",
    "xt/functions/co_line_markup.sql",
    "xt/functions/co_line_extended_price.sql",
    "xt/functions/co_line_margin.sql",
    "xt/functions/co_line_profit.sql",
    "xt/functions/co_line_list_price.sql",
    "xt/functions/co_line_list_price_discount.sql",
    "xt/functions/co_line_ship_balance.sql",
    "xt/functions/co_line_tax.sql",
    "xt/functions/co_freight_weight.sql",
    "xt/functions/co_schedule_date.sql",
    "xt/functions/co_subtotal.sql",
    "xt/functions/co_tax_total.sql",
    "xt/functions/co_total.sql",
    "xt/functions/co_total_cost.sql",
    "xt/functions/co_margin.sql",
    "xt/functions/cntctmerge.sql",
    "xt/functions/cntctrestore.sql",
    "xt/functions/createuser.sql",
    "xt/functions/install_guiscript.sql",
    "xt/functions/insert_client.sql",
    "xt/functions/mergecrmaccts.sql",
    "xt/functions/pg_advisory_unlock.sql",
    "xt/functions/quote_line_base_price.sql",
    "xt/functions/quote_line_customer_discount.sql",
    "xt/functions/quote_line_markup.sql",
    "xt/functions/quote_line_extended_price.sql",
    "xt/functions/quote_line_margin.sql",
    "xt/functions/quote_line_profit.sql",
    "xt/functions/quote_line_list_price.sql",
    "xt/functions/quote_line_list_price_discount.sql",
    "xt/functions/quote_line_tax.sql",
    "xt/functions/quote_freight_weight.sql",
    "xt/functions/quote_schedule_date.sql",
    "xt/functions/quote_subtotal.sql",
    "xt/functions/quote_tax_total.sql",
    "xt/functions/quote_total.sql",
    "xt/functions/quote_total_cost.sql",
    "xt/functions/quote_margin.sql",
    "xt/functions/register_extension.sql",
    "xt/functions/register_extension_dependency.sql",
    "xt/functions/set_dictionary_strings.sql",
    "xt/functions/trylock.sql",
    "xt/functions/undomerge.sql",
    "xt/tables/dict.sql",
    "xt/tables/dictentry.sql",
    "xt/tables/emlprofile.sql",
    "xt/tables/filter.sql",
    "xt/tables/incdtemlprofile.sql",
    "xt/tables/incdtcatemlprofile.sql",
    "xt/tables/pkgcmd.sql",
    "xt/tables/pkgcmdarg.sql",
    "xt/tables/pkgimage.sql",
    "xt/tables/pkgmetasql.sql",
    "xt/tables/pkgpriv.sql",
    "xt/tables/pkgreport.sql",
    "xt/tables/pkgscript.sql",
    "xt/tables/pkguiform.sql",
    "xt/tables/ext.sql",
    "xt/tables/extdep.sql",
    "xt/tables/grpext.sql",
    "xt/tables/ordtype.sql",
    "xt/tables/usrext.sql",
    "xt/tables/userpref.sql",
    "xt/tables/usrchart.sql",
    "xt/tables/recover.sql",
    "xt/tables/sessionstore.sql",
    "xt/tables/oa2client.sql",
    "xt/tables/oa2clientredirs.sql",
    "xt/tables/oa2token.sql",
    "xt/tables/bicache.sql",
    "xt/tables/clientcode.sql",
    "xt/javascript/init.sql",
    "xt/views/cohistinfo.sql",
    "xt/views/doc.sql",
    "xt/views/cntctinfo.sql",
    "xt/views/coheadinfo.sql",
    "xt/views/coiteminfo.sql",
    "xt/views/crmacctaddr.sql",
    "xt/views/crmacctcomment.sql",
    "xt/views/customer_prospect.sql",
    "xt/views/cust_doc.sql",
    "xt/views/incdtinfo.sql",
    "xt/views/incdtxt.sql",
    "xt/views/iteminfo.sql",
    "xt/views/itemsiteinfo.sql",
    "xt/views/opheadinfo.sql",
    "xt/views/orderheadinfo.sql",
    "xt/views/orderiteminfo.sql",
    "xt/views/prjinfo.sql",
    "xt/views/quheadinfo.sql",
    "xt/views/quiteminfo.sql",
    "xt/views/site.sql",
    "xt/views/todoiteminfo.sql",
    "xt/views/usrinfo.sql",
    "xt/tables/usrlite.sql",
    "xm/javascript/account.sql",
    "xm/javascript/address.sql",
    "xm/javascript/contact.sql",
    "xm/javascript/credit_card.sql",
    "xm/javascript/crm.sql",
    "xm/javascript/customer.sql",
    "xm/javascript/database_information.sql",
    "xm/javascript/user_preference.sql",
    "xm/javascript/incident.sql",
    "xm/javascript/item.sql",
    "xm/javascript/item_site.sql",
    "xm/javascript/project.sql",
    "xm/javascript/quote.sql",
    "xm/javascript/sales.sql",
    "xm/javascript/sales_rep.sql",
    "xm/javascript/system.sql",
    "xm/javascript/tax.sql",
    "xm/javascript/to_do.sql",
    "public/tables/comment_trigger.sql",
    "public/tables/pkghead.sql",
    "public/tables/schemaord.sql",
    "update_version.sql"
  ]
}
