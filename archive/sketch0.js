//Constants
var worldX = 1920;
var worldY = 1080;
var tileSize = 40;
var fontSize = 35;
var fontOffsetX = 11;
var fontOffsetY = 33;
var gridOffsetX = 30;
var gridOffsetY = 30;
var rowOffset = 50;
var colOffset = 75;
var rowSize = 25;
var colSize = 32;

var puzzle = [
"050790214",
"030010090",
"200004007",
"026509000",
"500030009",
"000208140",
"900400008",
"010070030",
"742085060"
];

// Globalz
var grid_l = 9;
var sub_l = 3;
var sub_h = 3;

var m_grid = new Array(grid_l);
var c_grid = new Array(grid_l);

var col_set = new Array(grid_l);
var row_set = new Array(grid_l);
var sub_set = new Array(sub_l);

// Initalise things (iterator goes from top to bottom, then left to right)
for(i=0;i<grid_l;i++){
	col_set[i] = new Array(grid_l);
	row_set[i] = new Array(grid_l);
	for(j=0;j<grid_l;j++){
		col_set[i][j] = 0;
		row_set[i][j] = 0;
	}
}

for(i=0;i<grid_l;i++){
	m_grid[i] = new Array(grid_l);
	c_grid[i] = new Array(grid_l);
	for(j=0;j<grid_l;j++){
		m_grid[i][j] = puzzle[j][i];
		if(puzzle[j][i] != 0){
			col_set[i][puzzle[j][i]-1] = 1;
			row_set[j][puzzle[j][i]-1] = 1;
		}
		c_grid[i][j] = new Array(grid_l);
		for(k=0;k<grid_l;k++){
			c_grid[i][j][k] = 0;
		}
	}
}

for(i=0;i<sub_l;i++){
	sub_set[i] = new Array(sub_h);
	for(j=0;j<sub_h;j++){
		sub_set[i][j] = 0;
	}
}

function setup() {
  createCanvas(worldX, worldY);
  frameRate(5);
}

function draw(){
  background(20);
	textSize(fontSize);
	fill(255);
	stroke(255);
	
	// Print values
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			text(m_grid[i][j], i*tileSize+fontOffsetX+gridOffsetX,j*tileSize+fontOffsetY+gridOffsetY);
		}
	}
	
	// Print grid	
	for(i=0;i<=grid_l;i++){
		line((i*tileSize)+gridOffsetX,gridOffsetY,(i*tileSize)+gridOffsetX,tileSize*9+gridOffsetY);
		line(gridOffsetX,i*tileSize+gridOffsetY,tileSize*9+gridOffsetX,i*tileSize+gridOffsetY);
	}
	var rowCount = 0;
	var colCount = 0;
	// Print sets
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			if(row_set[i][j] != 0){
				text(j+1, 9*tileSize+rowOffset+(rowCount*rowSize), (i*tileSize)+fontOffsetY+gridOffsetY);
				rowCount++;
			}
			if(col_set[i][j] != 0){
				text(j+1, (i*tileSize)+fontOffsetX+gridOffsetX, 9*tileSize+colOffset+(colCount*colSize));
				colCount++;
			}
		}
		rowCount = 0;
		colCount = 0;
	}
}