<svelte:head>
	<title>OV Family Directory (2019/2020)</title>
</svelte:head>
<script>
	import directory from './directory'
	let search

	$: filtered = filter(search)

	function match(kid, search) {
		let {fname, lname} = kid
		let foo =  !search || search === '' || lname.toUpperCase().indexOf(search.toUpperCase()) >= 0 || fname.toUpperCase().indexOf(search.toUpperCase()) >= 0
		//console.log(foo)
		return foo
	}

	function kidSort(a, b) {
		return (
			a.lname < b.lname ? -1 : (
				a.lname > b.lname ? 1 : (
					a.fname < b.fname ? -1 : (
						a.fname > b.fname ? 1 : 0
					)
				)
			)
		)
	}

	function filter(search) {
		// make a copy of the directory
		let copy = JSON.parse(JSON.stringify(directory))
		Object.keys(copy.grades).forEach((grade) => {
			copy.grades[grade].teachers = copy.grades[grade].teachers.filter((teacher) => {
				teacher.kids = teacher.kids.filter((kid) => {
					return match(kid, search)
				}).sort(kidSort)
				return teacher.kids.length > 0
			})
			//copy.grades[grade].teachers.length > 0
		})
		console.log(copy.grades)
		return copy.grades
	}
</script>

<style>
	.entry {
		border: 1px solid #ccc;
		padding: 5px;
		border-radius: 2px;
		margin:5px;
	}

	.kid {
		
	}

	.parent {
		color: #666;
		font-size: 80%;
	}

	@media only screen and (min-width: 768px) {
		.entries {
			display: flex;
			flex-wrap: wrap;
		}

		.entry {
			width: 300px;
		}
	}
</style>

<h1>OV Family Directory (2019/2020)</h1>
<p><input bind:value={search} placeholder="search kid's name"></p>
{#each ["K", "1", "2", "3", "4", "5"] as grade }
{#if filtered[grade].teachers.length > 0}
<h2>Grade {grade}</h2>
{#each filtered[grade].teachers as { lname, classroom, kids }}
<h3>{lname} - {classroom}</h3>
<div class="entries">
	{#each kids as { fname, lname, parent1, parent2 }}
	<div class="entry">
		<p class="kid">{lname}, {fname}</p>
		<p class="parent">
			{parent1.fname} {parent1.lname}<br/>
			{#if parent1.email && parent1.email !== ''}
			<a href="mailto:{parent1.email}">{parent1.email}</a><br/>
			{/if}
			{#if parent1.phone && parent1.phone !== ''}
			<a href="tel:{parent1.phone}">{parent1.phone}</a>
			{/if}
		</p>
		{#if parent2}
		<p class="parent">
			{parent2.fname} {parent2.lname}<br/>
			{#if parent2.email && parent2.email !== ''}
			<a href="mailto:{parent2.email}">{parent2.email}</a><br/>
			{/if}
			{#if parent2.phone && parent2.phone !== ''}
			<a href="tel:{parent2.phone}">{parent2.phone}</a>
			{/if}
		</p>
		{/if}
	</div>
	{/each}
</div>
{/each}
{/if}
{/each}
