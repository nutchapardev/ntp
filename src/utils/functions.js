/**
 * ฟังก์ชันสำหรับดึงตัวเลข N หลักแรก
 * @param {number} number - ตัวเลขที่ต้องการดึงค่า
 * @param {number} count - จำนวนหลักที่ต้องการ
 * @param {boolean} [returnAsNumber=false] - ถ้าเป็น true จะคืนค่าเป็นตัวเลข, ถ้าเป็น false จะคืนค่าเป็นข้อความ
 * @returns {string|number} - ผลลัพธ์ที่ได้
 */
function getNumberOfDigits(number, count, returnAsNumber = false) {
  if (typeof number !== "number" || typeof count !== "number") {
    return returnAsNumber ? NaN : ""; // คืนค่า NaN (Not-a-Number) ถ้าต้องการตัวเลข
  }

  const stringResult = number.toString().slice(0, count);

  if (returnAsNumber) {
    return parseInt(stringResult, 10);
  }

  return stringResult;
}

// อาเรย์ของสีที่เราต้องการสุ่ม
const colors = ["error", "primary", "success"];
// const colors = ["warning", "error", "primary", "secondary", "info", "success"]

/**
 * ฟังก์ชันสำหรับสุ่มสีจากอาเรย์ colors
 * @returns {string} สีที่ถูกสุ่มได้ เช่น "red", "blue", หรือ "green"
 */
function getRandomColor() {
  // 1. สร้างเลข index แบบสุ่ม: 0, 1, หรือ 2
  const randomIndex = Math.floor(Math.random() * colors.length);

  // 2. ใช้ index ที่สุ่มได้เพื่อดึงค่าสีออกจากอาเรย์
  const randomColor = colors[randomIndex];

  return randomColor;
}

// --- ตัวอย่างการเรียกใช้งาน ---
// const myColor = getRandomColor()
// console.log(`สีที่สุ่มได้คือ: ${myColor}`) // ผลลัพธ์อาจจะเป็น "สีที่สุ่มได้คือ: blue"

function toThaiDateString(dateString) {
  // 1. สร้าง Object Date จาก String ที่รับเข้ามา
  const date = new Date(dateString);

  // 2. กำหนดค่า options สำหรับการจัดรูปแบบ
  const options = {
    year: "numeric", // แสดงปีเป็นตัวเลข
    month: "long", // แสดงชื่อเดือนแบบเต็ม
    day: "numeric", // แสดงวันที่เป็นตัวเลข
    locale: "th-TH", // ใช้ locale ของไทย
    calendar: "buddhist", // ใช้ปฏิทินแบบพุทธ (จะแปลงเป็นปี พ.ศ. ให้)
  };

  // 3. จัดรูปแบบวันที่และคืนค่า
  // ใช้ .replace เพื่อลบคำว่า "พ.ศ." ที่อาจจะติดมากับบาง Browser
  return new Intl.DateTimeFormat("th-TH", options)
    .format(date)
    .replace("พ.ศ. ", "");
}

function toThaiDateTimeString(isoString) {
  // 1. สร้าง Object Date จาก String ที่รับเข้ามา
  // JavaScript จะแปลงเวลาจาก UTC (Z) เป็นเวลาท้องถิ่นของเครื่องโดยอัตโนมัติ
  const date = new Date(isoString);

  // 2. กำหนดค่า options สำหรับการจัดรูปแบบ
  const options = {
    // ส่วนของวันที่
    day: "numeric", // แสดงวันที่เป็นตัวเลข
    month: "long", // แสดงชื่อเดือนแบบเต็ม
    year: "numeric", // แสดงปีเป็นตัวเลข
    calendar: "buddhist", // ใช้ปฏิทินพุทธศักราช (แปลงเป็น พ.ศ. อัตโนมัติ)

    // ส่วนของเวลา
    hour: "2-digit", // แสดงชั่วโมงเป็นเลข 2 หลัก (00-23)
    minute: "2-digit", // แสดงนาทีเป็นเลข 2 หลัก (00-59)
    hour12: false, // บังคับให้เป็นรูปแบบ 24 ชั่วโมง

    // กำหนด Timezone ให้เป็นของประเทศไทย
    timeZone: "Asia/Bangkok",
  };

  // 3. จัดรูปแบบและแทนที่ "," ที่อาจคั่นกลางระหว่างวันที่กับเวลา
  const formatter = new Intl.DateTimeFormat("th-TH", options);
  const formattedString = formatter.format(date).replace(",", "");

  // 4. จัดรูปแบบสุดท้ายตามที่ต้องการ "วัน เดือน ปี เวลา HH:mm น."
  return formattedString + " น.";
}

function formatCurrency(total) {
  return total.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export {
  getNumberOfDigits,
  getRandomColor,
  toThaiDateString,
  toThaiDateTimeString,
  formatCurrency
};

// --- ตัวอย่างการใช้งาน ---

// // 1. รับค่าเป็น String (ค่าเริ่มต้น)
// const resultString = getFirstDigitsAdvanced(102444, 4)
// console.log(resultString) // ผลลัพธ์: "1024"
// console.log(typeof resultString) // "string"

// // 2. รับค่าเป็น Number (ส่ง true เป็น argument ที่สาม)
// const resultNumber = getFirstDigitsAdvanced(102444, 4, true)
// console.log(resultNumber) // ผลลัพธ์: 1024
// console.log(typeof resultNumber) // "number"
