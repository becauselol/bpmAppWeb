const filterBPM = () => {
	const inputMin = document.getElementById("min");
	const inputMax = document.getElementById("max");
	const min = (Number.isNaN(parseFloat(inputMin.value))) ? 1 : parseFloat(inputMin.value);
	const max = (Number.isNaN(parseFloat(inputMax.value))) ? 999 : (parseFloat(inputMax.value) < min) ? 999 : parseFloat(inputMax.value);
	const table = document.getElementById("songTable");
	const tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		const td = tr[i].getElementsByTagName("td")[2];
		if(td) {
			tempo = parseFloat(td.textContent);
			if(tempo >= min && tempo <= max) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			};
		};
	};
};
