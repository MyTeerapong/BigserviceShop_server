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

async function generateReportEmployee(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT Em_id, Em_name, Em_gender, Em_address, Em_tel, Em_date, Em_username, Em_password, Em_status 
      FROM employee
    `);

    const body = [
      ['รหัสพนักงาน', 'ชื่อพนักงาน', 'เพศ', 'ที่อยู่', 'เบอร์โทร', 'วันที่เข้าทำงาน', 'ชื่อผู้ใช้', 'รหัสผ่าน', 'สถานะ'],
      ...rows.map(item => [
        item.Em_id,
        item.Em_name,
        item.Em_gender,
        item.Em_address,
        item.Em_tel,
        item.Em_date,
        item.Em_username,
        item.Em_password,
        item.Em_status,
      ]),
    ];

    const docDefinition = {
      defaultStyle: {
        font: 'Sarabun',
      },
      content: [
        { text: 'รายงานข้อมูลพนักงาน', style: 'header' },
        {
          table: {
            widths: ['auto', '*', 'auto', '*', 'auto', 'auto', '*', '*', 'auto'],
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
      res.setHeader('Content-Disposition', 'attachment; filename=report_employee.pdf');
      res.send(pdfBuffer);
    });
    pdfDoc.end();

  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสร้างรายงาน');
  }
}

module.exports = { generateReportEmployee };
