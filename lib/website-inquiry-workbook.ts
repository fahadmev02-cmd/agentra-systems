import { mkdir } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";

export interface WebsiteInquiryRow {
  name: string;
  businessType: string;
  email: string;
  mobileNumber: string;
  requirement: string;
  source: string;
  createdAt: string;
}

const dataDirectory = path.join(process.cwd(), "data");
const workbookPath = path.join(dataDirectory, "website-inquiries.xlsx");
const sheetName = "Website Inquiries";

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

function getWorkbook() {
  try {
    return XLSX.readFile(workbookPath);
  } catch {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([], {
      header: [
        "Name",
        "Business Type",
        "Email",
        "Mobile Number",
        "Requirement",
        "Source",
        "Created At",
      ],
    });
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    return workbook;
  }
}

export async function appendWebsiteInquiry(row: WebsiteInquiryRow) {
  await ensureDataDirectory();

  const workbook = getWorkbook();
  const sheet = workbook.Sheets[sheetName];
  const existingRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
  });

  existingRows.push({
    Name: row.name,
    "Business Type": row.businessType,
    Email: row.email,
    "Mobile Number": row.mobileNumber,
    Requirement: row.requirement,
    Source: row.source,
    "Created At": row.createdAt,
  });

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(existingRows);
  XLSX.writeFile(workbook, workbookPath);
}