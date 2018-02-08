var keypress = require('keypress');
var config = require("./config.json");

const gridSize = config.gridSize;
const gameStages = config.gameStages;
const gameMessages = config.gameMessages;

var matrix = [];
var emptySpaces = [];
var gameStage = gameStages.init;

function initiateIO() {
    keypress(process.stdin);
    process.stdin.on('keypress', processKeyStroke);
    process.stdin.setRawMode(true);
    process.stdin.resume();
}

function processKeyStroke(ch, key) {

    if (!key) {
        return;
    }

    switch (key.name) {
        case 'left':
        case 'right':
        case 'up':
        case 'down':
            moveGridInDir(key.name);
            var emptySpaceFilled = fillEmptySpace();
            if (!emptySpaceFilled) {
                displayLostMsg();
            }
            displayGrid();
            break;
        case 'c':
            if (key.ctrl) {
                process.stdin.pause();
            }
            break;
    }
}

function displayInitMessage() {
    console.log(gameMessages.welcome);
    console.log(gameMessages.goal);
}

function displayLostMsg() {
    console.log(gameMessages.gameOver);
    process.exit();
}

function moveGridInDir(key) {

    switch (key) {
        case 'left':
            moveGridToLeft();
            break;
        case 'right':
            moveGridToRight();
            break;
        case 'up':
            moveGridUp();
            break;
        case 'down':
            moveGridDown();
            break;
    }

}

function initiateMatrix(size) {
    var array = [];

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            array[j] = new Array(gridSize);
        }
    }

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            array[i][j] = config.emptySymbol;
        }
    }

    return array;
}

function displayGrid() {
    // process.stdout.write("\u001B[2J\u001B[0;0f");
    // console.clear();
    console.log('\033c');
    displayInitMessage();
    console.log(matrix.join("\n\n"));

}

function bootstrap() {
    gameStage = gameStages.init;
    matrix = initiateMatrix(gridSize);

    emptySpaces = recordEmptySpaces();

    //console.log(emptySpaces);

    var randomPosition = randomIntGenerator(0, emptySpaces.length - 1);
    var position1 = emptySpaces[randomPosition];
    console.log(position1);
    emptySpaces.splice(randomPosition, 1);

    randomPosition = randomIntGenerator(0, emptySpaces.length - 1);
    var position2 = emptySpaces[randomPosition];

    matrix[position1.l][position1.b] = 2;
    matrix[position2.l][position2.b] = 2;

    displayInitMessage();
    displayGrid();
    initiateIO();
}

function fillEmptySpace() {
    var emptySpacesFound = true;
    var emptySpaces = recordEmptySpaces();

    if (emptySpaces.length) {
        emptySpacesFound = true
    } else {
        emptySpacesFound = false;
        return emptySpacesFound;
    }

    var randomPosition = randomIntGenerator(0, emptySpaces.length - 1);
    var position = emptySpaces[randomPosition];

    var num = 2;
    var randomPosition2 = randomIntGenerator(1, 2);
    if (randomPosition2 == 2) {
        num = 4;
    }

    matrix[position.l][position.b] = num;
    return emptySpacesFound;

}

