//// CONSTANTS ////
// Screen size
var worldX = 1920;
var worldY = 1080;

// Grid options
var gTileSize = 40;
var gOffsetX = 30;
var gOffsetY = 30;
var gFontSize = 32;
var gFontOffsetX = 12;
var gFontOffsetY = 32;

// All sets options
var rcsFontSize = 25;

// Row/col set options
var rOffset = 45;
var cOffset = 70;
var rSize = 18;
var cSize = 27;
var rFontY = -3;
var cFontX = 1;

// Subgrid options
var sSize = 14;
var sTopX = 9*gTileSize+rOffset;
var sTopY = 9*gTileSize+cOffset;
var sGapX = 3;
var sGapY = 12;
var sSpaceX = 0;
var sSpaceY = 8;

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

// Puzzle sizes
var grid_l = 9;
var sub_l = 3;
var sub_h = 3;

// Colours
var borderColour = [Math.random()*255, Math.random()*255, Math.random()*255];
var puzzleColour = [Math.random()*255, Math.random()*255, Math.random()*255];
var setColourA = [Math.random()*255, Math.random()*255, Math.random()*255];
var setColourB = [Math.random()*255, Math.random()*255, Math.random()*255];

// Grids and sets
var m_grid = new Array(grid_l);
var c_grid = new Array(grid_l);
var col_set = new Array(grid_l);
var row_set = new Array(grid_l);
var sub_set = new Array(sub_l);


//// FUNCTIONS ////
function init(){
	// Initalise col and row sets
	for(i=0;i<grid_l;i++){
		col_set[i] = {};
		row_set[i] = {};
	}

	// Initialise subgrid sets (i is x axis)
	for(i=0;i<sub_l;i++){
		sub_set[i] = new Array(sub_h);
		for(j=0;j<sub_h;j++){
			sub_set[i][j] = {};
		}
	}

	// Initalise grids (i is x axis, j is y axis), fill sets.
	for(i=0;i<grid_l;i++){
		m_grid[i] = new Array(grid_l);
		c_grid[i] = new Array(grid_l);
		for(j=0;j<grid_l;j++){
			m_grid[i][j] = puzzle[j][i];
			if(puzzle[j][i] != 0){
				col_set[i][puzzle[j][i]-1] = 1;
				row_set[j][puzzle[j][i]-1] = 1;
				sub_set[Math.floor(i/sub_l)][Math.floor(j/sub_h)][puzzle[j][i]-1] = 1;
			}
			c_grid[i][j] = {};
		}
	}

	// Fill c_grid from sets
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			for(k=0;k<grid_l;k++){
				if(col_set[i][k] != 1 && row_set[j][k] != 1 && sub_set[Math.floor(i/sub_l)][Math.floor(j/sub_h)][k] != 1){
					c_grid[i][j][k] = 1;
				}
			}
		}
	}

	// Testing
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			console.log(c_grid[i][j]);
		}
	}
}

function isSolved(){
	for(x=0;x<grid_l;x++){
		if(row_set[x])
	}
}

function writeSolution(y){
}

//// P5 ////
function setup() {
  createCanvas(worldX, worldY);
  frameRate(10);
}

function draw(){
	background(20);
	
	// Print grid	
	textSize(gFontSize);
	fill(borderColour[0], borderColour[1], borderColour[2]);
	stroke(borderColour[0], borderColour[1], borderColour[2]);
	for(i=0;i<=grid_l;i++){
		line((i*gTileSize)+gOffsetX,gOffsetY,(i*gTileSize)+gOffsetX,gTileSize*9+gOffsetY);
		line(gOffsetX,i*gTileSize+gOffsetY,gTileSize*9+gOffsetX,i*gTileSize+gOffsetY);
	}
	fill(borderColour[0], borderColour[1], borderColour[2]);
	stroke(borderColour[0], borderColour[1], borderColour[2]);
	for(i=0;i<4;i++){
		line((i*3*gTileSize-1)+gOffsetX,gOffsetY-1,(i*3*gTileSize)+gOffsetX-1,gTileSize*9+gOffsetY+1);
		line((i*3*gTileSize+1)+gOffsetX,gOffsetY-1,(i*3*gTileSize)+gOffsetX+1,gTileSize*9+gOffsetY+1);
		line(gOffsetX-1,i*3*gTileSize+gOffsetY-1,gTileSize*9+gOffsetX+1,i*3*gTileSize+gOffsetY-1);
		line(gOffsetX-1,i*3*gTileSize+gOffsetY+1,gTileSize*9+gOffsetX+1,i*3*gTileSize+gOffsetY+1);
	}
	
	// Print values
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			text(m_grid[i][j], (i*gTileSize)+gFontOffsetX+gOffsetX,j*gTileSize+gFontOffsetY+gOffsetY);
		}
	}

	// Print sets
	textSize(rcsFontSize);
	fill(setColourA[0], setColourA[1], setColourA[2]);
	stroke(setColourA[0], setColourA[1], setColourA[2]);
	var rowCount = 0;
	var colCount = 0;
	var subCount = 0;
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			if(row_set[i][j] != 1){
				text(j+1, 9*gTileSize+rOffset+(rowCount*rSize), (i*gTileSize)+gFontOffsetY+gOffsetY+rFontY);
				rowCount++;
			}
			if(col_set[i][j] != 1){
				text(j+1, (i*gTileSize)+gFontOffsetX+gOffsetX+cFontX, 9*gTileSize+cOffset+(colCount*cSize));
				colCount++;
			}
		}
		rowCount = 0;
		colCount = 0;
	}
	fill(setColourB[0], setColourB[1], setColourB[2]);
	stroke(setColourB[0], setColourB[1], setColourB[2]);
	for(i=0;i<sub_l;i++){
		for(j=0;j<sub_h;j++){
			for(k=0;k<grid_l;k++){
				if(sub_set[i][j][k] != 1){
					text(	k+1, 
							sTopX+((subCount%sub_l)*(sSize+sSpaceX))+(i*3*(sSize+sGapX)), 
							sTopY+(Math.floor(subCount/sub_h)*(sSize+sSpaceY))+(j*3*(sSize+sGapY)));
					subCount++;
				}
			}
			subCount = 0;
		}
	}
}

init();