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
// Puzzle sizes
var grid_l = 9;
var sub_l = 3;
var sub_h = 3;
var solvedCount = 0;
// Colours
var borderColour = [Math.random()*255, Math.random()*255, Math.random()*255];
var puzzleColour = [Math.random()*255, Math.random()*255, Math.random()*255];
var setColourA = [Math.random()*255, Math.random()*255, Math.random()*255];
var setColourB = [Math.random()*255, Math.random()*255, Math.random()*255];
// Grids and sets
var puzzle;
var m_grid,c_grid,col_set,row_set,sub_set;
var begin;
var complete;

// FUNCTIONS ////
function init(){
	puzzle = [
		// "050790214",
		// "030010090",
		// "200004007",
		// "026509000",
		// "500030009",
		// "000208140",
		// "900400008",
		// "010070030",
		// "742085060"
		// ];

		// "006291700",
		// "010705060",
		// "003040500",
		// "270000014",
		// "000000000",
		// "640000058",
		// "008050400",
		// "030402090",
		// "004379200"
		// ];

		"400700900",
		"000004000",
		"070280006",
		"500000010",
		"301060408",
		"020000009",
		"900036020",
		"000800000",
		"004001003"
	];
	m_grid = new Array(grid_l);
	c_grid = new Array(grid_l);
	col_set = new Array(grid_l);
	row_set = new Array(grid_l);
	sub_set = new Array(sub_l);
	begin=false;
	complete=false;
	
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
				solvedCount++;
			}
			c_grid[i][j] = {};
			c_grid[i][j].len = 0;
		}
	}

	// Fill c_grid from sets
	for(i=0;i<grid_l;i++){
		for(j=0;j<grid_l;j++){
			if(m_grid[i][j] != 0){
				continue;
			}
			for(k=0;k<grid_l;k++){
				if(col_set[i][k] != 1 && row_set[j][k] != 1 && sub_set[Math.floor(i/sub_l)][Math.floor(j/sub_h)][k] != 1){
					if(c_grid[i][j][k] != 1){
						c_grid[i][j][k] = 1;
						c_grid[i][j].len++;
					}
				}
			}
		}
	}
}

// Iterates through rows, cols and subgrids
function iterator(func, args){
	for(i=0;i<grid_l;i++){
		func([0,grid_l], [i,i+1], args[0]);
		func([i,i+1], [0,grid_l], args[0]);
	}
	
	for(i=0;i<sub_l;i++){
		for(j=0;j<3;j++){
			func([j*sub_l,(j*sub_l)+sub_l],
				[i*sub_h,(i*sub_h)+sub_h],args[0]);
		}
	}
}

// Remove candidates via disjoint subsets method
function disjointSubsets(x,y,n){
	var sets = [];
	var i,j,k;
	
	// Go through all squares in a row/col/sub, and  
	// check if has 1 > candidates >= n;
	for(i=x[0];i<x[1];i++){
		for(j=y[0];j<y[1];j++){
			if(c_grid[i][j].len > 1 && c_grid[i][j].len <= n){
				sets.push([c_grid[i][j],i,j]);
			}
		}
	}
		
	// Get all combinations
	var inds = [];
	for(i=0;i<sets.length;i++){
		inds.push(i);
	}
	var combs = combinations(inds, n);
	// For each combination
	for(i=0;i<combs.length;i++){
		var s_set = {};
		// Get superset of values
		for(j=0;j<n;j++){
			for(var a in sets[combs[i][j]][0]){
				s_set[a] = sets[combs[i][j]][0][a];
			}
			delete s_set["len"];
		}
		var count = 0;
		for(var a in s_set){
			count++;
		}
		// If count is n, then disjoint subset
		if(count==n){
			for(j=0;j<n;j++){
			}
			// Remove candidates from remaining squares
			for(j=x[0];j<x[1];j++){
				for(k=y[0];k<y[1];k++){
					var skip=false;
					var count = 0;
					for(m=0;m<n;m++){
						if(j==sets[combs[i][m]][1] && k==sets[combs[i][m]][2]){
							skip=true;
							count++;
						}
					}
					if(!skip){
						for(var a in s_set){
							if(c_grid[j][k][a] == 1){
								delete c_grid[j][k][a];
								c_grid[j][k].len--;
							}							
						}
					}
				}
			}
		}
	}
}

