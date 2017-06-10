// das program generiert immer eine zufällige anzahl von kreisen und bewegt diese hin und her

width = 1000,
height = 1000;


var svg = d3.select("body").append("svg").attr("class", "box").attr("width", width).attr("height", height).style("border", "1px solid black")

X = d3.scaleLinear().domain([0, 1]).range([0, width]); // einfache X Skale zum plazieren
Y = d3.scaleLinear().domain([0, 1]).range([0, height]); // Y Skala
rd_size = d3.randomUniform(10, 50); // eine random number generator der zahlen zwischen 10 und 50 produziert für die kreisgrössen
rd_pos = d3.randomUniform(0, 1); // dieser random number generator wird verwendet um die zufälligen positionen zu generieren
rd_num = d3.randomUniform(5, 20); // das hier um die Anzahl der Kreise zu würfeln

// anfangs wird ein datensatz von 10 dots mit zufälliger position und größe generiert
// das sind die Daten die an die DOM elemente gebunden werden

var dots = d3.range(10).map(function(d) { 
	return {
		index: d,
		x: rd_pos(),
		y: rd_pos(),
		r: rd_size()
	}
});

// das hier ist die initalisierung für jedes der 10 elemente in dots wird ein circle gemacht und plaziert

svg.selectAll(".dot").data(dots).enter().append("circle").attr("class", "dot")
	.attr("cx", function(d) {
		return X(d.x)
	})
	.attr("cy", function(d) {
		return Y(d.y)
	})
	.attr("r", function(d) {
		return d.r
	})
	.style("fill", "white")
	.style("stroke", "black")
	.style("stroke-width", 1)

// hier kommt die schleife, alle 2 Sekunden wir die funktion aufgerufen
	
var t = d3.interval(function(elapsed) {

// hier wählen wir eine neue anzahl von kreisen zwischen 5 und 20 kann also größer oder kleiner sein
// als die anzahl anfangs, wir könnten alle kreise löschen und N neue Zeichnen machen wir aber nicht
	var N = Math.floor(rd_num()); 

// erstmal generieren einen Datensatz von N neuen dots
	dots = d3.range(N).map(function(d) {
		return {
			index: d,
			x: rd_pos(),
			y: rd_pos(),
			r: rd_size()
		}
	});

// hier kommt die selection wir selecten alle .dot circles im DOM, das sind erstmal 10, an
// die binden wir die daten. Jedes .dot bekommt ein datenpunkt aus dots. Wenn jetzt aber N < 10 oder N > 10 ist???

	var dot = svg.selectAll(".dot").data(dots)

// dot.exit() sind all die DOM elemente, die keinen datenpunkt abbekommen haben, wenn also N<10 ist
// diese färben wir rot ein und schmeissen sie dann weg.	
	dot.exit().transition().duration(1000).style("fill", "red").remove();

// was passiert aber sollte N > 10 sein? dann haben wir mehr elements in dots als kreise an die wir die datenpunkte binden können.
// dot.enter() bezieht sich auf die DOM elemente die noch nicht da sind und für die machen wir mit append() neue kreise.	

	dot.enter().append("circle").attr("class", "dot")
		.attr("cx", function(d) {
			return X(d.x)
		})
		.attr("cy", function(d) {
			return Y(d.y)
		})
		.attr("r", function(d) {
			return d.r
		})
		.style("fill", "green")
		.style("stroke", "black")
		.style("stroke-width", 1)

// alle anderen die ganz normal ihren datenpunkt abbekommen haben schieben wir an die neue position		

	dot.transition().duration(2000)
		.attr("cx", function(d) {
			return X(d.x)
		})
		.attr("cy", function(d) {
			return Y(d.y)
		})
		.attr("r", function(d) {
			return d.r
		})
		.style("fill", "white")

// so werden nur domelemente erstellt oder wieder weggeschmissen wenn unbedingt nötig.		


	if (elapsed > 50000) t.stop();
}, 2000);
