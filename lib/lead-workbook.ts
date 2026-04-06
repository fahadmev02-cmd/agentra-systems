import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import { LeadRow } from "@/lib/voice-agent-config";

const dataDirectory = path.join(process.cwd(), "data");
const workbookPath = path.join(dataDirectory, "qualified-leads.xlsx");
const worksheetName = "Leads";

interface WorkbookLeadRow {
  Name: string;
  "Phone number": string;
  "Business type": string;
  Requirement: string;
  Budget: string;
  Summary: string;
}

function toWorkbookLeadRow(lead: LeadRow): WorkbookLeadRow {
  return {
    Name: lead.name,
    "Phone number": lead.phoneNumber,
    "Business type": lead.businessType,
    Requirement: lead.requirement,
    Budget: lead.budget,
    Summary: lead.summary,
  };
}

async function ensureWorkbookDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function appendLeadToWorkbook(lead: LeadRow) {
  await ensureWorkbookDirectory();

  let workbook = XLSX.utils.book_new();
  let rows: WorkbookLeadRow[] = [];

  try {
    const buffer = await readFile(workbookPath);
    workbook = XLSX.read(buffer, { type: "buffer" });
    const existingSheet = workbook.Sheets[worksheetName];
    if (existingSheet) {
      rows = XLSX.utils.sheet_to_json<WorkbookLeadRow>(existingSheet);
    }
  } catch {
    workbook = XLSX.utils.book_new();
  }

  rows.push(toWorkbookLeadRow(lead));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  workbook.Sheets[worksheetName] = worksheet;

  if (!workbook.SheetNames.includes(worksheetName)) {
    workbook.SheetNames.push(worksheetName);
  }

  const output = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  await writeFile(workbookPath, output);

  return workbookPath;
}
