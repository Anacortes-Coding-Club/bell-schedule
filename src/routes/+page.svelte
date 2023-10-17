<script>
	import { calcSchedule } from '$lib/schedule';
	import schedules from '$lib/templates.json';

	let title = '';
	let definition = {
		start: '08:05',
		end: '14:45',
		periods: [1, 2, 3, 4, 5, 6, 7],
		gap: 4,
		'extra-to': 1,
		lunch: {
			period: 5,
			duration: 30
		},
		extra: {}
	};
	let periods = calcSchedule(definition);
	$: {
		periods = calcSchedule(definition);

		for (const period of periods) {
			period.duration = (period.end - period.start) / 1000 / 60;
			period.start = period.start
				.toLocaleTimeString([], {
					hour: 'numeric',
					minute: '2-digit'
				})
				.replace(/AM|PM/, '');
			period.end = period.end
				.toLocaleTimeString([], {
					hour: 'numeric',
					minute: '2-digit'
				})
				.replace(/AM|PM/, '');
			period.label = period.period;
			if (isFinite(period.period)) {
				period.label = 'Period ' + period.period;
			}
		}
	}
	const allPeriods = [1, 2, 3, 4, 5, 6, 7];
	let template = undefined;

	function selectTemplate() {
		if (template !== undefined) {
			definition = schedules[template].definition;
			if (!definition.extra) definition.extra = {};
			title = schedules[template].label;
		}
		template = undefined;
	}
</script>

<h1>AHS Schedule Builder</h1>
<p>
	Replace with Template:
	<select bind:value={template} on:change={() => selectTemplate()}>
		<option value={undefined} />
		{#each schedules as template, idx}
			<option value={idx}>{template.label}</option>
		{/each}
	</select>
</p>

<div>Title: <input type="text" bind:value={title} /></div>
<div>
	<label>
		Start time: <input type="time" bind:value={definition.start} />
	</label>

	<label>
		End time: <input type="time" bind:value={definition.end} />
	</label>
</div>

<p />
<div>
	Includes:
	{#each allPeriods as period}
		<label>
			<input type="checkbox" bind:group={definition.periods} value={period} />
			Period {period}
		</label>
	{/each}
</div>

<div>
	time between periods:
	<input type="number" bind:value={definition.gap} style="width: 3em" />
	minutes
</div>

<p>
	Lunch during:
	<select bind:value={definition.lunch.period}>
		<option>None</option>
		{#each definition.periods as per}
			<option value={per} selected>Period {per}</option>
		{/each}
	</select>
</p>
<p>
	Extra period:
	<input type="text" bind:value={definition.extra.label} placeholder="e.g., Assembly" />
	after
	<select bind:value={definition.extra.period}>
		<option>None</option>
		{#each definition.periods as per}
			<option value={per}>Period {per}</option>
		{/each}
	</select>
	for <input type="number" bind:value={definition.extra.duration} style="width: 4em;" /> minutes.<br
	/>
</p>
<p>
	Calculation: round <select bind:value={definition.round}>
		<option value={0}>down</option>
		<option value={1}>up</option>
	</select>
	with any remainder to
	<select bind:value={definition['extra-to']}>
		{#each definition.periods as per}
			<option value={per}>Period {per}</option>
		{/each}
	</select>.
</p>

<h2>Schedule: {title}</h2>

<table>
	{#each periods as period, i}
		{#if i > 1 && periods[i - 1].group != period.group}
			<tr>
				<td colspan="5">
					{#if !period.group || (i > 1 && !periods[i - 1].group)}
						<hr />
					{:else}&nbsp;{/if}
				</td>
			</tr>
		{/if}
		<tr>
			<th>{period.label}</th>
			<td class="start">{period.start}</td>
			<td>-</td>
			<td class="end">{period.end}</td>
			<td class="duration">({period.duration} min)</td>
		</tr>
	{/each}
</table>

<style>
	th,
	td {
		padding-right: 1em;
	}

	th {
		padding-right: 4em;
	}

	.group {
		font-size: 1.5em;
	}

	.start,
	.end {
		text-align: right;
	}
</style>
