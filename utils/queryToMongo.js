/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
const validOperators = [
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'all',
  'exists',
  'eqa',
  'sw',
  'swin',
  'isw',
  'iswin',
  'co',
  'coin',
  'ico',
  'icoin',
  're',
  'rein',
  'ire',
  'irein',
  'search',
];

function isMultiValOp(paramOp) {
  return /in/.test(paramOp) || paramOp === 'all' || paramOp === 'eqa';
}

function regEscape(pattern) {
  if (pattern !== undefined) {
    return pattern.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
  }
  return '';
}

const defaultAutoDetectTypes = [
  { fieldPattern: /^is/, dataType: 'bool' },
  { fieldPattern: /_date$/, dataType: 'date' },
  { valuePattern: /^[0-9]+$/, dataType: 'int' },
  { valuePattern: /^[0-9]*\.[0-9]+$/, dataType: 'float' },
  { valuePattern: /^(true|false|yes|no)$/i, dataType: 'bool' },
  { valuePattern: /^[0-9][0-9-: ]+$/, dataType: 'date' },
];

const defaultDataTypeConverters = {
  string(str) {
    return str;
  },
  int(str) {
    const i = parseInt(str, 10);
    return isNaN(i) ? undefined : i;
  },
  float(str) {
    const i = parseFloat(str);
    return isNaN(i) ? undefined : i;
  },
  date(str) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? undefined : d;
  },
  bool(str) {
    // no, false, 0 => false. Others, (including '', eg, for checkboxes) is considered true.
    return !/^n|^f/i.test(str) || str === '0';
  },
};

/*
 * The factory function that we export: this will be used to construct one
 * or more query processor functions based on the options passed in.
 */
