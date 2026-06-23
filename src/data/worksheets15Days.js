import { curriculumDays } from "./curriculum15Days";
import { PDF_WORKSHEETS } from "./worksheetsPdfContent";

/**
 * أوراق عمل مرتبطة بمسار 15 يومًا — محتوى مُحاذٍ لصفحات PDF الرسمي
 */
export const worksheets15Days = curriculumDays
  .filter((d) => d.worksheetId)
  .map((day) => {
    const pdf = PDF_WORKSHEETS[day.worksheetId];
    return {
      id: day.worksheetId,
      dayId: day.id,
      dayNumber: day.dayNumber,
      weekNumber: day.weekNumber,
      titleAr: `ورقة عمل — اليوم ${day.dayNumber}: ${day.titleAr.replace(/^اليوم \d+ — /, "")}`,
      introAr: pdf
        ? `${pdf.sectionAr} — مُستخرجة من صفحات PDF: ${pdf.pdfPages.join("، ")}`
        : `بعد دراسة اليوم ${day.dayNumber}، أجب عن الأسئلة التالية.`,
      topicAr: day.conceptsAr.slice(0, 4).join(" · "),
      pdfPages: pdf?.pdfPages ?? [],
      tasks: pdf?.tasks ?? fallbackTasks(day),
    };
  });

function fallbackTasks(day) {
  return [
    {
      n: 1,
      textAr: `لخّص أهداف اليوم ${day.dayNumber} بثلاث جمل.`,
      pdfRef: "منهج",
    },
    {
      n: 2,
      textAr: day.practicalAr || day.summaryAr,
      pdfRef: "منهج",
    },
  ];
}

export function getWorksheet15ById(id) {
  return worksheets15Days.find((w) => w.id === id) ?? null;
}

export function getWorksheetsByWeek(weekNumber) {
  return worksheets15Days.filter((w) => w.weekNumber === weekNumber);
}
