select private.create_model(

-- Model name, schema, table

'country', 'public', 'country',

-- Columns

E'{
  "country.country_id as id",
  "country.country_abbr as abbreviation",
  "country.country_name as name",
  "country.country_curr_name as currency_name",
  "country.country_curr_symbol as currency_symbol",
  "country.country_curr_abbr as currency_abbreviation",
  "country.country_curr_number as currency_number",
  "btrim(array(
    select state_id
    from public.state
    where state_country_id = country.country_id )::text,\'{}\') as states"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.country
  do instead

insert into public.country (
  country_id,
  country_abbr,
  country_name,
  country_curr_name,
  country_curr_symbol,
  country_curr_abbr,
  country_curr_number )
values (
  new.id,
  new.abbreviation,
  new.name,
  new.currency_name,
  new.currency_symbol,
  new.currency_abbreviation,
  new.currency_number );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.country
  do instead

update public.country set
  country_abbr = new.abbreviation,
  country_name = new.name,
  country_curr_name = new.currency_name,
  country_curr_symbol = new.currency_symbol,
  country_curr_abbr = new.currency_abbreviation,
  country_curr_number = new.currency_number
where ( country_id = old.id );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.country
  do instead 
  
delete from public.country
where ( country_id = old.id );

"}', 

-- Conditions, Comment, System

'{}', 'Country Model', true);
