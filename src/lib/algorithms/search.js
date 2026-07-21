function normalizeNumbers(list) {
  return (Array.isArray(list) ? list : []).map((n) => Number(n));
}

export function linearSearchSteps(list, target) {
  const arr = normalizeNumbers(list);
  const wanted = Number(target);
  const steps = [];

  for (let i = 0; i < arr.length; i += 1) {
    const value = arr[i];
    const match = value === wanted;
    steps.push({
      index: i,
      value,
      match,
      messageAr: match
        ? `وجدنا ${wanted} في الموضع ${i}.`
        : `نفحص الموضع ${i}: القيمة ${value} ليست ${wanted}.`,
    });
    if (match) {
      return { foundIndex: i, steps };
    }
  }

  steps.push({
    index: -1,
    value: null,
    match: false,
    messageAr: `انتهى البحث الخطي ولم نجد ${wanted}.`,
  });
  return { foundIndex: -1, steps };
}

export function binarySearchSteps(list, target) {
  const sorted = normalizeNumbers(list).slice().sort((a, b) => a - b);
  const wanted = Number(target);
  const steps = [];
  let low = 0;
  let high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = sorted[mid];
    const relation = midValue === wanted ? "equal" : midValue < wanted ? "less" : "greater";

    steps.push({
      low,
      high,
      mid,
      midValue,
      relation,
      messageAr:
        relation === "equal"
          ? `القيمة الوسطى ${midValue} تساوي ${wanted} عند الموضع ${mid}.`
          : relation === "less"
            ? `القيمة الوسطى ${midValue} أصغر من ${wanted}، ننتقل للنصف الأيمن.`
            : `القيمة الوسطى ${midValue} أكبر من ${wanted}، ننتقل للنصف الأيسر.`,
    });

    if (relation === "equal") {
      return { foundIndex: mid, sorted, steps };
    }
    if (relation === "less") low = mid + 1;
    else high = mid - 1;
  }

  steps.push({
    low,
    high,
    mid: -1,
    midValue: null,
    relation: "not_found",
    messageAr: `انتهى البحث الثنائي ولم نجد ${wanted}.`,
  });
  return { foundIndex: -1, sorted, steps };
}
