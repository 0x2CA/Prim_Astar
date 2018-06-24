var canvas = document.querySelector('#_canvas');
var number = 51;
var width = parseInt(600 / number) * number;
window.openlist = [];
window.closelist = [];
init();
var end = window.canvas_context.start_node;
setInterval(draw, 1000 / 60);

function findnode(list, node) {
	for(var i in list) {
		if(list[i].x == node.x && list[i].y == node.y) {
			return i;
		}
	}
	return -1;
}

function open_node(prev, box_width, end_node) {
	end = prev;
	if(prev.type != 'start') {
		prev.type = 'close';
	}
	window.closelist.splice(0, 0, prev);
	window.openlist.splice(findnode(window.openlist, prev), 1);
	if(!(prev.x == window.canvas_context.start_node.x && prev.y == window.canvas_context.start_node.y)) {
		window.canvas_context.data[prev.x / window.canvas_context.box_width][prev.y / window.canvas_context.box_width] = prev;
	}
	var x = [];
	var y = [];
	x[0] = prev.x;
	y[0] = prev.y;
	if(prev.x - box_width >= 0) {
		x.splice(0, 0, (prev.x - box_width));
	}
	if(prev.y - box_width >= 0) {
		y.splice(0, 0, (prev.y - box_width));
	}
	if(prev.x + box_width <= end_node.x) {
		x.splice(0, 0, prev.x + box_width);
	}
	if(prev.y + box_width <= end_node.y) {
		y.splice(0, 0, prev.y + box_width);
	}
	for(var _x in x) {
		for(var _y in y) {
			//禁止对角（斜线）
			if(x[_x] != prev.x && y[_y] != prev.y) {
				continue;
			}
			if(findnode(window.closelist, {
					'x': x[_x],
					'y': y[_y]
				}) == -1) {
				var i = findnode(window.openlist, {
					'x': x[_x],
					'y': y[_y]
				});
				if(i == -1) {
					window.openlist.splice(0, 0, {
						'x': x[_x],
						'y': y[_y],
						type: 'open',
						'prev': prev
					});
					if(window.openlist[0].x == prev.x || window.openlist[0].y == prev.y) {
						window.openlist[0].G = prev.G + box_width;
						window.openlist[0].F = F(x[_x], y[_y], window.openlist[0].G, end_node);
					} else {
						window.openlist[0].G = prev.G + box_width * Math.sqrt(2);
						window.openlist[0].F = F(x[_x], y[_y], window.openlist[0].G, end_node);
					}
					if(!(window.openlist[0].x == window.canvas_context.end_node.x && window.openlist[0].y == window.canvas_context.end_node.y)) {
						window.canvas_context.data[window.openlist[0].x / window.canvas_context.box_width][window.openlist[0].y / window.canvas_context.box_width] = window.openlist[0];
					}
				} else {
					var node = {
						'x': x[_x],
						'y': y[_y],
						type: 'open',
						'prev': prev
					};
					if(node.x == prev.x || node.y == prev.y) {
						node.G = prev.G + box_width;
						node.F = F(x[_x], y[_y], node.G, end_node);
					} else {
						node.G = prev.G + box_width * Math.sqrt(2);
						node.F = F(x[_x], y[_y], node.G, end_node);
					}
					if(window.openlist[i].G > node.G) {
						window.openlist.splice(i, 1, node);
						if(!(window.openlist[i].x == window.canvas_context.end_node.x && window.openlist[i].y == window.canvas_context.end_node.y)) {
							window.canvas_context.data[window.openlist[i].x / window.canvas_context.box_width][window.openlist[i].y / window.canvas_context.box_width] = node;

						}
					}
				}
			}

		}
	}
}

function isV(list) {
	if(list.length > 0) {
		return true;
	} else {
		return false;
	}
}

function find_F_min() {
	if(window.openlist.length == 0) {
		return -1;
	}
	var min = window.openlist[0].F;
	var i = 0;
	for(var list in window.openlist) {
		if(min > window.openlist[list].F) {
			i = list;
			min = window.openlist[list].F;
		}
	}
	return i;
}

function F(x, y, G, end_node) {
	return Math.sqrt((end_node.x - x) * (end_node.x - x) + (end_node.y - y) * (end_node.y - y)) + G;
}

function isend() {
	if(window.openlist.length == 0) {
		return true;
	}
	if(findnode(window.openlist, window.canvas_context.end_node) != -1) {
		return true;
	}
	return false;
}

