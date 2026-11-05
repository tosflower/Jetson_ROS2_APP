"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPositiveHex = toPositiveHex;
const assert_1 = __importDefault(require("assert"));
// a hexString is considered negative if its most significant bit is 1
// because serial numbers use ones' complement notation
// this RFC in section 4.1.2.2 requires serial numbers to be positive
// http://www.ietf.org/rfc/rfc5280.txt
function toPositiveHex(hexString) {
    const mostSignificantHex = hexString[0];
    (0, assert_1.default)(mostSignificantHex !== undefined);
    let mostSignificantHexAsInt = parseInt(mostSignificantHex, 16);
    if (mostSignificantHexAsInt < 8) {
        return hexString;
    }
    mostSignificantHexAsInt -= 8;
    return mostSignificantHexAsInt.toString(16) + hexString.substring(1);
}
//# sourceMappingURL=utils.js.map