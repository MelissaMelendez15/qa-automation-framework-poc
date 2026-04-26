import fs from "fs";
import path from "path";

export function readSummary() {
    const summaryPath = path.join(
        process.cwd(),
        "..",
        "results", 
        "processed", 
        "summary.json"
    );

    const file = fs.readFileSync(summaryPath, "utf-8");
    return JSON.parse(file);
}