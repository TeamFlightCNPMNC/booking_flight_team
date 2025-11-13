const { chromium, firefox, webkit, BrowserType } = require("playwright");

// Tạo hàm kiểm tra trình duyệt khả dụng
async function getValidBrowser() {
  const browsers = [
    { name: "Chromium", instance: chromium },
    { name: "Firefox", instance: firefox },
    { name: "WebKit", instance: webkit },
    {
      name: "Microsoft Edge",
      instance: chromium,
      options: {
        executablePath:
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      },
    }, // Đường dẫn tới Edge
    {
      name: "Cốc Cốc",
      instance: chromium,
      options: {
        executablePath: "C:\\Program Files\\CocCoc\\Browser\\browser.exe",
      },
    }, // Đường dẫn tới Cốc Cốc
  ];

  for (const browser of browsers) {
    try {
      const browserInstance = await browser.instance.launch({
        headless: true,
        args: ["--disable-extensions"],
        ...browser.options, // Sử dụng tùy chọn nếu có
      });
      console.log(`Sử dụng trình duyệt: ${browser.name}`);
      return browserInstance; // Trả về browser instance hợp lệ
    } catch (error) {
      console.error(`Không thể khởi chạy ${browser.name}:`, error.message);
    }
  }

  throw new Error("Không tìm thấy trình duyệt hợp lệ.");
}

async function scrapeFlight(targetUrl) {
  let flightsData = [];
  const browser = await getValidBrowser(); // Lấy trình duyệt hợp lệ
  try {
    const page = await browser.newPage();

    // Chờ cho trang tải hoàn tất
    await page.goto(targetUrl, {
      waitUntil: "networkidle0",
    });

    // Lấy dữ liệu chuyến bay
    // Lấy dữ liệu chuyến bay
    flightsData = await page.evaluate(() => {
      const extractFlightData = (flightElement) => {
        return {
          hangBay: flightElement.querySelector(
            "#\\30 > td.col-airlines-info > span.flight-type > strong"
          )?.textContent,
          soHieu: flightElement
            .querySelector(
              "#\\30 > td.col-airlines-info > span.flight-type > span:nth-child(3)"
            )
            ?.textContent.trim(),
          loaiMayBay: flightElement
            .querySelector(
              "#\\30 > td.col-airlines-info > span.flight-type > span:nth-child(5)"
            )
            ?.textContent.trim(),
          gioBay: flightElement
            .querySelector("#\\30 > td.time.departure > strong")
            ?.textContent.trim(),
          diemBay: flightElement
            .querySelector("#\\30 > td.time.departure > span:nth-child(2)")
            ?.textContent.trim(),
          gioDen: flightElement
            .querySelector("#\\30 > td.time.arrival > strong")
            ?.textContent.trim(),
          diemDen: flightElement
            .querySelector("#\\30 > td.time.arrival > span")
            ?.textContent.trim(),
          gia: flightElement
            .querySelector("#\\30 > td.price > span:nth-child(5) > span")
            ?.textContent.trim(),
          ThuongGia: null,
          PhoThongDacBiet: null,
          PhoThong: null,
        };
      };

      const departureFlights = Array.from(
        document.querySelectorAll('[data-id="departureFlight"]')
      ).map(extractFlightData);

      const returnFlights = Array.from(
        document.querySelectorAll('[data-id="returnFlight"]')
      ).map(extractFlightData);

      return { departureFlights, returnFlights };
    });

    console.log("First scraping complete, flights data retrieved", flightsData);

    // Danh sách loại máy bay cần giữ lại
    const validAircraftTypes = ["320", "321", "350", "787"];

    // Lọc các chuyến bay không thuộc loại máy bay hợp lệ
    flightsData.departureFlights = flightsData.departureFlights.filter(
      (flight) => {
        return (
          flight.loaiMayBay &&
          validAircraftTypes.some((type) => flight.loaiMayBay.includes(type))
        );
      }
    );

    flightsData.returnFlights = flightsData.returnFlights.filter((flight) => {
      return (
        flight.loaiMayBay &&
        validAircraftTypes.some((type) => flight.loaiMayBay.includes(type))
      );
    });

    // Tạo danh sách loại máy bay không trùng nhau sau khi lọc
    let aircraftTypes = new Set();
    flightsData.departureFlights.forEach((flight) => {
      if (flight.loaiMayBay) {
        aircraftTypes.add(flight.loaiMayBay);
      }
    });
    flightsData.returnFlights.forEach((flight) => {
      if (flight.loaiMayBay) {
        aircraftTypes.add(flight.loaiMayBay);
      }
    });
    aircraftTypes = Array.from(aircraftTypes);

    if (aircraftTypes.length > 0) {
      for (const loaiMayBay of aircraftTypes) {
        let seatUrl = "";
        const loaiMB = loaiMayBay.replace(/\D/g, "");
        switch (loaiMB) {
          case "320":
            seatUrl =
              "https://www.vietnamairlines.com/vn/vi/vietnam-airlines/our-fleets/Airbus-a320-neo/cabin-a320neo-popup";
            break;
          case "321":
            seatUrl =
              "https://www.vietnamairlines.com/vn/vi/vietnam-airlines/our-fleets/airbus-a321/cabin-a321-popup";
            break;
          case "350":
            seatUrl =
              "https://www.vietnamairlines.com/vn/vi/vietnam-airlines/our-fleets/airbus-a350/cabin-a350-popup";
            break;
          case "787":
            seatUrl =
              "https://www.vietnamairlines.com/vn/vi/vietnam-airlines/our-fleets/boeing-787/cabin-b787-popup";
            break;
        }

        if (seatUrl) {
          // Kiểm tra xem seatUrl có hợp lệ hay không
          const seatData = await scrapeSeat(seatUrl, page);
          if (
            Array.isArray(seatData) &&
            seatData.length > 1 &&
            seatData.length < 4
          ) {
            flightsData.departureFlights.forEach((flight) => {
              if (flight.loaiMayBay === loaiMayBay) {
                [flight.ThuongGia, flight.PhoThongDacBiet, flight.PhoThong] =
                  seatData.length === 3
                    ? seatData
                    : [seatData[0], 0, seatData[1]]; // Nếu chỉ có 2 số, phổ thông đặc biệt = 0
              }
            });

            flightsData.returnFlights.forEach((flight) => {
              if (flight.loaiMayBay === loaiMayBay) {
                [flight.ThuongGia, flight.PhoThongDacBiet, flight.PhoThong] =
                  seatData.length === 3
                    ? seatData
                    : [seatData[0], 0, seatData[1]]; // Nếu trả về chỉ có 2 số thì phổ thông đặc biệt = 0
              }
            });
          }
        }
      }
    }

    console.log(
      "Second scraping complete, flights data retrieved",
      flightsData
    );
  } catch (error) {
    console.error("Lỗi trong quá trình scraping:", error);
    throw error; // Ném lỗi ra ngoài để xử lý
  } finally {
    await browser.close(); // Đóng trình duyệt
    return flightsData;
  }
}

