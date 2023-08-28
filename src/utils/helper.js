export const hourStatus = (hrs) => {
  const hrObj = {
    style: {
      backgroundColor: "var(--color-red)",
    },
    className: "bg-red-600",
  };
  if (hrs >= 8) {
    hrObj.className = "bg-green-600";
    hrObj.style = {
      backgroundColor: "var(--color-green)",
    };
  } else if (hrs >= 6) {
    hrObj.className = "bg-amber-600";
    hrObj.style = {
      backgroundColor: "var(--color-amber)",
    };
  }
  return hrObj;
};
