"use strict";
// export const args = (fiels: any[]) => {
//     fiels.forEach(e => {
//         if (typeof e === "undefined") throw new ClientError("Missing required argument(s) from the body")
//     })
// }
Object.defineProperty(exports, "__esModule", { value: true });
// export const required = (text: any, name: string, error?: string) => {
//     const errorText = error || `${name} is required`
//     if (isEmpty(text)) throw new ClientError(errorText)
// }
// export const string = (text: any, name: string, error?: string) => {
//     const type = typeof text
//     const errorText = error || `Expecting ${name} to be string but received ${type}`
//     if (type !== "string") throw new ClientError(errorText)
// }
// export const number = (text: any, name: string, error?: string) => {
//     const type = typeof text
//     const errorText = error || `Expecting ${name} to be number but received ${type}`
//     if (typeof text !== "number") throw new ClientError(errorText)
// }
// export const array = (text: any, name: string, error?: string) => {
//     const type = typeof text
//     const errorText = error || `Expecting ${name} to be array but received ${type}`
//     if (!Array.isArray(text)) throw new ClientError(errorText)
// }
// export const object = (text: any, name: string, error?: string) => {
//     const type = typeof text
//     const errorText = error || `Expecting ${name} to be object but received ${type}`
//     if (!isObject(text)) throw new ClientError(errorText)
// }
// export const length = (length: number, text: string, name: string, error?: string) => {
//     string(text, "");
//     const errorText = error || `${name} length should be ${length}`
//     if (text.length !== length) throw new ClientError(errorText)
// }
// export const minLength = (length: number, text: string, name: string, error?: string) => {
//     string(text, "");
//     const errorText = error || `${name} length should be more than ${length - 1}`
//     if (text.length < length) throw new ClientError(errorText)
// }
// export const maxLength = (length: number, text: string, name: string, error?: string) => {
//     string(text, "");
//     const errorText = error || `${name} length should be less than ${length + 1}`
//     if (text.length > length) throw new ClientError(errorText)
// }
// export const userName = (text: string, error?: string) => {
//     if (!isUserName(text)) throw new ClientError(error || "Username must contain both string and number");
// }
// export const alpha = (text: string, name: string, error?: string) => {
//     const errorText = error || `Only alphabets are allowed in ${name}`
//     if (!isAlphabet(text)) throw new ClientError(errorText)
// }
// export const alphaNumeric = (text: string, name: string, error?: string) => {
//     const errorText = error || `Only alphabets and numbers are allowed in ${name}`;
//     if (!isAlphaNumeric(text)) throw new ClientError(errorText)
// }
// export const email = (text: string, name: string, error?: string) => {
//     const errorText = error || `${name} is not a valid email address`;
//     if (!validator.isEmail(text)) throw new ClientError(errorText)
// }
// export const equals = (text: string, comparison: string, errorText: string) => {
//     if (!validator.equals(text, comparison)) throw new ClientError(errorText);
// }
// export const mobileNumber = (text: string, error?: string) => {
//     const errorText = error || "Mobile Number is not valid";
//     if (!validator.isMobilePhone(text, "en-IN")) throw new ClientError(errorText)
// }
