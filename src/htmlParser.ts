import { CheerioAPI } from "cheerio";

export class HtmlParser {
	public parseHtml($: CheerioAPI): { ph: number; redox: number; flow: boolean; levelPh: number; levelRedox: number } {
		return {
			ph: parseFloat($("table").eq(8).find("td").eq(4).find("b").text().trim()),
			redox: parseInt($("table").eq(10).find("td").eq(4).find("b").text().trim()),
			flow: $("table").eq(12).find("td").eq(4).find("b").text().trim() == "An",
			levelPh: parseFloat($("table").eq(18).find("td").eq(4).find("b").text().trim()),
			levelRedox: parseFloat($("table").eq(20).find("td").eq(4).find("b").text().trim()),
		};
	}
}
