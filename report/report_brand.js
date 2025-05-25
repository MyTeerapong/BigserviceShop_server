const mysql = require('mysql2/promise');
const PdfPrinter = require('pdfmake');
const fonts = {
  Sarabun: {
    normal: './fonts/Sarabun-Regular.ttf',
    bold: './fonts/Sarabun-Bold.ttf',
    italics: './fonts/Sarabun-Italic.ttf',
    bolditalics: './fonts/Sarabun-BoldItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bigserviceshop_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function generateReportType(req, res) {
  try {
    const [rows] = await pool.execute('SELECT B_id, B_name FROM brand');

    const body = [
      ['รหัสยี่ห้อสินค้า', 'ชื่อยี่ห้อสินค้า'],
      ...rows.map(item => [item.B_id, item.B_name]),
    ];

 const docDefinition = {
  defaultStyle: {
    font: 'Sarabun',
  },
  content: [
    { text: 'รายงานยี่ห้อสินค้า', style: 'header' },
    {
      table: {
        widths: ['auto', '*'],
        body,
      },
    },
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
  },
};


    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=report_brand.pdf');
      res.send(pdfBuffer);
    });
    pdfDoc.end();

  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสร้างรายงาน');
  }
}

module.exports = { generateReportType };
