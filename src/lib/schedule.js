// place files you want to import through the `$lib` alias in this folder.
export function calcSchedule(schedule) {
	const periodList = [];

	const startTime = new Date(`01/01/2000 ${schedule.start}`);
	const endTime = new Date(`01/01/2000 ${schedule.end}`);
	const duration = endTime - startTime;
	// compute time available for periods
	let periodMinutes = Math.floor(duration / 1000 / 60);
	//console.log('period_minutes', periodMinutes);
	const lunch = schedule.lunch;
	if (isFinite(lunch.period)) {
		periodMinutes -= lunch.duration;
	}
	const extra = schedule.extra;
	if (extra?.duration) {
		periodMinutes -= extra.duration;
		periodMinutes -= schedule.gap || 0;
	}
	const periods = schedule.periods || [];
	if (periods.length) {
		periodMinutes -= (schedule.gap || 0) * (periods.length - 1);
	}
	let periodLength = Math.floor(periodMinutes / periods.length);
	//console.log('period_minutes', periodMinutes);
	let extraMinutes = periodMinutes - periodLength * periods.length;
	if (extraMinutes && schedule.round) {
		periodLength += 1;
		extraMinutes -= periods.length;
	}

	//console.log('extra minutes', extraMinutes);

	// now build a schedule
	let currentTime = startTime;
	for (let i = 0; i < periods.length; i++) {
		const period = periods[i];
		if (i > 0) {
			currentTime = new Date(currentTime.getTime() + (schedule.gap || 0) * 60000);
		}

		if (lunch && lunch.period === period) {
			// rewind gap
			currentTime = new Date(currentTime.getTime() - (schedule.gap || 0) * 60000);
			// group A: lunch + period + gap
			let lunchEnd = new Date(currentTime.getTime() + (lunch.duration || 0) * 60000);
			periodList.push({
				period: 'Lunch',
				group: 'A',
				start: currentTime,
				end: lunchEnd
			});
			lunchEnd = new Date(lunchEnd.getTime() + (schedule.gap || 0) * 60000);
			const periodEnd = new Date(lunchEnd.getTime() + periodLength * 60000);

			periodList.push({
				period: String(period),
				group: 'A',
				start: lunchEnd,
				end: periodEnd
			});
			// group B: # gap + period + lunch
			currentTime = new Date(currentTime.getTime() + (schedule.gap || 0) * 60000);
			const periodEnd2 = new Date(currentTime.getTime() + periodLength * 60000);
			lunchEnd = new Date(periodEnd2.getTime() + (lunch.duration || 0) * 60000);
			periodList.push({
				period: String(period),
				group: 'B',
				start: currentTime,
				end: periodEnd2
			});
			periodList.push({
				period: 'Lunch',
				group: 'B',
				start: periodEnd2,
				end: lunchEnd
			});
			currentTime = lunchEnd;
		} else {
			const periodEnd = new Date(currentTime.getTime() + periodLength * 60000);
			if (period === schedule['extra-to']) {
				periodEnd.setTime(periodEnd.getTime() + extraMinutes * 60000);
			}
			periodList.push({
				period: String(period),
				start: currentTime,
				end: periodEnd
			});
			currentTime = periodEnd;
		}

		if (extra?.period === period) {
			currentTime = new Date(currentTime.getTime() + (schedule.gap || 0) * 60000);
			const extraEnd = new Date(currentTime.getTime() + (extra.duration || 0) * 60000);
			periodList.push({
				period: extra.label,
				start: currentTime,
				end: extraEnd
			});
			currentTime = extraEnd;
		}
	}

	// period [+ gap + period]+, plus lunch+gap, plus extra+gap
	return periodList;
}
