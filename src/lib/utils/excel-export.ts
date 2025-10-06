/* eslint-disable @typescript-eslint/no-unused-vars */
import * as XLSX from "xlsx";
import { BranchManagerSyncFilterResponse } from "@/lib/api/client";

export function exportSyncJobsToExcel(
  data: BranchManagerSyncFilterResponse,
  filename: string = "sync-jobs-export"
) {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  // Define column headers
  const headers = [
    "S.No",
    "Job ID",
    "Employee Name",
    "Employee ID",
    "Order Code",
    "Amount",
    "Status",
    "Shift Name",
    "Phone",
    "Number of Photos",
    "Created At",
    "Updated At",
  ];

  // Add title row
  XLSX.utils.sheet_add_aoa(worksheet, [["SYNC JOBS EXPORT REPORT"]], {
    origin: "A1",
  });

  // Add export date
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[`Exported on: ${new Date().toLocaleString()}`]],
    { origin: "A2" }
  );

  // Add empty row
  XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A4" });

  // Add headers
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A5" });

  // Add data rows
  const jobsData = data.sync_jobs.map((job, index) => [
    index + 1,
    job.id,
    job.employeeName,
    job.employee_id || "N/A",
    job.orderprefixcode,
    parseFloat(job.pay_amount), // Keep as number for proper formatting
    job.status,
    job.shift_name,
    job.orderphone,
    job.number_of_photos,
    new Date(job.created_at),
    new Date(job.updated_at),
  ]);

  XLSX.utils.sheet_add_aoa(worksheet, jobsData, { origin: "A6" });

  // Add empty row before summary
  const summaryStartRow = 6 + jobsData.length + 1;
  XLSX.utils.sheet_add_aoa(worksheet, [[""]], {
    origin: `A${summaryStartRow}`,
  });

  // Add summary section
  const summaryData = [
    ["SUMMARY REPORT", "", "", "", "", "", "", "", "", "", "", ""],
    [
      "Total Jobs:",
      data.sync_jobs.length,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "Total Photos:",
      data.statistics.total_photos,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "Total Money:",
      data.statistics.total_money,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "Average per Job:",
      parseFloat(
        (data.statistics.total_money / data.sync_jobs.length).toFixed(2)
      ),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "Average Photos per Job:",
      Math.round(data.statistics.total_photos / data.sync_jobs.length),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
  ];

  XLSX.utils.sheet_add_aoa(worksheet, summaryData, {
    origin: `A${summaryStartRow + 1}`,
  });

  // Set column widths for better appearance
  const columnWidths = [
    { wch: 8 }, // S.No
    { wch: 10 }, // Job ID
    { wch: 25 }, // Employee Name
    { wch: 15 }, // Employee ID
    { wch: 15 }, // Order Code
    { wch: 15 }, // Amount
    { wch: 12 }, // Status
    { wch: 18 }, // Shift Name
    { wch: 18 }, // Phone
    { wch: 18 }, // Number of Photos
    { wch: 22 }, // Created At
    { wch: 22 }, // Updated At
  ];
  worksheet["!cols"] = columnWidths;

  // Define ranges for styling
  const titleRange = XLSX.utils.decode_range("A1:L1");
  const dateRange = XLSX.utils.decode_range("A2:L2");
  const headerRange = XLSX.utils.decode_range(`A5:L5`);
  const dataRange = XLSX.utils.decode_range(`A6:L${5 + jobsData.length}`);
  const summaryRange = XLSX.utils.decode_range(
    `A${summaryStartRow + 1}:L${summaryStartRow + 6}`
  );

  // Apply styles
  if (!worksheet["!merges"]) worksheet["!merges"] = [];

  // Merge title cells
  worksheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } });
  worksheet["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 11 } });

  // Set cell styles
  const style = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "2E86AB" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4A90E2" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const dataStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  const summaryStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "F0F8FF" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Apply title style
  for (let col = titleRange.s.c; col <= titleRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = style;
  }

  // Apply date style
  for (let col = dateRange.s.c; col <= dateRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = { ...style, font: { ...style.font, bold: false } };
  }

  // Apply header style
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = headerStyle;
  }

  // Apply data style with alternating row colors
  for (let row = dataRange.s.r; row <= dataRange.e.r; row++) {
    const isEvenRow = (row - dataRange.s.r) % 2 === 0;
    const rowStyle = {
      ...dataStyle,
      fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F8F9FA" } },
    };

    for (let col = dataRange.s.c; col <= dataRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
      worksheet[cellRef].s = rowStyle;
    }
  }

  // Apply summary style
  for (let row = summaryRange.s.r; row <= summaryRange.e.r; row++) {
    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
      worksheet[cellRef].s = summaryStyle;
    }
  }

  // Set number formats
  const amountCol = 5; // F column (Amount)
  const photosCol = 9; // J column (Number of Photos)

  for (let row = dataRange.s.r; row <= dataRange.e.r; row++) {
    const amountCell = XLSX.utils.encode_cell({ r: row, c: amountCol });
    if (worksheet[amountCell]) {
      worksheet[amountCell].z = "#,##0.00";
    }
  }

  // Set date formats
  const createdCol = 10; // K column (Created At)
  const updatedCol = 11; // L column (Updated At)

  for (let row = dataRange.s.r; row <= dataRange.e.r; row++) {
    const createdCell = XLSX.utils.encode_cell({ r: row, c: createdCol });
    const updatedCell = XLSX.utils.encode_cell({ r: row, c: updatedCol });

    if (worksheet[createdCell]) {
      worksheet[createdCell].z = "mm/dd/yyyy hh:mm:ss AM/PM";
    }
    if (worksheet[updatedCell]) {
      worksheet[updatedCell].z = "mm/dd/yyyy hh:mm:ss AM/PM";
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sync Jobs Report");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = `Sync Jobs Report - ${timestamp}.xlsx`;

  // Save the file
  XLSX.writeFile(workbook, finalFilename);
}

export function exportPhoneNumbersToExcel(
  phoneNumbers: string[],
  filename: string = "phone-numbers-export"
) {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  // Define column headers
  const headers = ["#", "Phone Number"];

  // Add title row
  XLSX.utils.sheet_add_aoa(worksheet, [["PHONE NUMBERS EXPORT REPORT"]], {
    origin: "A1",
  });

  // Add export date
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[`Exported on: ${new Date().toLocaleString()}`]],
    { origin: "A2" }
  );

  // Add empty row
  XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A4" });

  // Add headers
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A5" });

  // Add data rows
  const phoneNumbersData = phoneNumbers.map((phoneNumber, index) => [
    index + 1,
    phoneNumber,
  ]);

  XLSX.utils.sheet_add_aoa(worksheet, phoneNumbersData, { origin: "A6" });

  // Add empty row before summary
  const summaryStartRow = 6 + phoneNumbersData.length + 1;
  XLSX.utils.sheet_add_aoa(worksheet, [[""]], {
    origin: `A${summaryStartRow}`,
  });

  // Add summary section
  const summaryData = [
    ["SUMMARY REPORT", ""],
    ["Total Phone Numbers:", phoneNumbers.length],
  ];

  XLSX.utils.sheet_add_aoa(worksheet, summaryData, {
    origin: `A${summaryStartRow + 1}`,
  });

  // Set column widths for better appearance
  const columnWidths = [
    { wch: 10 }, // #
    { wch: 20 }, // Phone Number
  ];
  worksheet["!cols"] = columnWidths;

  // Define ranges for styling
  const titleRange = XLSX.utils.decode_range("A1:B1");
  const dateRange = XLSX.utils.decode_range("A2:B2");
  const headerRange = XLSX.utils.decode_range(`A5:B5`);
  const dataRange = XLSX.utils.decode_range(
    `A6:B${5 + phoneNumbersData.length}`
  );
  const summaryRange = XLSX.utils.decode_range(
    `A${summaryStartRow + 1}:B${summaryStartRow + 2}`
  );

  // Apply styles
  if (!worksheet["!merges"]) worksheet["!merges"] = [];

  // Merge title cells
  worksheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  worksheet["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 1 } });

  // Set cell styles
  const style = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "2E86AB" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4A90E2" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const dataStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  const summaryStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "F0F8FF" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Apply title style
  for (let col = titleRange.s.c; col <= titleRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = style;
  }

  // Apply date style
  for (let col = dateRange.s.c; col <= dateRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = { ...style, font: { ...style.font, bold: false } };
  }

  // Apply header style
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
    worksheet[cellRef].s = headerStyle;
  }

  // Apply data style with alternating row colors
  for (let row = dataRange.s.r; row <= dataRange.e.r; row++) {
    const isEvenRow = (row - dataRange.s.r) % 2 === 0;
    const rowStyle = {
      ...dataStyle,
      fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F8F9FA" } },
    };

    for (let col = dataRange.s.c; col <= dataRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
      worksheet[cellRef].s = rowStyle;
    }
  }

  // Apply summary style
  for (let row = summaryRange.s.r; row <= summaryRange.e.r; row++) {
    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
      worksheet[cellRef].s = summaryStyle;
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Phone Numbers Report");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = `Phone Numbers Report - ${timestamp}.xlsx`;

  // Save the file
  XLSX.writeFile(workbook, finalFilename);
}
