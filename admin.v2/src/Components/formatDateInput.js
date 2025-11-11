export const formatDateInput = (value) => {
  // Chỉ giữ lại số
  console.log(value);
  let cleanValue = value.replace(/[^0-9]/g, "");
  if (cleanValue.length > 8) cleanValue = cleanValue.slice(0, 8); // Giới hạn 8 số

  let formatted = "";
  if (cleanValue.length > 2) {
    formatted = `${cleanValue.slice(0, 2)}-${cleanValue.slice(2)}`;
  } else {
    formatted = cleanValue;
  }

  if (cleanValue.length > 4) {
    formatted = `${cleanValue.slice(0, 2)}-${cleanValue.slice(
      2,
      4
    )}-${cleanValue.slice(4)}`;
  }

  return formatted;
};
