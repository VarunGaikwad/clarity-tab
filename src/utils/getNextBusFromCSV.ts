export interface BusEntry {
  departure: Date;
  mineArrival?: Date;
  originalIndex: number;
}

export const parseSpaceSeparatedCSVWithMine = (
  csvText: string,
  gracePeriodMinutes = 2 // <== NEW
): BusEntry[] => {
  const now = new Date();
  const graceCutoff = new Date(now.getTime() - gracePeriodMinutes * 60 * 1000);
  // const futureCutoff = new Date(now.getTime() + offsetMinutes * 60 * 1000);
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const kashiTimes = lines[0].trim().split(/\s+/).slice(1);
  const mineTimes = lines[1].trim().split(/\s+/).slice(1);

  const today = new Date();
  const results: BusEntry[] = [];

  for (let i = 0; i < kashiTimes.length; i++) {
    const timeStr = kashiTimes[i];
    if (!/^\d{1,2}:\d{2}$/.test(timeStr)) continue;

    const [h, m] = timeStr.split(":").map(Number);
    const dep = new Date(today);
    dep.setHours(h, m, 0, 0);

    if (dep < graceCutoff) continue; // missed completely

    let mineArrival: Date | undefined;
    const mineTimeStr = mineTimes[i];
    if (/^\d{1,2}:\d{2}$/.test(mineTimeStr)) {
      const [mh, mm] = mineTimeStr.split(":").map(Number);
      mineArrival = new Date(today);
      mineArrival.setHours(mh, mm, 0, 0);
    }

    results.push({ departure: dep, mineArrival, originalIndex: i });
  }

  return results.sort((a, b) => a.departure.getTime() - b.departure.getTime());
};
