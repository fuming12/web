    var grid = document.getElementById("grid");
    var testMode = false; 
    var gameLevel = 1;
    var row = 10; 
    var col = 10; 
    var colNumber = 10;
    var rowNumber = 10;
    var maxCount = 10; 
    var isFirstOpen = true; 
    var grid = init_grid(); 
    var count = document.getElementById('count'); 
    count.innerHTML = maxCount; 
    var time = document.getElementById('time'); 
    var timer = setInterval(function () {
      let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); 
      time.innerHTML = seconds;
    }, 100)
    generateGrid();
    
    function generateGrid() {
        //generate row*col grid
        grid.innerHTML = "";
        for (var i = 0; i < rowNumber; i++) {
            row = grid.insertRow(i);
            for (var j = 0; j < colNumber; j++) {
                cell = row.insertCell(j);
                cell.onclick = function() {
                    clickCell(this);
                };
                var mine = document.createAttribute("data-mine");
                mine.value = "false";
                cell.setAttributeNode(mine);
            }
        }
        addMines();
    }
    
    function addMines() {
        //Add mines randomly
        for (var i = 0; i < gameLevel * 10; i++) {
            var row = Math.floor(Math.random() * rowNumber);
            var col = Math.floor(Math.random() * colNumber);
            var cell = grid.rows[row].cells[col];
            cell.setAttribute("data-mine", "true");
            if (testMode) cell.innerHTML = "X";
        }
    }
    
    function init_grid() {
      let gridHtml = '';
      for (let i = 0; i < row; i++) {
        gridHtml += '<tr>'
        for (let j = 0; j < col; j++) {
          gridHtml +=
            '<td><span class="blocks" onmousedown="block_click(' + i + ',' + j + ',event)"></span></td>';
        }
        gridHtml += '<tr>'
      }
      document.getElementById('grid').innerHTML = gridHtml;
      let blocks = document.getElementsByClassName('blocks');
      let grid = new Array();
      for (let i = 0; i < blocks.length; i++) {
        if (i % col === 0) {
          grid.push(new Array());
        }
        blocks[i].count = 0;
        grid[parseInt(i / col)].push(blocks[i]);
      }
      return grid;
    }
    function block_click(_i, _j, e) {
      if (grid[_i][_j].isOpen) {
        return;
      }
      if (e.button === 0) {
        if (isFirstOpen) {
          isFirstOpen = false;
          let count = 0; 
          while (count < maxCount) {
            let ri = Math.floor(Math.random() * row);
            let rj = Math.floor(Math.random() * col);
            if (!(ri === _i && rj === _j) && !grid[ri][rj].isMine) {
              grid[ri][rj].isMine = true; 
              count++; 
              for (let i = ri - 1; i < ri + 2; i++) {
                for (let j = rj - 1; j < rj + 2; j++) {
                  if (i > -1 && j > -1 && i < row && j < col) {
                    grid[i][j].count++;
                  }
                }
              }
            }
          }
        }
        block_open(_i, _j);
        function block_open(_i, _j) {

          let block = grid[_i][_j];
          op(block);
          function op(block) {
            block.isOpen = true; 
            block.style.background = '#ccc'; 
            block.style.cursor = 'default'; 
          }


          if (block.isMine) {
            block.innerHTML = '???'; 
            for (let i = 0; i < row; i++) {
              for (let j = 0; j < col; j++) {
                block = grid[i][j];
                if (!block.isOpen && block.isMine) {
                  op(block); 
                  block.innerHTML = '???'; 
                }
              }
            }
            clearInterval(timer);
            alert("????????????");
          } else if (block.count === 0) {
            for (let i = _i - 1; i < _i + 2; i++) {
              for (let j = _j - 1; j < _j + 2; j++) {
                if (i > -1 && j > -1 && i < row && j < col && !grid[i][j].isOpen && !grid[i][j].ismine) {
                  block_open(i, j);
                }
              }
            }
          } else {
            block.innerHTML = block.count; 
          }

        }
      }
      else if (e.button === 2) {

        let block = grid[_i][_j];
        if (block.innerHTML !== '???') {
          block.innerHTML = '???';
          count.innerHTML = parseInt(count.innerHTML) - 1;
        } else {
          block.innerHTML = '';
          count.innerHTML = parseInt(count.innerHTML) + 1;
        }
      }
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          if (!grid[i][j].isMine && !grid[i][j].isOpen) {
            return;
          }
        }
      }
      clearInterval(timer);
      alert("????????????");
    }