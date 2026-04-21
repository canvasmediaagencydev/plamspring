type ExcelCellValue = string | number | boolean | null | undefined;

interface ExcelColumn<T> {
  header: string;
  getValue: (row: T, index: number) => ExcelCellValue;
}

function escapeHtml(value: ExcelCellValue): string {
  const text = value == null ? "" : String(value);
  const excelSafeText = /^[=+\-@]/.test(text) ? `'${text}` : text;

  return excelSafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\r?\n/g, "<br>");
}

function buildExcelHtml<T>(rows: T[], columns: ExcelColumn<T>[], title: string) {
  const headers = columns
    .map((column) => `<th>${escapeHtml(column.header)}</th>`)
    .join("");
  const body = rows
    .map((row, index) => {
      const cells = columns
        .map((column) => `<td>${escapeHtml(column.getValue(row, index))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    table { border-collapse: collapse; }
    th, td { border: 1px solid #d9d9d9; padding: 6px 10px; mso-number-format: "\\@"; vertical-align: top; }
    th { background: #09418c; color: #ffffff; font-weight: 700; }
  </style>
</head>
<body>
  <table>
    <caption>${escapeHtml(title)}</caption>
    <thead><tr>${headers}</tr></thead>
    <tbody>${body}</tbody>
  </table>
</body>
</html>`;
}

export function downloadExcelFile<T>({
  rows,
  columns,
  title,
  filename,
}: {
  rows: T[];
  columns: ExcelColumn<T>[];
  title: string;
  filename: string;
}) {
  const html = buildExcelHtml(rows, columns, title);
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