function randomIntGenerator(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function moveGridToLeft() {

    var endpoint;
    for (var length = 0; length < gridSize; length++) {

        var breadth = 0;
        endpoint = {
            l: length,
            b: 0
        };

        var toMergePos = {
            l: length,
            b: breadth + 1
        };


        while (breadth < gridSize) {
            breadth++;
            var endpointVal = matrix[endpoint.l][endpoint.b];
            var toMergeVal = matrix[toMergePos.l][toMergePos.b];

            var isEndPointFull = endpointVal !== undefined && endpointVal !== "" && endpointVal !== config.emptySymbol;
            var isMergeValFull = toMergeVal !== undefined && toMergeVal !== "" && toMergeVal !== config.emptySymbol;

            if (isEndPointFull && isMergeValFull) {
                if (endpointVal == toMergeVal) {
                    matrix[endpoint.l][endpoint.b] = endpointVal + toMergeVal;
                    if (endpointVal + toMergeVal == config.winningScore) {
                        console.log(gameMessages.won);
                    }
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                } else {
                    matrix[endpoint.l][endpoint.b + 1] = toMergeVal;
                    if (endpoint.b + 1 != toMergePos.b) {
                        matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    }
                }
                endpoint = {
                    l: length,
                    b: endpoint.b + 1
                };
            } else {
                if (!isEndPointFull && !isMergeValFull) {
                    // nothing is required here 
                } else if (isEndPointFull) {
                    // nothing is required here 
                } else {
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    matrix[endpoint.l][endpoint.b] = toMergeVal;
                }
            }

            toMergePos = {
                l: length,
                b: breadth + 1
            }


        }
    }

}

function moveGridToRight() {

    var endpoint;
    for (var length = 0; length < gridSize; length++) {

        var breadth = gridSize - 1;
        endpoint = {
            l: length,
            b: breadth
        };

        var toMergePos = {
            l: length,
            b: breadth - 1
        };


        while (breadth > 0) {
            breadth--;
            var endpointVal = matrix[endpoint.l][endpoint.b];
            var toMergeVal = matrix[toMergePos.l][toMergePos.b];

            var isEndPointFull = endpointVal !== undefined && endpointVal !== "" && endpointVal !== config.emptySymbol;
            var isMergeValFull = toMergeVal !== undefined && toMergeVal !== "" && toMergeVal !== config.emptySymbol;

            if (isEndPointFull && isMergeValFull) {
                if (endpointVal == toMergeVal) {
                    matrix[endpoint.l][endpoint.b] = endpointVal + toMergeVal;
                    if (endpointVal + toMergeVal == config.winningScore) {
                        console.log(gameMessages.won);
                    }
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    endpoint = {
                        l: length,
                        b: endpoint.b - 1
                    };

                } else {
                    matrix[endpoint.l][endpoint.b - 1] = toMergeVal;
                    if (endpoint.b - 1 != toMergePos.b) {
                        matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    }

                    endpoint = {
                        l: length,
                        b: endpoint.b - 1
                    };
                }
            } else {
                if (!isEndPointFull && !isMergeValFull) {
                    // nothing is required here 
                } else if (isEndPointFull) {
                    // nothing is required here 
                } else {
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    matrix[endpoint.l][endpoint.b] = toMergeVal;
                }
            }

            toMergePos = {
                l: length,
                b: breadth - 1
            }
        }
    }

}

function moveGridUp() {
    var endpoint;

    for (var breadth = 0; breadth < gridSize; breadth++) {

        var length = 0;
        endpoint = {
            l: length,
            b: breadth
        };

        var toMergePos = {
            l: length + 1,
            b: breadth
        };


        while (length < gridSize) {
            length++;
            var endpointVal = matrix[endpoint.l][endpoint.b];
            var toMergeVal = matrix[toMergePos.l][toMergePos.b];

            var isEndPointFull = endpointVal !== undefined && endpointVal !== "" && endpointVal !== config.emptySymbol;
            var isMergeValFull = toMergeVal !== undefined && toMergeVal !== "" && toMergeVal !== config.emptySymbol;

            if (isEndPointFull && isMergeValFull) {
                if (endpointVal == toMergeVal) {
                    matrix[endpoint.l][endpoint.b] = endpointVal + toMergeVal;
                    if (endpointVal + toMergeVal == config.winningScore) {
                        console.log(gameMessages.won);
                    }
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                } else {
                    matrix[endpoint.l + 1][endpoint.b] = toMergeVal;
                    if (endpoint.l + 1 != toMergePos.l) {
                        matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    }
                }

                endpoint = {
                    l: endpoint.l + 1,
                    b: breadth
                };
            } else {
                if (!isEndPointFull && !isMergeValFull) {
                    // nothing is required here 
                } else if (isEndPointFull) {
                    // nothing is required here 
                } else {
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    matrix[endpoint.l][endpoint.b] = toMergeVal;
                }
            }

            if (length + 1 < gridSize) {
                toMergePos = {
                    l: length + 1,
                    b: breadth
                }
            }

        }
    }

}

function moveGridDown() {
    var endpoint;

    for (var breadth = 0; breadth < gridSize; breadth++) {

        var length = gridSize - 1;
        endpoint = {
            l: length,
            b: breadth
        };

        var toMergePos = {
            l: length - 1,
            b: breadth
        };


        while (length > 0) {
            length--;
            var endpointVal = matrix[endpoint.l][endpoint.b];
            var toMergeVal = matrix[toMergePos.l][toMergePos.b];

            var isEndPointFull = endpointVal !== undefined && endpointVal !== "" && endpointVal !== config.emptySymbol;
            var isMergeValFull = toMergeVal !== undefined && toMergeVal !== "" && toMergeVal !== config.emptySymbol;

            if (isEndPointFull && isMergeValFull) {
                if (endpointVal == toMergeVal) {
                    matrix[endpoint.l][endpoint.b] = endpointVal + toMergeVal;
                    if (endpointVal + toMergeVal == config.winningScore) {
                        console.log(gameMessages.won);
                    }
                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                } else {
                    matrix[endpoint.l - 1][endpoint.b] = toMergeVal;
                    if (endpoint.l - 1 != toMergePos.l) {
                        matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    }
                }
                endpoint = {
                    l: endpoint.l - 1,
                    b: breadth
                };
            } else {
                if (!isEndPointFull && !isMergeValFull) {
                    // nothing is required here 
                } else if (isEndPointFull) {
                    // nothing is required here 
                } else {

                    matrix[toMergePos.l][toMergePos.b] = config.emptySymbol;
                    matrix[endpoint.l][endpoint.b] = toMergeVal;
                }
            }

            toMergePos = {
                l: length - 1,
                b: breadth
            }
        }
    }

}


function recordEmptySpaces() {
    var emptySpaces = [];
    for (var length = 0; length < gridSize; length++) {
        for (var breadth = 0; breadth < gridSize; breadth++) {
            var cell = matrix[length][breadth];
            if (cell == "" || cell == undefined || cell == config.emptySymbol) {
                emptySpaces.push({
                    "l": length,
                    "b": breadth
                });
            }
        }
    }
    return emptySpaces;
}


bootstrap();