"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var htmlParser_exports = {};
__export(htmlParser_exports, {
  HtmlParser: () => HtmlParser
});
module.exports = __toCommonJS(htmlParser_exports);
class HtmlParser {
  parseHtml($) {
    return {
      ph: this.parseNumber(this.getRowValue($, "PH")),
      redox: this.parseNumber(this.getRowValue($, "RE")),
      flow: this.getRowValue($, "DF") === "An",
      levelPh: this.parseNumber(this.getRowValue($, "Fs PH")),
      levelRedox: this.parseNumber(this.getRowValue($, "Fs CL"))
    };
  }
  getRowValue($, label) {
    const row = $("tr").filter(
      (_, element) => $(element).find("td").toArray().some(
        (cell) => $(cell).text().replace(/\u00a0/g, " ").trim() === label
      )
    ).first();
    if (row.length === 0) {
      return null;
    }
    const value = row.find("b").first().text().trim();
    return value.length > 0 ? value : null;
  }
  parseNumber(value) {
    if (value === null) {
      return null;
    }
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HtmlParser
});
//# sourceMappingURL=htmlParser.js.map
