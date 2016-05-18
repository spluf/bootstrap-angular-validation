"use strict";

/**
 * @ngcode service
 * @name BsValidationService
 * @description Core service of this module to provide various default validations.
 */
angular.module("bootstrap.angular.validation").factory("BsValidationService", function() {
    var messages = {
        required: "This field is required.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        min: "Please enter a value greater than or equal to {{validValue}}.",
        max: "Please enter a value less than or equal to {{validValue}}.",
        length: "Please enter all {{validValue}} characters.",
        minlength: "Please enter at least {{validValue}} characters.",
        maxlength: "Please enter no more than {{validValue}} characters.",
        editable: "Please select a value from dropdown.",
        pattern: "Please fix the pattern.",
        equalTo: "Please enter the same value again."
    };

    var ngIncludedURLs = [];

    var genericValidators = {
        digits: {
            validator: function(value) {
                return (/^\d+$/).test(value);
            }
        },
        equalTo: {
            validator: function(value, $scope, attr) {
                return value === $scope.$eval(attr.equalTo);
            }
        },
        number: {
            validator: function(value) {
                return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(value);
            }
        },
        min: {
            validator: function(value, $scope, attr) {
                return parseFloat(value) >= parseFloat(attr.min);
            }
        },
        max: {
            validator: function(value, $scope, attr) {
                return parseFloat(value) <= parseFloat(attr.max);
            }
        },
        length: {
            validator: function(value, $scope, attr) {
                return value.length === parseInt(attr.length);
            }
        },
        minlength: {
            validator: function(value, $scope, attr) {
                return value.length >= parseInt(attr.minlength);
            }
        },
        maxlength: {
            validator: function(value, $scope, attr) {
                return value.length <= parseInt(attr.maxlength);
            }
        }
    };

    function setValidity(key, value, $scope, attr, ngModelController) {
        var isValid = ngModelController.$isEmpty(value) || genericValidators[key].validator(value, $scope, attr, ngModelController);
        ngModelController.$setValidity(key, isValid);
    }

    var selector = "input[ng-model],select[ng-model],textarea[ng-model]";

    return {
        /**
         * Search all the input element inside the given DOM element and apply the "bs-validation" directive so we
         * need not a add it for every form element.
         * @param $element
         */
        addDirective: function($element) {
            var validateableElements = $element.findAll(selector);
            validateableElements.attr("bs-validation", "");
            return validateableElements;
        },
        addToNgIncludedURLs: function(url) {
            if (ngIncludedURLs.indexOf(url) === -1) {
                ngIncludedURLs.push(url);
            }
        },
        addValidator: function($scope, $attr, ngModelController, validatorKey) {
            var validator = function(value) {
                setValidity(validatorKey, value, $scope, $attr, ngModelController);
                return value;
            };

            ngModelController.$parsers.push(validator);
        },
        checkNgIncludedURL: function(url) {
            var index = ngIncludedURLs.indexOf(url);
            if (index > -1) {
                ngIncludedURLs.splice(index, 1);
                return true;
            }

            return false;
        },
        getDefaultMessage: function(key) {
            return messages[key];
        },
        setValidity: function(key, value, $scope, attr, ctrl) {
            setValidity(key, value, $scope, attr, ctrl);
        }
    };
});