exports.queryToMongo = function (opts) {
  if (!opts) opts = {};

  // user specified patterns take precedence, so add them before the default
  const autoDetectTypes = opts.autoDetect ? opts.autoDetect : [];
  for (let i = 0; i < defaultAutoDetectTypes.length; i++) {
    autoDetectTypes.push(defaultAutoDetectTypes[i]);
  }

  const dataTypeConverters = defaultDataTypeConverters;
  if (opts.converters) {
    for (const type in opts.converters) {
      // this will overwrite any default data-type specs.
      dataTypeConverters[type] = opts.converters[type];
    }
  }

  /*
   * The actual function that does all the work: this is what is returned
   * when the factory method (the exported one) is called.
   */
  return function processQuery(params, fields, validate) {
    if (!fields) fields = {};
    const errors = [];
    const filter = {};

    for (const paramSpec in params) {
      /*
       * The parameters are like name__op=value, where __op is optional.
       * name__op is the paramSpec. We ignore any paramSpec starting with __,
       * these have special meaning, and are not a filter parameter.
       */
      if (paramSpec.substr(0, 2) === '__') continue;

      const paramParts = paramSpec.split('__');
      const paramName = paramParts[0];
      let paramOp;

      /*
       * Determine and validate the operator, or default to eq
       */
      if (paramParts.length > 1) {
        // We have an explicitly specified operator with the parameter
        paramOp = paramParts[1];
        if (validOperators.indexOf(paramOp) === -1) {
          errors.push(`Invalid operator: ${paramOp}`);
          paramOp = 'eq';
        }
      } else {
        paramOp = 'eq';
      }

      /*
       * Split a single value into an array of values if the operator is a multi-valued one.
       * Also convert a single value to an array so that we can deal with it consistently,
       * while further processing each value.
       */
      let paramValues = params[paramSpec];
      if (!Array.isArray(paramValues)) {
        if (isMultiValOp(paramOp)) {
          // Split the paramValue on a comma, eg, country__in=US,UK
          paramValues = paramValues.split(',');
        } else {
          // make it an array with one element
          paramValues = [paramValues];
        }
      }

      /*
       * Find the data type of the parameter/field. If we have to validate
       */
      let dataType = 'string';
      if (fields[paramName]) {
        if (fields[paramName].dataType) {
          dataType = fields[paramName].dataType;
        }
      } else {
        if (validate) {
          errors.push(`Missing field spec: ${paramName}`);
        }
        if (paramOp === 'exists') {
          dataType = 'bool';
        } else {
          for (let i = 0; i < autoDetectTypes.length; i++) {
            const ad = autoDetectTypes[i];
            if (
              (ad.valuePattern && ad.valuePattern.test(paramValues[0]))
              || (ad.fieldPattern && ad.fieldPattern.test(paramName))
            ) {
              dataType = ad.dataType;
              break;
            }
          }
        }
      }

      /*
       * Data type conversions
       */
      const converter = dataTypeConverters[dataType];
      try {
        paramValues = paramValues.map(converter);
      } catch (e) {
        paramValues = [undefined];
      }
      if (paramValues.some((v) => v === undefined)) {
        errors.push(`Error converting to ${dataType}: ${params[paramSpec]}`);
      }

      /*
       * Param operator to mongo operator conversion:
       * 1. re/sw/co become eq after converting the RHS to a regexp
       * 2. eqa becomes eq - no conversion required, the 'a' is only to
       *    force a comma split of the value and keep it as an array.
       * Others just prefix a $ to paramOp.
       */
      let $op = '$eq';
      var reOptions = paramOp[0] === 'i' ? 'i' : '';

      if (/re/.test(paramOp)) {
        // convert paramValues to regex: simple
        paramValues = paramValues.map((v) => RegExp(v, reOptions));
        $op = paramOp === 'rein' ? '$in' : '$eq';
      } else if (/sw/.test(paramOp)) {
        // convert paramValues to regex with a ^, escape regex special chars
        paramValues = paramValues.map((v) => RegExp(`^${regEscape(v)}`, reOptions));
        $op = /in/.test(paramOp) ? '$in' : '$eq';
      } else if (/co/.test(paramOp)) {
        // convert paramValues to regex, escape regex special chars
        paramValues = paramValues.map((v) => RegExp(regEscape(v), reOptions));
        $op = /in/.test(paramOp) ? '$in' : '$eq';
      } else if (paramOp === 'eqa') {
        $op = '$eq';
      } else {
        $op = `$${paramOp}`;
      }

      /*
       * Form the filter, the operator tells us how to deal with the paramValues.
       *
       * If it contains more than one element, we keep it as an array. Or,
       * if the operator is a multi-val operator, then too, we keep it as an array, even if
       * it contains only one element. Otherwise, we use the only element as the value.
       *
       * $eq is treated specially since the RHS has to be the value. For all other
       * operators, we need the operator specified explicitly.
       */
      const value = paramValues.length > 1 || isMultiValOp(paramOp)
        ? paramValues
        : paramValues[0];

      if ($op === '$eq') {
        filter[paramName] = value;
      } else if ($op === '$search') {
        filter.$text = {};
        filter.$text[$op] = value;
      } else {
        filter[paramName] = filter[paramName] || {}; // same field may already be there
        filter[paramName][$op] = value;
      }
    }

    /*
     * Required filter params validation
     */
    let fieldName;
    for (fieldName in fields) {
      if (fields[fieldName].required) {
        if (filter[fieldName] === undefined) {
          errors.push('Missing required filter on field: ', fieldName);
        }
      }
    }

    /*
     * Other non-filter parameters processing: sort, skip and limit
     */
    let limit = 0;
    let skip = 0;
    let offset = 0;
    if (params.__limit) {
      limit = parseInt(params.__limit, 10);
    }
    if (params.__offset) {
      offset = parseInt(params.__offset, 10);
    }
    if (params.__skip) {
      skip = parseInt(params.__skip, 10);
    }

    const sort = {};
    if (!params.__sort) params.__sort = '-createAt';
    const sortSpecs = typeof params.__sort === 'string'
      ? params.__sort.split(',')
      : params.__sort;
    sortSpecs.forEach((s) => {
      let direction = 1;
      let sortField = s;
      if (s.substr(0, 1) === '-') {
        // eg -age
        sortField = s.substr(1);
        direction = -1;
      }
      if (validate && !fields[sortField]) {
        errors.push(`Invalid sort field: ${sortField}`);
      }
      sort[sortField] = direction;
    });

    if (errors.length > 0) throw errors;
    return {
      filter,
      sort,
      limit,
      skip: skip * offset,
    };
  };
};
