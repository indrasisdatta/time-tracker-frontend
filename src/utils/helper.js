export const hourStatus = (hrs) => {
  const hrObj = {
    style: null,
    className: "bg-red-600",
  };
  if (hrs >= 8) {
    hrObj.className = "bg-green-600";
  } else if (hrs >= 6) {
    hrObj.className = "bg-amber-600";
  }
  return hrObj;
};
