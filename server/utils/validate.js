"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.validateDataTableFilter = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const validator_1 = __importDefault(require("validator"));
const errors_1 = require("../errors");
const fns_1 = require("./fns");
class StringValidator {
    constructor(text, name) {
        this.length = (length, error) => {
            const errorText = error || `${this.name} must have ${length} characters`;
            if (this.str.length !== length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.minLength = (length, error) => {
            const errorText = error ||
                `Minimum ${length} characters are mandatory in ${this.name} ${this.str.length} characters provided`;
            if (this.str.length < length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.maxLength = (length, error) => {
            const errorText = error ||
                `Maximum ${length} characters are allowed in ${this.name} ${this.str.length} characters provided`;
            if (this.str.length > length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.email = (error) => {
            const errorText = error || `${this.name} is not a valid email address`;
            if (!validator_1.default.isEmail(this.str))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.equal = (comparison, errorText) => {
            if (comparison !== this.str)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.notEqual = (comparison, errorText) => {
            if (comparison === this.str)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.url = (error) => {
            return this;
            const isUrl = validator_1.default.isURL(this.str);
            const errorText = error || ` ${this.name} is not a valid URL`;
            if (!isUrl)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.mobileNumber = (error) => {
            return this;
            const isUrl = validator_1.default.isURL(this.str);
            const errorText = error || ` ${this.name} is not a valid URL`;
            if (!isUrl)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.userName = (error) => {
            const errorText = error || "Username must contain both string and number";
            if (!(0, fns_1.isUserName)(this.str))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.oneOf = (values) => {
            const text = this.str;
            const errorText = `Expecting ${this.name} to be one of ${JSON.stringify(values)}`;
            if (!values.includes(text))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.alpha = (error) => {
            const errorText = error || `Only alphabets are allowed in ${this.name}`;
            if (!(0, fns_1.isAlphabet)(this.str))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.alphaNumeric = (error) => {
            const errorText = error || `Only alphabets and numbers are allowed in ${this.name}`;
            if (!(0, fns_1.isAlphaNumeric)(this.str))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.date = (error) => {
            //todo
            return true;
            const errorText = error || `${this.name} is not a valid date`;
            if (!validator_1.default.isDate(this.str, { format: "MM/DD/YYYY", strictMode: true }))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.str = text;
        this.name = name;
    }
}
class NumberValidator {
    constructor(text, name) {
        this.positiveInteger = (error) => {
            if (!/^\d+$/.test(this.num.toString()))
                throw new errors_1.ClientError(`Expecting ${this.name} to be positive integer`);
        };
        this.min = (min, error) => {
            const errorText = error || `${this.name} must be greater than ${min - 1}`;
            const text = Number(this.num);
            if (text < min)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.max = (max, error) => {
            const errorText = error || `${this.name} must be smaller than ${max + 1}`;
            const text = Number(this.num);
            if (text > max)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.length = (length, error) => {
            const errorText = error || `${this.name} length should be ${length}`;
            if (String(this.num).length !== length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.equals = (comparison, errorText) => {
            if (this.num !== comparison)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.notEqual = (comparison, errorText) => {
            if (this.num === comparison)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.oneOf = (values) => {
            const text = this.num;
            const errorText = `Expecting ${this.name} to be one of ${JSON.stringify(values)}`;
            if (!values.includes(text))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.minLength = (length, error) => {
            const errorText = error || `${this.name} should be at least ${length} characters long`;
            if (String(this.num).length < length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.maxLength = (length, error) => {
            const errorText = error || `${this.name} should be at most ${length} characters long`;
            if (String(this.num).length > length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.num = text;
        this.name = name;
    }
}
class ArrayValidator {
    constructor(arr, name) {
        this.length = (length, error) => {
            const errorText = error || `${this.name} length should be ${length}`;
            if (this.arr.length !== length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.minLength = (length, error) => {
            const errorText = error || `${this.name} should be at least ${length}`;
            if (this.arr.length < length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.maxLength = (length, error) => {
            const errorText = error || `${this.name} should be at most ${length}`;
            if (this.arr.length > length)
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.arr = arr;
        this.name = name;
    }
}
class ObjectValidator {
    constructor(obj, name) {
        this.obj = obj;
        this.name = name;
    }
}
class Validator {
    constructor(text, name) {
        this.args = (error) => {
            const array = this.text;
            const errorText = error || `Missing required argument(s) from the ${this.name}`;
            if (!Array.isArray(array))
                throw new errors_1.ClientError(errorText);
            array.forEach((e) => {
                if (typeof e === "undefined")
                    throw new errors_1.ClientError(errorText);
            });
            return this;
        };
        this.required = (error) => {
            const errorText = error || `${this.name} is required`;
            if ((0, is_empty_1.default)(this.text))
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.string = (error) => {
            const type = typeof this.text;
            const errorText = error || `Expecting ${this.name} to be string but received ${type}`;
            if (typeof this.text !== "string")
                throw new errors_1.ClientError(errorText);
            return new StringValidator(this.text, this.name);
        };
        this.number = (error) => {
            const errorText = error || `Expecting ${this.name} to be number but received ${typeof this.text}`;
            const isNumber = /^\d+(\.\d+)?$/.test(this.text.toString());
            if (!isNumber)
                throw new errors_1.ClientError(errorText);
            return new NumberValidator(Number(this.text), this.name);
        };
        this.array = (error) => {
            const type = typeof this.text;
            const errorText = error || `Expecting ${this.name} to be array but received ${type}`;
            if (!Array.isArray(this.text))
                throw new errors_1.ClientError(errorText);
            return new ArrayValidator(this.text, this.name);
        };
        this.object = (error) => {
            const type = typeof this.text;
            const errorText = error || `Expecting ${this.name} to be object but received ${type}`;
            if (typeof this.text !== "object")
                throw new errors_1.ClientError(errorText);
            return new ObjectValidator(this.text, this.name);
        };
        this.boolean = (error) => {
            const type = typeof this.text;
            const errorText = error || `Expecting ${this.name} to be boolean but received ${type}`;
            if (typeof this.text !== "boolean")
                throw new errors_1.ClientError(errorText);
            return this;
        };
        this.text = text;
        this.name = name;
    }
    static validate(text, name) {
        const validation = new Validator(text, name);
        return validation;
    }
}
exports.Validator = Validator;
const OperatorTypes = [
    "contains",
    "equals",
    "startsWith",
    "endsWith",
    "isAnyOf",
    "isEmpty",
    "isNotEmpty",
];
const validateDataTableFilter = (columns, data) => {
    var _a;
    const validate = Validator.validate;
    const { pageIndex, pageSize, sortModel, filterModel, searchFilter } = data;
    validate([pageIndex, pageSize], "body").args();
    if (pageIndex !== 0)
        validate(pageIndex, "Page Index").required().number();
    validate(pageSize, "Page Size").required().number().max(100);
    if (searchFilter && !(0, is_empty_1.default)(searchFilter)) {
        validate(searchFilter, "Search Filter").string();
    }
    if (sortModel && !(0, is_empty_1.default)(sortModel)) {
        validate(sortModel, "Sort Model").array();
        const sorts = sortModel[0];
        const { field, sort } = sorts;
        validate(field, "Sort Field").required().string().oneOf(columns);
        validate(sort, "Sort Order").required().string().oneOf(["asc", "desc"]);
    }
    if (filterModel && !(0, is_empty_1.default)(filterModel)) {
        validate(filterModel, "Filter Model").object();
        const filter = (_a = filterModel === null || filterModel === void 0 ? void 0 : filterModel.items) === null || _a === void 0 ? void 0 : _a[0];
        if (!filter)
            return;
        let { columnField, value, operatorValue } = filter;
        validate(columnField, "Column Field").required().string().oneOf(columns);
        validate(operatorValue, "Operator").required().string().oneOf(OperatorTypes);
        if (value) {
            // validate(value, "Filter Value").string();
        }
    }
};
exports.validateDataTableFilter = validateDataTableFilter;
exports.default = Validator.validate;
