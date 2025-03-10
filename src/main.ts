/*
 * Created with @iobroker/create-adapter v2.6.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { HtmlParser } from "./htmlParser";

// Load your modules here, e.g.:
// import * as fs from "fs";

class Pichler extends utils.Adapter {
	scanIntervall: ioBroker.Interval | undefined = undefined;
	htmlParser = new HtmlParser();

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "pichler",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		await this.setObjectNotExistsAsync("ph", {
			type: "state",
			common: {
				name: "PH",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("redox", {
			type: "state",
			common: {
				name: "Redox",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "mV",
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("flow", {
			type: "state",
			common: {
				name: "Flow active",
				type: "boolean",
				role: "indicator",
				read: true,
				write: false,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("level_ph", {
			type: "state",
			common: {
				name: "level ph",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "%",
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("level_redox", {
			type: "state",
			common: {
				name: "level redox",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "%",
			},
			native: {},
		});

		this.log.debug(`starting adapter with config: ${JSON.stringify(this.config)}`);

		await this.fetchData();

		this.scanIntervall = this.setInterval(() => this.fetchData(), this.config.interval * 1000);
	}

	private async fetchData(): Promise<void> {
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

	private async getHtml(host: string, port: number): Promise<CheerioAPI | null> {
		const url = `http://${host}:${port}/commandPage?COMMAND=values`;
		try {
			const response = await axios.get(url);

			if (response.status === 200) {
				const html = response.data;
				return cheerio.load(html);
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
	private onUnload(callback: () => void): void {
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
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
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
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Pichler(options);
} else {
	// otherwise start the instance directly
	(() => new Pichler())();
}
