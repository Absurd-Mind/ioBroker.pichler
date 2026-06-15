import { CheerioAPI } from "cheerio";

export class HtmlParser {
	public parseHtml($: CheerioAPI): {
		ph: number | null;
		redox: number | null;
		flow: boolean;
		levelPh: number | null;
		levelRedox: number | null;
	} {
		return {
			ph: this.parseNumber(this.getRowValue($, "PH")),
			redox: this.parseNumber(this.getRowValue($, "RE")),
			flow: this.getRowValue($, "DF") === "An",
			levelPh: this.parseNumber(this.getRowValue($, "Fs PH")),
			levelRedox: this.parseNumber(this.getRowValue($, "Fs CL")),
		};
	}

	private getRowValue($: CheerioAPI, label: string): string | null {
		const row = $("tr")
			.filter((_, element) =>
				$(element)
					.find("td")
					.toArray()
					.some(
						(cell) =>
							$(cell)
								.text()
								.replace(/\u00a0/g, " ")
								.trim() === label,
					),
			)
			.first();

		if (row.length === 0) {
			return null;
		}

		const value = row.find("b").first().text().trim();
		return value.length > 0 ? value : null;
	}

	private parseNumber(value: string | null): number | null {
		if (value === null) {
			return null;
		}

		const parsed = Number.parseFloat(value);
		return Number.isNaN(parsed) ? null : parsed;
	}
}
