const knex = require('knex');
const configuration = require('../knexfile.js');
const connection = knex(configuration.development);

const EXPLICIT_CONV_CC_2_PC = { };
const EXPLICIT_CONV_PC_2_CC = Object.entries(EXPLICIT_CONV_CC_2_PC).reduce((p, x) => ({ ...p, [x[1]]: x[0] }), {}); //inverts key/values

const toPascalCase = str => {
  let res = null;
  if (EXPLICIT_CONV_CC_2_PC[str]) {
    res = EXPLICIT_CONV_CC_2_PC[str];
  } else {
    res = str[0].toUpperCase() + str.slice(1);
    res = res.endsWith('Id') ? res.slice(0, res.length - 2) + "ID" : res;
  }
  return res;
};

const toCamelCase = str => {
  let res = null;
  if (EXPLICIT_CONV_PC_2_CC[str] != null) {
    res = EXPLICIT_CONV_PC_2_CC[str];
  } else {
    res = str[0].toLowerCase() + str.slice(1);
    res = res.endsWith('ID') ? res.slice(0, res.length - 2) + "Id" : res;
  }
  return res;
};

const keysToPC = obj => Object.entries(obj).reduce((p, x) => ({ ...p, [toPascalCase(x[0])]: x[1] }), {});

const keysToCC = obj => Object.entries(obj).reduce((p, x) => ({ ...p, [toCamelCase(x[0])]: x[1] }), {});

let tables = {};

/**
* @param {string} tableName -> name of SQL table
* @param {function} where -> filter
* @returns {Promise} a Promise with the selected values
*/
const get = async (tableName, where) => {
  tables[tableName] = tables[tableName] != null ? tables[tableName] : (await connection.select('*').from(tableName)).map(keysToCC);
  return where == null ? tables[tableName] : tables[tableName].filter(where);
};
/**
* @param {string} tableName -> name of SQL table
* @param {object} value -> row/s to insert
* @param {Array} returning -> names of the columns of the inserted rows I want to get back
* @returns {Promise} a Promise with the selected values
*/
const add = async (tableName, values, returning = ['*']) => {
  values = Array.isArray(values) ? values : [values];
  values = values.map(keysToPC);
  returning ? returning = returning.map(toPascalCase) : null;
  let res = await connection.insert(values).returning(returning).into(tableName).catch(log.error);
  res = returning ? res.map(keysToCC) : res;
  tables[tableName] = (await connection.select('*').from(tableName)).map(keysToCC);
  return res;
};
/**
* @param {string} tableName -> name of SQL table
* @param {function} where -> filter
* @returns {Promise} a Promise with the selected values
*/
const del = async (tableName, where) => {
  const res = [];
  !tables[tableName] ? tables[tableName] = (await connection.select('*').from(tableName)).map(keysToCC) : null;
  let toDel = tables[tableName].filter(where);
  toDel.forEach(obj => Object.keys(obj).forEach(k => obj[k] === null ? delete obj[k] : null));
  toDel = toDel.map(keysToPC);
  for (let i = 0; i < toDel.length; i++) {
    res.push(await connection(tableName).whereIn(Object.keys(toDel[i]), [Object.values(toDel[i])]).del());
  }
  tables[tableName] = (await connection.select('*').from(tableName)).map(keysToCC);
  return res;
};
/**
* @param {string} tableName -> name of SQL table
* @param {function} where -> filter
* @param {object} value -> values to edit
* @returns {Promise} a Promise with the selected values
*/
const edit = async (tableName, where, value) => {
  const res = [];
  !tables[tableName] ? tables[tableName] = (await connection.select('*').from(tableName)).map(keysToCC) : null;
  let toUpdt = tables[tableName].filter(where);
  toUpdt.forEach(obj => Object.keys(obj).forEach(k => obj[k] === null ? delete obj[k] : null));
  toUpdt = toUpdt.map(keysToPC);
  value = keysToPC(value)
  for (let i = 0; i < toUpdt.length; i++) {
    res.push(await connection(tableName).whereIn(Object.keys(toUpdt[i]), [Object.values(toUpdt[i])]).update(value));
  }
  tables[tableName] = (await connection.select('*').from(tableName)).map(keysToCC);
  return res;
};

const transaction = () => { throw 'Not implemented yet!' }

//TODO: Get explicit IDS CONV from here
const getSchema = async () => {
  let res = await connection.raw('SELECT * FROM information_schema.columns');
  res = res.rows.reduce((p, x) => {
      p[x.table_catalog] = p[x.table_catalog] || {};
      p[x.table_catalog][x.table_schema] = p[x.table_catalog][x.table_schema] || {};
      p[x.table_catalog][x.table_schema][x.table_name] = p[x.table_catalog][x.table_schema][x.table_name] || [];
      p[x.table_catalog][x.table_schema][x.table_name] = [...p[x.table_catalog][x.table_schema][x.table_name], {
          columnName: x["column_name"],
          ordinalPosition: x["ordinal_position"],
          columnDefault: x["column_default"],
          isNullable: x["is_nullable"],
          dataType: x["data_type"],
          characterMaximumLength: x["character_maximum_length"],
          characterOctetLength: x["character_octet_length"],
          numericPrecision: x["numeric_precision"],
          numericPrecisionRadix: x["numeric_precision_radix"],
          numericScale: x["numeric_scale"],
          datetimePrecision: x["datetime_precision"],
          intervalType: x["interval_type"],
          intervalPrecision: x["interval_precision"],
      }]
      return p;
  }, {});
  return res;
}

const raw = async (sql) => await connection.raw(sql);

module.exports = { get, add, del, edit, transaction, getSchema, raw }