function init() {
	canvas.width = width;
	canvas.height = width;
	window.canvas_context = canvas.getContext('2d');
	window.canvas_context.isV = [];
	window.canvas_context.willV = [];
	window.canvas_context.box_width = width / number;
	//window.canvas_context.fillStyle = "#faebd7";
	window.canvas_context.data = [];
	for(var x = 0; x < width; x += window.canvas_context.box_width) {
		window.canvas_context.data[x / window.canvas_context.box_width] = [];
		for(var y = 0; y < width; y += window.canvas_context.box_width) {
			if((x / window.canvas_context.box_width) % 2 == 1 && (y / window.canvas_context.box_width) % 2 == 1) {
				window.canvas_context.data[x / window.canvas_context.box_width][y / window.canvas_context.box_width] = {
					'x': x,
					'y': y,
					type: 'node',
					prev: null,
					isV: false
				};
				window.canvas_context.willV.splice(0, 0, {
					'x': x,
					'y': y,
					type: 'node',
					prev: null,
					isV: false
				});
				window.canvas_context.fillStyle = "white";
			} else {
				window.canvas_context.data[x / window.canvas_context.box_width][y / window.canvas_context.box_width] = {
					'x': x,
					'y': y,
					type: 'wall',
					prev: null
				};
				window.canvas_context.fillStyle = "black";
			}
			window.canvas_context.fillRect(x, y, window.canvas_context.box_width, window.canvas_context.box_width);
			//			window.canvas_context.fillRect(x, y, window.canvas_context.box_width, window.canvas_context.box_width);
			//			window.canvas_context.fillStyle = window.canvas_context.fillStyle == "#faebd7" ? "#aaa" : "#faebd7";
		}
		//window.canvas_context.fillStyle = window.canvas_context.fillStyle == "#faebd7" ? "#aaa" : "#faebd7";
	}
	window.canvas_context.start_node = {
		'x': window.canvas_context.box_width,
		'y': window.canvas_context.box_width,
		prev: null,
		type: 'start',
		'G': 0,
		isV: false
	};
	window.canvas_context.data[1][1] = window.canvas_context.start_node;
	window.canvas_context.end_node = {
		'x': width - 2 * window.canvas_context.box_width,
		'y': width - 2 * window.canvas_context.box_width,
		prev: null,
		type: 'end',
		isV: false
	};
	window.canvas_context.data[number - 2][number - 2] = window.canvas_context.end_node;
	var V = window.canvas_context.start_node;
	//	!isV(window.canvas_context.data)
	var n;
	window.id01 = setInterval(function(id) {
		if(isV(window.canvas_context.willV)) {
			var _tmp = [];
			V.isV = true;
			window.canvas_context.data[V.x / window.canvas_context.box_width][V.y / window.canvas_context.box_width] = V;
			var wei = findnode(window.canvas_context.willV, V);
			if(wei >= 0) {
				window.canvas_context.willV.splice(wei, 1);
				window.canvas_context.isV.splice(0, 0, V);
			}
			if((V.x - 2 * window.canvas_context.box_width) >= 0) {
				if(window.canvas_context.data[(V.x - 2 * window.canvas_context.box_width) / window.canvas_context.box_width][V.y / window.canvas_context.box_width].isV == false) {
					_tmp.splice(0, 0, window.canvas_context.data[(V.x - 2 * window.canvas_context.box_width) / window.canvas_context.box_width][V.y / window.canvas_context.box_width]);

				}

			}
			if((V.y - 2 * window.canvas_context.box_width) >= 0) {
				if(window.canvas_context.data[V.x / window.canvas_context.box_width][(V.y - 2 * window.canvas_context.box_width) / window.canvas_context.box_width].isV == false) {
					_tmp.splice(0, 0, window.canvas_context.data[V.x / window.canvas_context.box_width][(V.y - 2 * window.canvas_context.box_width) / window.canvas_context.box_width]);
				}
			}
			if((V.x + 2 * window.canvas_context.box_width) <= window.canvas_context.end_node.x) {
				//			console.log(window.canvas_context.data[(willV[n].x + 2 * window.canvas_context.box_width) / window.canvas_context.box_width][willV[n].y])
				if(window.canvas_context.data[(V.x + 2 * window.canvas_context.box_width) / window.canvas_context.box_width][V.y / window.canvas_context.box_width].isV == false) {
					_tmp.splice(0, 0, window.canvas_context.data[(V.x + 2 * window.canvas_context.box_width) / window.canvas_context.box_width][V.y / window.canvas_context.box_width]);
				}
			}
			if((V.y + 2 * window.canvas_context.box_width) <= window.canvas_context.end_node.y) {
				if(window.canvas_context.data[V.x / window.canvas_context.box_width][(V.y + 2 * window.canvas_context.box_width) / window.canvas_context.box_width].isV == false) {
					_tmp.splice(0, 0, window.canvas_context.data[V.x / window.canvas_context.box_width][(V.y + 2 * window.canvas_context.box_width) / window.canvas_context.box_width]);

				}
			}
			if(_tmp.length == 0) {
				window.canvas_context.isV.splice(findnode(window.canvas_context.isV, V), 1);
				V = window.canvas_context.isV[Math.floor(Math.random() * window.canvas_context.isV.length)];
				return;
			}
			var nextV = _tmp[Math.floor(Math.random() * _tmp.length)];
			window.canvas_context.data[(V.x + (nextV.x - V.x) / 2) / window.canvas_context.box_width][(V.y + (nextV.y - V.y) / 2) / window.canvas_context.box_width].type = 'node';
			window.canvas_context.fillStyle = "white";
			window.canvas_context.fillRect((V.x + (nextV.x - V.x) / 2), V.y + (nextV.y - V.y) / 2, window.canvas_context.box_width, window.canvas_context.box_width);
			V = nextV;
		} else {
			for(var i in window.canvas_context.data) {
				for(var j in window.canvas_context.data[i]) {
					if(window.canvas_context.data[i][j].type == 'wall') {
						window.closelist.splice(0, 0, window.canvas_context.data[i][j]);
					}
				}
			}
			document.querySelector('#status').style.display = 'block';
			document.querySelector('#ps').style.display = 'none';
			window.clearInterval(window.id01);
		}
	}, 1);
	//	window.closelist.splice(findnode(window.closelist, window.canvas_context.start_node), 1);
	//	window.closelist.splice(findnode(window.closelist, window.canvas_context.end_node), 1);
	window.canvas_context.fillStyle = "royalblue";
	window.canvas_context.fillRect(window.canvas_context.start_node.x, window.canvas_context.start_node.y, window.canvas_context.box_width, window.canvas_context.box_width);
	window.canvas_context.fillRect(window.canvas_context.end_node.x, window.canvas_context.end_node.y, window.canvas_context.box_width, window.canvas_context.box_width);
	//	window.canvas_context.fillStyle = "white";
	//	window.canvas_context.fillRect(window.canvas_context.start_node.x + window.canvas_context.box_width, window.canvas_context.start_node.y, window.canvas_context.box_width, window.canvas_context.box_width);
	//	window.canvas_context.fillRect(window.canvas_context.end_node.x - window.canvas_context.box_width, window.canvas_context.end_node.y, window.canvas_context.box_width, window.canvas_context.box_width);
}

