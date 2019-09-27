/**
 * @fileoverview Lodash to native map
 * @author Anton Tikhonov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/map"),

    RuleTester = require("eslint").RuleTester,

    errors = require('../../../shared/errors');


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });
ruleTester.run("map", rule, {

    valid: [
        "Array.isArray(collection) ? collection.map(function(n) { return n; }) : _.map(collection, function(n) { return n; })",
        "Array.isArray(collection) ? collection.map(n=>n) : _.map(collection, n=>n)",
        "Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)",
        "(Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)).map(fn2)",
        "(Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)).reduce(sum) + 5",
        "(Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)).some(condition) || isReady",
        "isReady ? (Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)) : []",
        "[1, 2, 3].map(fn)",
        "function getCollection() { return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn); }"
    ],

    invalid: [
        {
            code: "_.map(collection, n=>n)",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map(collection, function(n) { return n; })",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map(collection, fn)",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map(collection, fn).map(fn2)",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map(collection, fn).reduce(sum) + 5",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map(collection, fn).some(condition) || isReady",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "isReady ? _.map(collection, fn) : []",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        },
        {
            code: "_.map([1, 2, 3], fn)",
            errors: [{
                message: errors.LODASH_MAP_INSTEADOF_NATIVE_MAP_ON_ARRAYS
            }]
        },
        {
            code: "function getCollection() { return _.map(collection, fn); }",
            errors: [{
                message: errors.NO_CHECK_ON_ARRAY
            }]
        }
    ]
});
