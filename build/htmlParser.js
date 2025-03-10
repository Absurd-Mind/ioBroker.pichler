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
      ph: parseFloat($("table").eq(8).find("td").eq(4).find("b").text().trim()),
      redox: parseInt($("table").eq(10).find("td").eq(4).find("b").text().trim()),
      flow: $("table").eq(12).find("td").eq(4).find("b").text().trim() == "An",
      levelPh: parseFloat($("table").eq(18).find("td").eq(4).find("b").text().trim()),
      levelRedox: parseFloat($("table").eq(20).find("td").eq(4).find("b").text().trim())
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HtmlParser
});
//# sourceMappingURL=htmlParser.js.map