async function scrapeSeat(seatUrl, page) {
  const resultList = [];
  try {
    await page.goto(seatUrl, { waitUntil: "networkidle0" });

    // Lấy nội dung văn bản từ các selector
    const textContent = await page.evaluate(() => {
      const selector1 = document.querySelector(
        "#columncontent > div.row > div > div:nth-child(2) > table"
      );
      let selector2;
      if (!selector1) {
        selector2 = document.querySelector(
          "#columncontent > div.row > div > div.col-sm-5 > table"
        );
      }

      // Kết hợp nội dung từ hai selector
      const text1 = selector1 ? selector1.innerText : "";
      const text2 = selector2 ? selector2.innerText : "";
      return (text1 + "\n" + text2).trim();
    });

    const numbers = textContent.match(/\d+/g); // Tìm tất cả các số trong nội dung văn bản

    if (numbers) {
      numbers.forEach((num) => {
        const number = parseInt(num);

        if (number === 1) {
          if (resultList.length > 0) {
            const minValue = Math.min(...resultList); // Tìm giá trị nhỏ nhất
            const minIndex = resultList.indexOf(minValue); // Lấy chỉ số của giá trị nhỏ nhất
            if (minIndex !== -1) {
              // Nếu đã có số 1 trong danh sách, tăng số đếm lên
              resultList[minIndex] += 1;
            }
          } else {
            resultList.push(1); // Nếu chưa có số 1, thêm vào danh sách
          }
        } else {
          // Nếu số khác và đã tồn tại trong danh sách, bỏ qua
          if (!resultList.includes(number)) {
            resultList.push(number); // Nếu chưa có, thêm vào danh sách
          }
        }
      });
    }

    console.log("Danh sách số ghế sau khi xử lý:", resultList);
  } catch (error) {
    console.error("Error while scraping seat information:", error);
  } finally {
    return resultList;
  }
}

module.exports = { scrapeFlight };
