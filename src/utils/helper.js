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

export const calculateTimeDifference = (
  startTime,
  endTime,
  shorthand = false
) => {
  console.log("Check start end time", startTime, endTime);
  if (!startTime || !endTime) {
    return null;
  }
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Calculate the time difference in minutes
  let timeDiffMinutes =
    (endHours - startHours) * 60 + (endMinutes - startMinutes);

  if (timeDiffMinutes < 0) {
    return null;
  }

  // Calculate hours and minutes
  const hours = Math.floor(timeDiffMinutes / 60);
  const minutes = timeDiffMinutes % 60;

  // Format the output
  let result = "";
  if (hours > 0) {
    result += `${hours}` + (shorthand ? `h` : `hour${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    result +=
      ` ${minutes}` + (shorthand ? `m` : ` min${minutes !== 1 ? "s" : ""}`);
  }

  return result.trim();
};
