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

async function generateReportDealer(req, res) {
  try {
    const [rows] = await pool.execute('SELECT D_id, D_name, D_address, D_tel FROM dealer');

    const body = [
      ['รหัสตัวแทนจำหน่าย', 'ชื่อตัวแทนจำหน่าย', 'ที่อยู่', 'เบอร์โทร'],
      ...rows.map(item => [item.D_id, item.D_name, item.D_address, item.D_tel]),
    ];

    const docDefinition = {
      defaultStyle: {
        font: 'Sarabun',
      },
      content: [
        { text: 'รายงานตัวแทนจำหน่าย', style: 'header' },
        {
          table: {
            widths: ['auto', '*', '*', 'auto'], // แก้ widths ให้ตรงกับจำนวนคอลัมน์
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
      res.setHeader('Content-Disposition', 'attachment; filename=report_dealer.pdf');
      res.send(pdfBuffer);
    });
    pdfDoc.end();

  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสร้างรายงาน');
  }
}

module.exports = { generateReportDealer };
