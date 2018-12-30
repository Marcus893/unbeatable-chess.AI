# unbeatable-chess.AI

[Play it live here!](https://chess1-ai.herokuapp.com/)

## Project Overview
A chess game built with Minimax algorithm and Alpha Beta Pruning optimization

## Tech/framework used

- JavaScript
- Node.js
- JQuery
- HTML/CSS

## Features

- Basic logic is to direct the computer player to achieve maximum weights for itself and minimizes the total weights of the opponent by using Minimax algorithm. For every move the computer is going to loop through the entire board, calculate the weights for every potential move every piece can achieve to pick the move that maximizes it's total weights(ex. get a piece into a position that threatens an opponent's piece without endangering itself); in the mean time, do the same calculation for the opponent but pick the move that's going to have the maximum negative impact for him(ex. capture an opponent's piece).

![chess1](https://user-images.githubusercontent.com/38970716/50548479-36875580-0c1b-11e9-8f2b-5dbe6fbd4ba5.gif)

- The search depth is default to 3, that means for every move the computer is going to loop through the board three times in a recursive fashion to foresee three steps ahead and make the best move. Testing has shown that depth beyond 3 will make the calculation extremely slow due to the process is exponential in nature

![peek 2018-12-30 09-25](https://user-images.githubusercontent.com/38970716/50548637-13aa7080-0c1e-11e9-86b7-5a06ee8b78cd.gif)

- Other features including applying Alpha Beta Pruning technique to optimize the runtime of the algorithm. As well as using JQuery and Css to style the potential moves of a piece when the cursor hover over it. 

## Code Showcase

- Main logic of the game

```Javascript 
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
```

- JQuery to create special mouseover effect

```Javascript
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
```


## Environment

Server side built with Express, deployed to Heroku
