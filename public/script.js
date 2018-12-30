const game = new Chess();

// evaluate current chess board, return board value relative to player
const evaluateBoard = function(board, color) {
  // sets the value for each piece
  const pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  }

  // loop through the board and get the total value
  let val = 0
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if(piece) {
        // subtract piece value if it's opponent's piece
        val += pieceValue[piece['type']] * (piece['color'] == color ? 1 : -1);
      }
    })
  })
  return val;
}

// calculate the best move using Minimax with Alpha Beta pruning
const calculateBestMove = function(game, playerColor, alpha=Number.NEGATIVE_INFINITY, beta=Number.POSITIVE_INFINITY, isMaximizing=true, depth=3) {
  // base case
  if(depth == 0) {
    val = evaluateBoard(game.board(), playerColor);
    return [val, null]
  }

  // recursive case to search possible moves
  let bestMove = null;
  let possibleMoves = game.moves();
  // sort the order randomly
  possibleMoves.sort(() => Math.random() - 0.5);
  // set a default value for best move's value
  let bestMoveVal = isMaximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  // search through all possible moves
  for(let i = 0; i < possibleMoves.length; i++) {
    let move = possibleMoves[i];
    // make the move but undo it before exiting
    game.move(move);
    // recursively get the value from this move
    val = calculateBestMove(game, playerColor, alpha, beta, !isMaximizing, depth-1)[0];
    // log the value of this move
    console.log(isMaximizing ? 'Max: ' : 'Min: ', depth, move, val, bestMove, bestMoveVal);

    if(isMaximizing) {
      // search for move that maximize value
      if(val > bestMoveVal) {
        bestMoveVal = val;
        bestMove = move;
      }
      alpha = Math.max(alpha, val)
    } else {
      // search for the move that minimize value
      if(val < bestMoveVal) {
        bestMoveVal = val;
        bestMove = move;
      }
      beta = Math.min(beta, val);
    }
    // undo this move and keep searching
    game.undo();
    // check for alpha beta pruning
    if(beta <= alpha) {
      console.log('Prune: ', alpha, beta);
      break;
    }
  }
  return [bestMoveVal, bestMove || possibleMoves[0]]
}



const makeMove = function() {
  // exit if the game is over
  if(game.game_over()){
    alert('game over');
    return;
  }

  // calculate the best move
  let move = calculateBestMove(game, game.turn())[1];
  game.move(move);
  // update board positions
  board.position(game.fen());
}

// evaluate the board after a move is being made
const onMoveEnd = function(oldPos, newPos) {
  if(game.game_over()) {
    alert('Game Over')
  }
}



var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function(source, target) {
  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  // make move for black
  window.setTimeout(function() {
    makeMove();
  }, 250);
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onMoveEnd: onMoveEnd,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