function draw() {
	window.canvas_context.clearRect(0, 0, window.canvas_context.end_node.x + 2 * window.canvas_context.box_width, window.canvas_context.end_node.y + 2 * window.canvas_context.box_width);
	window.canvas_context.beginPath();
	for(var i in window.canvas_context.data) {
		for(var j in window.canvas_context.data[i]) {
			//console.log(window.canvas_context.data[i][j].type)
			if(window.canvas_context.data[i][j].type == 'start') {
				window.canvas_context.fillStyle = "royalblue";
			} else if(window.canvas_context.data[i][j].type == 'end') {
				window.canvas_context.fillStyle = "royalblue";
			} else if(window.canvas_context.data[i][j].type == 'node') {
				window.canvas_context.fillStyle = "white";
			} else if(window.canvas_context.data[i][j].type == 'wall') {
				window.canvas_context.fillStyle = "black";
			} else if(window.canvas_context.data[i][j].type == 'open') {
				window.canvas_context.fillStyle = "coral";
			} else if(window.canvas_context.data[i][j].type == 'close') {
				window.canvas_context.fillStyle = "#008B8B";
			}
			window.canvas_context.fillRect(window.canvas_context.data[i][j].x, window.canvas_context.data[i][j].y, window.canvas_context.box_width, window.canvas_context.box_width);

		}
	}
	for(var tmp = end; tmp.prev != null; tmp = tmp.prev) {
		window.canvas_context.fillStyle = "crimson";
		window.canvas_context.fillRect(tmp.x, tmp.y, window.canvas_context.box_width, window.canvas_context.box_width);

	}
	//	window.requestAnimationFrame(draw);
}
//
//function sleep(n) {
//	start = new Date().getTime();
//	while(true) {
//		if(new Date().getTime() - start >= n) {
//			break;
//		}
//	}
//}
window.onload = function() {
	//	canvas.addEventListener('click', function(e) {
	//		var rect = canvas.getBoundingClientRect();
	//		//		console.log(window.canvas_context.getImageData(e.clientX - rect.left,e.clientY - rect.top,1,1))
	//		var x = parseInt((e.clientX - rect.left) / window.canvas_context.box_width) * window.canvas_context.box_width;
	//		var y = parseInt((e.clientY - rect.top) / window.canvas_context.box_width) * window.canvas_context.box_width;
	//		if(findnode(window.closelist, {
	//				'x': x,
	//				'y': y
	//			}) == -1) {
	//			if(!(window.canvas_context.start_node.x == x && window.canvas_context.start_node.y == y) && !(window.canvas_context.end_node.x == x && window.canvas_context.end_node.y == y)) {
	//				window.canvas_context.fillStyle = "slateblue";
	//				window.canvas_context.fillRect(x, y, window.canvas_context.box_width, window.canvas_context.box_width);
	//				window.closelist.splice(0, 0, {
	//					'x': x,
	//					'y': y,
	//					prev: null,
	//					type: 'wall'
	//				});
	//			}
	//		}
	//	});
	document.querySelector('#status').style.display='none';
	document.querySelector('#T').style.height = window.innerHeight / 6 + 'px';
	document.querySelector('#T').style.height = window.innerHeight / 6 + 'px';
	document.querySelector('h1').style.height = window.innerHeight * 2 / 18 + 'px';
	document.querySelector('#list').style.marginTop = window.innerHeight / 36 - 18 + 'px';
	document.querySelector('h1').style.lineHeight = window.innerHeight * 2 / 18 + 'px';
	document.querySelector('#B').style.height = window.innerHeight * 5 / 6 + 'px';
	document.querySelector('#_canvas').style.marginLeft = 'calc(50% - ' + width / 2 + 'px)';
	document.querySelector('#status').style.marginTop = window.innerHeight / 24 + 'px';
	document.querySelector('#ps').style.marginTop = window.innerHeight / 24 + 'px';
	window.onresize = function() {
		document.querySelector('#T').style.height = window.innerHeight / 6 + 'px';
		document.querySelector('#T').style.height = window.innerHeight / 6 + 'px';
		document.querySelector('h1').style.height = window.innerHeight * 2 / 18 + 'px';
		document.querySelector('#list').style.marginTop = window.innerHeight / 36 - 18 + 'px';
		document.querySelector('h1').style.lineHeight = window.innerHeight * 2 / 18 + 'px';
		document.querySelector('#B').style.height = window.innerHeight * 5 / 6 + 'px';
		document.querySelector('#_canvas').style.marginLeft = 'calc(50% - ' + width / 2 + 'px)';
		document.querySelector('#status').style.marginTop = window.innerHeight / 24 + 'px';
		document.querySelector('#ps').style.marginTop = window.innerHeight / 24 + 'px';
	};
	document.querySelector('#status').addEventListener('click', function() {
		if(document.querySelector('#status').innerHTML == '重置') {
			document.querySelector('#status').style.display = 'none';
			document.querySelector('#ps').style.display = 'block';
			window.clearInterval(window.id02);
			//			window.clearInterval(window.id01);
			window.canvas_context.clearRect(0, 0, window.canvas_context.end_node.x + 2 * window.canvas_context.box_width, window.canvas_context.end_node.y + 2 * window.canvas_context.box_width);
			window.canvas_context.beginPath();
			window.openlist = [];
			window.closelist = [];
			init();
			end = window.canvas_context.start_node;
			document.querySelector('#status').innerHTML = '开始';
		} else {
			open_node(window.canvas_context.start_node, window.canvas_context.box_width, window.canvas_context.end_node);
			//setInterval(draw, 1000 / 60)
			window.id02 = setInterval(function() {
				if(!isend()) {
					open_node(window.openlist[find_F_min(window.openlist)], window.canvas_context.box_width, window.canvas_context.end_node);
				} else {
					window.clearInterval(window.id02);
				}
			}, 1000 / 60);
			document.querySelector('#status').style.display = 'block';
			document.querySelector('#ps').style.display = 'none';
			document.querySelector('#status').innerHTML = '重置';
		}

	});
};