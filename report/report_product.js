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

async function generateReportProduct(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT p.P_id, p.P_name, p.P_price, p.P_unit, p.P_quantity, p.P_detail, t.T_name, b.B_name
      FROM product p 
      JOIN type t ON p.T_id = t.T_id
      JOIN brand b ON p.B_id = b.B_id
    `);

    const body = [
      ['รหัสสินค้า', 'ชื่อสินค้า', 'ราคา', 'หน่วยนับ', 'จำนวน', 'รายละเอียด', 'ประเภทสินค้า', 'ยี่ห้อสินค้า'],
      ...rows.map(item => [
        item.P_id,
        item.P_name,
        item.P_price,
        item.P_unit,
        item.P_quantity,
        item.P_detail,
        item.T_name,
        item.B_name
      ]),
    ];

    const docDefinition = {
      defaultStyle: {
        font: 'Sarabun',
      },
      content: [
        { text: 'รายงานสินค้า', style: 'header' },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto', 'auto', '*', '*', 'auto'],
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
      res.setHeader('Content-Disposition', 'attachment; filename=report_product.pdf');
      res.send(pdfBuffer);
    });
    pdfDoc.end();

  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสร้างรายงาน');
  }
}

module.exports = { generateReportProduct };
