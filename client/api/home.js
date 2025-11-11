export default function handler(req, res) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trang chu</title>
    </head>
    <body>
      <h1>Chao mung den voi trang chu cua travfruit</h1>
      <p>Day la trang chinh cua website.</p>
      <a href="/about">Đi den trang About</a>
    </body>
    </html>
  `;
}
