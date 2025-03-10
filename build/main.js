"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_axios = __toESM(require("axios"));
var import_cheerio = __toESM(require("cheerio"));
var import_htmlParser = require("./htmlParser");
class Pichler extends utils.Adapter {
  scanIntervall = void 0;
  htmlParser = new import_htmlParser.HtmlParser();
  constructor(options = {}) {
    super({
      ...options,
      name: "pichler"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    await this.setObjectNotExistsAsync("ph", {
      type: "state",
      common: {
        name: "PH",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("redox", {
      type: "state",
      common: {
        name: "Redox",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "mV"
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("flow", {
      type: "state",
      common: {
        name: "Flow active",
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("level_ph", {
      type: "state",
      common: {
        name: "level ph",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "%"
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("level_redox", {
      type: "state",
      common: {
        name: "level redox",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "%"
      },
      native: {}
    });
    this.log.debug(`starting adapter with config: ${JSON.stringify(this.config)}`);
    await this.fetchData();
    this.scanIntervall = this.setInterval(() => this.fetchData(), this.config.interval * 1e3);
  }
  async fetchData() {
    this.log.debug("fetching data");
    const $ = await this.getHtml(this.config.host, this.config.port);
    if ($) {
      this.log.debug("parsing data");
      const values = this.htmlParser.parseHtml($);
      await this.setStateAsync("ph", values.ph, true);
      await this.setStateAsync("redox", values.redox, true);
      await this.setStateAsync("flow", values.flow, true);
      await this.setStateAsync("level_ph", values.levelPh, true);
      await this.setStateAsync("level_redox", values.levelRedox, true);
    }
  }
  async getHtml(host, port) {
    const url = `http://${host}:${port}/commandPage?COMMAND=values`;
    try {
      const response = await import_axios.default.get(url);
      if (response.status === 200) {
        const html = response.data;
        return import_cheerio.default.load(html);
      } else {
        this.log.error(`HTTP Request failed with status code ${response.status}`);
      }
    } catch (error) {
      this.log.error(`Error fetching or parsing HTML: ${error}`);
    }
    return null;
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    try {
      this.clearInterval(this.scanIntervall);
      callback();
    } catch (e) {
      callback();
    }
  }
  // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
  // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
  // /**
  //  * Is called if a subscribed object changes
  //  */
  // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
  // 	if (obj) {
  // 		// The object was changed
  // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
  // 	} else {
  // 		// The object was deleted
  // 		this.log.info(`object ${id} deleted`);
  // 	}
  // }
  /**
   * Is called if a subscribed state changes
   */
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
  // /**
  //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
  //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
  //  */
  // private onMessage(obj: ioBroker.Message): void {
  // 	if (typeof obj === "object" && obj.message) {
  // 		if (obj.command === "send") {
  // 			// e.g. send email or pushover or whatever
  // 			this.log.info("send command");
  // 			// Send response in callback if required
  // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
  // 		}
  // 	}
  // }
}
if (require.main !== module) {
  module.exports = (options) => new Pichler(options);
} else {
  (() => new Pichler())();
}
//# sourceMappingURL=main.js.map
