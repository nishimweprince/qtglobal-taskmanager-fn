import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import logo from '../../assets/qtglobal_logo.png';

export const convertBlobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
};

export const printPDF = async ({ TableInstance, reportName, columns = [] }) => {

  const doc = new jsPDF('landscape');
  const logoResponse = await fetch(logo);
  const logoData = await logoResponse.blob();
  const reader = new FileReader();

  reader.onload = async () => {
    doc.setFontSize(16);
    doc.setFillColor(4, 65, 99);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
    doc.setTextColor(0);
    doc.setFontSize(20);
    doc.setFont('Arial', 'bold');
    doc.setTextColor(255, 255, 255)
    doc.text(`${reportName.toUpperCase()}`, doc.internal.pageSize.getWidth() - 90, 20);
    doc.setTextColor(0);
    doc.setFontSize(10);

    const noValues = Array.from(
      { length: TableInstance.rows.length },
      (_, index) => index + 1
    );

    const exportData = TableInstance.rows.map((row, index) => {
      // eslint-disable-next-line no-unused-vars
      const { id = null, no = null, ID, ...rest } = row.original;
      return {
        no: noValues[index],
        ...rest,
      };
    });

  doc.autoTable({
   startY: 50,
   columns: columns.filter((column) => column.accessor !== 'actions').map((column) => column.Header.toUpperCase()),
   body: exportData.map((row, index) => {
    const rowData = columns.map((header) => {
      return row[header?.accessor || 'NO'];
    })
    return {index, ...rowData};
   }),
   theme: 'grid',
   headStyles: {
    fillColor: [4, 65, 99],
    textColor: 255,
    fontSize: 10,
    halign: 'start',
    cellPadding: 3,
  },
  styles: {
    fontSize: 10, 
    textColor: 0,
    cellPadding: 3,
  },
  });

  doc.setFontSize(12);
  doc.setFont('Arial', 'bold');
    doc.text(
      `Date: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
      15,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`${reportName}.pdf`);
  };

  reader.readAsDataURL(logoData);
};

export const exportToExcel = async ({ TableInstance, reportName, columns = [] }) => {
  const workbook = XLSX.utils.book_new();

  const exportData = TableInstance.rows.map((row, index) => {
    const { id = null, no = null, ID, ...rest } = row.original;
    return {
      no: index + 1,
      ...rest,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Add header row
  XLSX.utils.sheet_add_aoa(worksheet, [columns.filter(column => column.accessor !== 'actions').map(column => column.Header.toUpperCase())], { origin: 'A1' });

  // Add logo image
  const logoResponse = await fetch(logo);
  const logoData = await logoResponse.blob();
  const logoBase64 = await convertBlobToBase64(logoData);
  const logoImage = new Image();
  logoImage.src = logoBase64;
  const logoDataURI = logoImage.src;

  // Add logo to the Excel sheet
  const logoWS = XLSX.utils.sheet_add_aoa(XLSX.utils.aoa_to_sheet([[{ t: 's', s: { patternType: "solid", fgColor: { rgb: "FF000000" } }, v: "" }]]), [[{ t: "s", s: { patternType: "none" }, v: logoDataURI }]], { origin: 'A1' });

  // Add logo dimensions
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 1 } }];

  XLSX.utils.book_append_sheet(workbook, worksheet, reportName);

  const filename = `${reportName}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
