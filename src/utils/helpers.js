export const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export const dayMapping = Object.fromEntries(days.map((day, index) => [day, index + 2]));

export const getGridRow = (timeStr) => {
  if (!timeStr) return 1;
  const [hour, minute] = timeStr.split(":").map(Number);
  const minutesFromStart = (hour - 8) * 60 + (minute - 30);
  const rowOffset = Math.floor(minutesFromStart / 30);
  return rowOffset + 2;
};

export const getDurationSpan = (startStr, endStr) => {
  if (!startStr || !endStr) return 2;
  const startRow = getGridRow(startStr);
  const [endH, endM] = endStr.split(":").map(Number);
  const minutesFromStart = (endH - 8) * 60 + (endM - 30);
  const endRow = Math.ceil(minutesFromStart / 30) + 2;
  return endRow - startRow;
};

export const compareTimes = (time1, time2) => {
  if (!time1 || !time2) return 0;
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  return (h1 * 60 + m1) - (h2 * 60 + m2);
};

// Renk Paleti
export const rowColors = [
  "bg-red-600", "bg-orange-600", "bg-amber-600", "bg-yellow-700", "bg-lime-700", "bg-green-600", 
  "bg-emerald-600", "bg-teal-600", "bg-cyan-700", "bg-sky-600", "bg-blue-600", "bg-indigo-600", 
  "bg-violet-600", "bg-purple-600", "bg-fuchsia-700", "bg-pink-600", "bg-rose-600", "bg-slate-600"
];