function writeSolution(j){
	for(i=0;i<grid_l;i++){
		if(c_grid[i][j].len == 1){
			var solution = parseInt(Object.keys(c_grid[i][j])[0]);
			var x = (Math.floor(i/sub_l)) * sub_l;
			var y = (Math.floor(j/sub_h)) * sub_h;
			m_grid[i][j] = solution+1;
			delete c_grid[i][j][solution];
			c_grid[i][j].len--;
			row_set[j][solution] = 1;
			col_set[i][solution] = 1;
			sub_set[Math.floor(i/sub_l)][Math.floor(j/sub_h)][solution] = 1;
			delete c_grid[i][j][solution];
			solvedCount++;
			
			for(ci=x;ci<x+sub_l;ci++){
				for(cj=y;cj<y+sub_h;cj++){
					if(c_grid[ci][cj][solution] == 1){
						delete c_grid[ci][cj][solution];
						c_grid[ci][cj].len--;
					}
				}
			}
			
			for(ci=0;ci<grid_l;ci++){
				if(c_grid[i][ci][solution] == 1){
					delete c_grid[i][ci][solution];
					c_grid[i][ci].len--;
				}
				if(c_grid[ci][j][solution] == 1){
					delete c_grid[ci][j][solution];
					c_grid[ci][j].len--;
				}
			}
		}
	}
}

// Rosettacode.org
function combinations(arr, k){
	var i,subI,sub,next,ret = [];
	for(i=0;i<arr.length;i++){
		if(k===1){
			ret.push([arr[i]]);
		}else{
			sub=combinations(arr.slice(i+1,arr.length),k-1);
			for(subI=0;subI<sub.length;subI++){
				next=sub[subI];
				next.unshift(arr[i]);
				ret.push(next);
			}
		}
	}
	return ret;
}

function mouseClicked(){
	if(mouseX >= 30 && mouseX < 75){
		if(mouseY >= 5 && mouseY < 23){
			begin=true;
		}
	}
	if(mouseX >= 95 && mouseX < 253){
		if(mouseY >= 5 && mouseY < 23){
			randomizeColours();
		}
	}
	if(mouseX >= 273 && mouseX < 383){
		if(mouseY >= 5 && mouseY < 23){
			resetPuzzle();
		}
	}
}

function resetPuzzle(){
	init();
}

function randomizeColours(){
	for(i=0;i<3;i++){
		borderColour[i]=Math.random()*255;
		setColourA[i]=Math.random()*255;
		setColourB[i]=Math.random()*255;
		
	}
}

function getRandomColour(){
	var colours=[];
	for(i=0;i<3;i++){
		colours[i]=Math.random()*255;
		colours[i]=Math.random()*255;
		colours[i]=Math.random()*255;
	}
	return colours;
}

var solCount = 0;
var djCount = 2;
function compute(){
	writeSolution(solCount);
	solCount++;
	if(solCount == grid_l){
		solCount = 0;
	}
	iterator(disjointSubsets,[djCount]);
	djCount++;
	if(djCount == 6){
		djCount = 2;
	}
}

//// P5 ////
function setup() {
  createCanvas(worldX, worldY);
  frameRate(25);
}

function draw(){
	background(20);
	
	// Print grid	
	textSize(gFontSize);
	fill(borderColour);
	stroke(borderColour);
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
	fill(setColourA);
	stroke(setColourA);
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
	fill(setColourB);
	stroke(setColourB);
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
	
	// Text
	fill(255);
	stroke(setColourB);
	textSize(18);
	text("Begin", gOffsetX,20);
	text("Randomize Colours", gOffsetX+65,20);
	text("Reset Puzzle", gOffsetX+245,20);
	// Check complete
	if(begin){
		compute();
		if(solvedCount == 81){
			complete=true;
			begin=false;
		}
	}
	if(complete){
		text("FINITO", 500, 500);
	}
}

init();