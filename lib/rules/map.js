/**
 * @fileoverview Lodash to native map
 * @author Anton Tikhonov
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const errors = require('../../shared/errors');

module.exports = {
    meta: {
        docs: {
            description: "Lodash to native map",
            recommended: false
        },
        fixable: true
    },

    create: function(context) {
        return {
            CallExpression: function(node) {
                const isLodashMap =
                    node.callee &&
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === '_' &&
                    node.callee.property.name === 'map';

                if (!isLodashMap) return;

                const sourceCode = context.getSourceCode();
                const [collection, fn] = node.arguments
                const [collectionText, fnText] = [collection, fn].map(node => sourceCode.getText(node));
                const parentType = node.parent && node.parent.type;
                const isInConditionalExpr = parentType === 'ConditionalExpression';
                const isInLogicalExpr = parentType === 'LogicalExpression';
                const isInBinaryExpr = parentType === 'BinaryExpression';
                const isInMemberExpr = parentType === 'MemberExpression'
                const isArrayExpr = collection && collection.type === 'ArrayExpression';
                let isEnclosed = false;

                if (isInConditionalExpr) {
                    const condNode = node.parent;
                    const {test, consequent} = condNode;
                    const isTestSame =
                        test &&
                        test.callee &&
                        test.callee.object.name === 'Array' &&
                        test.callee.property.name === 'isArray' &&
                        test.arguments[0].name === collection.name;
                    const isConsequentSame =
                        consequent &&
                        consequent.callee &&
                        consequent.callee.object.name === collection.name &&
                        consequent.callee.property.name === 'map' &&
                        consequent.arguments[0].name === fn.name;
                    
                    if (isTestSame && isConsequentSame) return;

                    isEnclosed = true;
                }

                if (isInLogicalExpr || isInBinaryExpr || isInMemberExpr)
                    isEnclosed = true;

                if (isArrayExpr) {
                    return context.report({
                        node: node,
                        message: errors.LODASH_MAP_INSTEADOF_NATIVE_MAP_ON_ARRAYS,
                        fix: function(fixer) {
                            return fixer.replaceText(node, 
                                `${collectionText}.map(${fnText})`
                            );
                        }
                    })
                }

                return context.report({
                    node: node,
                    // type и messageId не работают, пришлось использовать message.
                    // 
                    // 1. Если отправлять messageId, отличный от того, что указан в правиле,
                    // то RuleTester "съест" его и не выдаст ошибку
                    // 2. С type ситуация ровно обратная: если давать ровно тот же type,
                    // что указан в правиле, то RuleTester все равно выдает ошибку
                    //
                    // До конца разобраться не успел :(
                    message: errors.NO_CHECK_ON_ARRAY,
                    fix: function(fixer) {
                        const test = `Array.isArray(${collectionText})`;
                        const consequent = `${collectionText}.map(${fnText})`;
                        const alternate = sourceCode.getText(node);
                        const str = `${test} ? ${consequent} : ${alternate}`;
                        
                        return fixer.replaceText(node,
                            isEnclosed ? `(${str})` : str
                        );
                    }
                });
            }
        };
    }
};
