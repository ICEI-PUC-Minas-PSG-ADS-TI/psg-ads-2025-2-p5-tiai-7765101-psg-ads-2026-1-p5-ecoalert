"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhone = parsePhone;
function parsePhone(phone) {
    const clean = phone.replace(/\D/g, "");
    const ddd = clean.slice(0, 2);
    const number = clean.slice(2);
    return {
        ddd,
        number
    };
}
