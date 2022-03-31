var canvas = document.getElementById("hexCanvas"),
    cvs = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    ctx = cvs.getContext("2d")
    TempRange = document.getElementById("Temp"),
    //    J = document.getElementById("Coup_Const"),
    mag = document.getElementById("mag"),
    mag2 = document.getElementById("mag2"),
    // out = document.getElementById("out"),


    // Functions

    sites = 40,
    width = (600 / sites),
    beta = 3 / (TempRange.value);;

function hexagon(x_center, y_center, space, color) {
    x = space / (2 * Math.sqrt(3)) + 0.2;
    y = space / 2 + 0.2;
    context.beginPath();
    context.fillStyle = color;
    context.moveTo(x_center - x, y_center - y); // point 1
    context.lineTo(x_center + x, y_center - y); // point 2
    context.lineTo(x_center + 2 * x, y_center); // point 3
    context.lineTo(x_center + x, y_center + y); // point 4
    context.lineTo(x_center - x, y_center + y); // point 5
    context.lineTo(x_center - 2 * x, y_center)

    context.closePath(); // go back to point 1
    context.fill()
    // context.stroke(); // draw stroke line
}

function std(arr){
    let mean = arr.reduce((acc, curr)=>{
	return acc + curr
}, 0) / arr.length;


arr = arr.map((el)=>{
	return (el - mean) ** 2
})

let total = arr.reduce((acc, curr)=> acc + curr, 0);

return Math.sqrt(total / arr.length)
}

function TD_Sum(li) {
    var len_x = li.length,
        len_y = li[0].length,
        num = 0;
    for (var i = 0; i < len_x; i++) {
        for (var j = 0; j < len_y; j++) {
            num += li[i][j]
        }
    }
    return num
}

function sum(li) {
    len_x = li.length,
        num = 0;
    for (var i = 0; i < len_x; i++) {
        num += li[i]
    }
    return num
}

function Create_Zero_Row() {
    var Row = [0];
    for (var i = 0; i < sites; i++) {
        Row.push(0)
    }
    Row.push(0)
    return Row
}

function Create_Row() {
    var Row = [0];
    for (var i = 0; i < sites; i++) {
        Row.push(Math.floor(Math.random() * 2) * 2 - 1)
    }
    Row.push(0)
    return Row
}

function Create_Lattice() {
    row_temp = Create_Zero_Row();
    var Lattice = new Array(row_temp);
    for (var i = 0; i < sites; i++) {
        row_temp = Create_Row()
        Lattice.push(row_temp)
    }
    row_temp = Create_Zero_Row()
    Lattice.push(row_temp)
    return Lattice
}

/*
function updateMag() {
    var p = 2 * Math.PI * Math.sqrt(info.lengthInMeter / G_ACC);
    period.innerHTML = p.toFixed(2) + "s";
}
*/

var Lattice = Create_Lattice(),
    hexLattice = Create_Lattice();

function Hex_Draw(Lattice) {
    for (var i = 1; i < sites + 1; i++) {
        for (var j = 1; j < sites + 1; j++) {

            if (Lattice[i][j] == 1) {
                color = "rgb(233,0,0)";
            } else {
                color = "rgb(0,233,0)";
            }
            hexagon(Math.sqrt(3) / 2 * i * width, 1 / 2 * (i % 2) * width + j * width, width, color)


        }
    }
}

function Draw(Lattice) {

    for (var i = 1; i < sites + 1; i++) {
        for (var j = 1; j < sites + 1; j++) {

            if (Lattice[i][j] == 1) {
                ctx.fillStyle = "rgb(233,0,0)";
            } else {
                ctx.fillStyle = "rgb(0,233,0)";
            }

            ctx.fillRect(i * width, j * width, width, width)

        }
    }
}


function update(beta, J, i, j) {
    var E = 2 * J * Lattice[i][j] * (Lattice[i][j - 1] + Lattice[i][j + 1] + Lattice[i - 1][j] + Lattice[i + 1][j])
    var prob = Math.exp(-beta * E)

    if (prob > Math.random()) {
        Lattice[i][j] = -Lattice[i][j]
    }
}

function update_hexa(beta, J, i, j) {
    var E = 0;

    if (j % 2 == 0){
        E = 2 * J * hexLattice[i][j] * (hexLattice[i - 1][j + 1] + hexLattice[i - 1][j - 1] + hexLattice[i][j - 1] + hexLattice[i][j + 1] + hexLattice[i - 1][j] + hexLattice[i + 1][j])
    }else{
        E = 2 * J * hexLattice[i][j] * (hexLattice[i + 1][j + 1] + hexLattice[i + 1][j - 1] + hexLattice[i][j - 1] + hexLattice[i][j + 1] + hexLattice[i - 1][j] + hexLattice[i + 1][j])
    }
    
    var prob = Math.exp(-beta * E)

    if (prob > Math.random()) {
        hexLattice[i][j] = -hexLattice[i][j]
    }
}


function OneRun(J, beta) {
    for (var i = 1; i < sites; i++) {
        for (var j = 1; j < sites; j++) {
            update(beta, J, i, j)
        }
    }
}

function OneRunHex(J, beta) {
    for (var i = 1; i < sites; i++) {
        for (var j = 1; j < sites; j++) {
            update_hexa(beta, J, i, j)
        }
    }
}

function Run(J, beta, N, m) {

    for (var i = 0; i < N; i++) {
        OneRun(J, beta)
    }

    var bin = []
    for (var i = 0; i < m; i++) {
        bin_temp = []
        for (var j = 0; j < N; j++) {
            OneRun(J, beta)
                // Calculate the magnetic moment
            mag_temp = TD_Sum(Lattice)
            bin_temp.push(mag_temp / sites / sites)

        }
        mg = sum(bin_temp) / m
        bin.push(mg)
    }
    mg = sum(bin) / N;
    std_mg = std(bin);
    mag.innerHTML = "Average Magnetic Moment for Square Lattice is " + mg.toFixed(2) + "&plusmn;" + std_mg.toFixed(2) + " per site, and the Temperature is " + (TempRange.value / 170 / 1.05).toFixed(2);


}


function hexRun(J, beta, N, m) {

    for (var i = 0; i < 15; i++) {
        OneRunHex(J, beta)
    }

    var bin = []
    for (var i = 0; i < m; i++) {
        bin_temp = []
        for (var j = 0; j < N; j++) {
            OneRunHex(J, beta)
                // Calculate the magnetic moment
            mag_temp = TD_Sum(hexLattice)
            bin_temp.push(mag_temp / sites / sites)

        }
        mg = sum(bin_temp) / m
        bin.push(mg)
    }
    mg = sum(bin) / N
    std_mg = std(bin);

    
    mag2.innerHTML = "Average Magnetic Moment for Trangle Lattice is " + mg.toFixed(2) + "&plusmn;" + std_mg.toFixed(2) + ".";


}

// action


TempRange.onchange = function(e) {
    beta = 150 / (TempRange.value);
    // out.innerHTML = "Average Magnetic Moment " + beta + "s";
    Run(0.5, beta, 50, 30);
    hexRun(0.5, beta, 50, 30)
    Draw(Lattice)
    Hex_Draw(hexLattice);
}

// mag.innerHTML = beta + "s";

// console.log(Lattice)

beta = 2

Run(0.5, beta, 50, 5);
hexRun(0.5, beta, 50, 15);
Draw(Lattice);
Hex_Draw(hexLattice);

/*for (var i = 0; i < 20; i++) {
   
    }
}*/