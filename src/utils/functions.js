/**
 * ฟังก์ชันสำหรับดึงตัวเลข N หลักแรก
 * @param {number} number - ตัวเลขที่ต้องการดึงค่า
 * @param {number} count - จำนวนหลักที่ต้องการ
 * @param {boolean} [returnAsNumber=false] - ถ้าเป็น true จะคืนค่าเป็นตัวเลข, ถ้าเป็น false จะคืนค่าเป็นข้อความ
 * @returns {string|number} - ผลลัพธ์ที่ได้
 */
function getNumberOfDigits(number, count, returnAsNumber = false) {
  if (typeof number !== "number" || typeof count !== "number") {
    return returnAsNumber ? NaN : "" // คืนค่า NaN (Not-a-Number) ถ้าต้องการตัวเลข
  }

  const stringResult = number.toString().slice(0, count)

  if (returnAsNumber) {
    return parseInt(stringResult, 10)
  }

  return stringResult
}

// อาเรย์ของสีที่เราต้องการสุ่ม
const colors = ["error", "primary", "success"]
// const colors = ["warning", "error", "primary", "secondary", "info", "success"]

/**
 * ฟังก์ชันสำหรับสุ่มสีจากอาเรย์ colors
 * @returns {string} สีที่ถูกสุ่มได้ เช่น "red", "blue", หรือ "green"
 */
function getRandomColor() {
  // 1. สร้างเลข index แบบสุ่ม: 0, 1, หรือ 2
  const randomIndex = Math.floor(Math.random() * colors.length)

  // 2. ใช้ index ที่สุ่มได้เพื่อดึงค่าสีออกจากอาเรย์
  const randomColor = colors[randomIndex]

  return randomColor
}

// --- ตัวอย่างการเรียกใช้งาน ---
const myColor = getRandomColor()
console.log(`สีที่สุ่มได้คือ: ${myColor}`) // ผลลัพธ์อาจจะเป็น "สีที่สุ่มได้คือ: blue"

export { getNumberOfDigits, getRandomColor }

// --- ตัวอย่างการใช้งาน ---

// // 1. รับค่าเป็น String (ค่าเริ่มต้น)
// const resultString = getFirstDigitsAdvanced(102444, 4)
// console.log(resultString) // ผลลัพธ์: "1024"
// console.log(typeof resultString) // "string"

// // 2. รับค่าเป็น Number (ส่ง true เป็น argument ที่สาม)
// const resultNumber = getFirstDigitsAdvanced(102444, 4, true)
// console.log(resultNumber) // ผลลัพธ์: 1024
// console.log(typeof resultNumber) // "number"
