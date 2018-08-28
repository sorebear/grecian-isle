import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Hammer from 'hammerjs';
import { db } from '../firebase';

import Worker from '../ui/grecianIsle/Worker';
import Block from '../ui/grecianIsle/Block';
import GameSpaceButton from '../ui/grecianIsle/GameSpaceButton';
import BasicModal from '../ui/BasicModal';
import IncomingNotificationsModal from '../ui/IncomingNotificationsModal';
import InstructionalModal from '../ui/InstructionalModal';

import { grecianIsleInstructions } from '../ui/instructions';

class Game extends Component {
  constructor(props) {
    super(props);
    this.gameId = this.props.location.search.slice(1);
    this.localPlayer = null;
    this.gestureHandler = null;
    this.imgRoot = 'https://res.cloudinary.com/sorebear/image/upload';

    this.handleSelectionInSelectPhase = this.handleSelectionInSelectPhase.bind(this);
    this.handleSelectionInMovePhase = this.handleSelectionInMovePhase.bind(this);
    this.handleSelectionInBuildPhase = this.handleSelectionInBuildPhase.bind(this);
    this.toggleInstructionalModal = this.toggleInstructionalModal.bind(this);
    this.unload = this.unload.bind(this);
    this.rotateBoardLeft = this.rotateBoardLeft.bind(this);
    this.rotateBoardRight = this.rotateBoardRight.bind(this);
    this.rotateBoardDown = this.rotateBoardDown.bind(this);
    this.rotateBoardUp = this.rotateBoardUp.bind(this);
    this.state = {
      rotateZ: -45,
      rotateX: 60,
      showInstructionalModal: false,
      game: null,
    };
  }

  async componentDidMount() {
    window.addEventListener('beforeunload', () => this.unload());
    this.addGestureEventListeners();
    this.localPlayer = this.props.location.state || 0;
    
    const gameState = await db.getGameState(this.gameId);

    if (gameState.val()) {
      db.applyCurrentGameChangeListener(this.gameId, (snapshot) => {
        this.setState({ game: snapshot.val() });
      });
      db.addPlayer(this.gameId, gameState.val().playerCount);
    }
  }

  componentWillUnmount() {
    this.unload();
  }

  unload() {
    db.removeCurrentGameChangeListener(this.gameId);
    if (this.state.game) {
      const { creatingPlayer, joiningPlayer, playerCount } = this.state.game;
      db.removePlayer(this.gameId, this.localPlayer, creatingPlayer, joiningPlayer, playerCount);
    }
  }

  addGestureEventListeners() {
    this.gestureHandler = new Hammer(document.querySelector('.wrapper'));
    this.gestureHandler.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    this.gestureHandler.on('swiperight', (e) => this.rotateBoardLeft(e.overallVelocity));
    this.gestureHandler.on('swipeleft', (e) => this.rotateBoardRight(e.overallVelocity));
    this.gestureHandler.on('swipeup', (e) => this.rotateBoardDown(e.overallVelocity));
    this.gestureHandler.on('swipedown', (e) => this.rotateBoardUp(e.overallVelocity));
  }

  toggleInstructionalModal() {
    this.setState({ showInstructionalModal: !this.state.showInstructionalModal });
  }

  rotateBoardLeft(velocity) {
    const multiplier = isNaN(velocity) ? 2 : Math.ceil(Math.abs(velocity) / 2);
    this.setState({ rotateZ: this.state.rotateZ - (22.5 * multiplier) });
  }

  rotateBoardRight(velocity) {
    const multiplier = isNaN(velocity) ? 2 : Math.ceil(Math.abs(velocity) / 2);
    this.setState({ rotateZ: this.state.rotateZ + (22.5 * multiplier ) });
  }

  rotateBoardUp(velocity) {
    if (this.state.rotateX > 0) {
      const multiplier = isNaN(velocity) ? 1 : Math.ceil(Math.abs(velocity) / 2);
      const newAngle = this.state.rotateX - (15 * multiplier);
      this.setState({ rotateX: newAngle < 0 ? 0 : newAngle });
    }
  }

  rotateBoardDown(velocity) {
    if (this.state.rotateX < 75) {
      const multiplier = isNaN(velocity) ? 1 : Math.ceil(Math.abs(velocity) / 2);
      const newAngle = this.state.rotateX + (15 * multiplier);
      this.setState({ rotateX: newAngle > 75 ? 75 : newAngle });
    }
  }

  handleSelectionInPlacementPhase(row, col) {
    const { activePlayer, gameBoard, workerBeingPlaced } = this.state.game;
    let workerId = `p${activePlayer}Female`;
    let newActivePlayer = activePlayer;
    let newTurnPhase = 'placement';
    if (workerBeingPlaced === 2 || workerBeingPlaced === 4) {
      workerId = `p${activePlayer}Male`;
      newActivePlayer = activePlayer === 1 ? 2 : 1;
    }
    if (workerBeingPlaced === 4) {
      newTurnPhase = 'select';
    }
    const newGameBoard = [...gameBoard];
    newGameBoard[row][col].worker = workerId;
    db.handleSelectionInPlacementPhase(this.gameId, workerBeingPlaced, {
      activePlayer: newActivePlayer,
      gameBoard: [...newGameBoard],
      turnPhase: newTurnPhase,
      workerBeingPlaced: workerBeingPlaced + 1
    });
  }

  handleSelectionInSelectPhase(row, col) {
    db.handleSelectionInSelectPhase(this.gameId, {
      turnPhase: 'move',
      selectedWorker: {
        workerId: this.state.game.gameBoard[row][col].worker,
        row,
        col,
        height: this.state.game.gameBoard[row][col].height,
      },
    });
  }

  handleSelectionInMovePhase(row, col) {
    const { gameBoard, selectedWorker } = this.state.game;
    const newGameBoard = [...gameBoard];
    newGameBoard[selectedWorker.row][selectedWorker.col].worker = 0;
    newGameBoard[row][col].worker = selectedWorker.workerId;
    db.handleSelectionInMovePhase(this.gameId, {
      turnPhase: 'build',
      gameBoard: [...newGameBoard],
      currentUpdate: [
        selectedWorker.row,
        selectedWorker.col,
        selectedWorker.height,
      ],
      selectedWorker: {
        workerId: selectedWorker.workerId,
        row,
        col,
        height: gameBoard[row][col].height,
      },
    });
  }

  handleSelectionInBuildPhase(row, col) {
    const { activePlayer, gameBoard } = this.state.game;
    const newGameBoard = [...gameBoard];
    newGameBoard[row][col].height += 1;
    db.handleSelectionInBuildPhase(this.gameId, {
      activePlayer: activePlayer === 1 ? 2 : 1,
      turnPhase: 'select',
      gameBoard: [...newGameBoard],
      currentUpdate: [row, col, gameBoard[row][col].height],
    });
  }

  renderLevels(height, id) {
    const game = this.state.game;
    const heightArr = [];
    for (let i = 1; i <= height; i += 1) {
      heightArr.push(i);
    }
    return heightArr.map(level => (
      <div
        key={`${id}-${level}`}
        className={`
          block-container
          built-level
          built-level-${level}
          ${id === `space-${game.currentUpdate[0]}x${game.currentUpdate[1]}` && game.turnPhase === 'select' ? 'animate' : ''}
        `}
      >
        <Block level={level} />
      </div>
    ));
  }

  renderBoardInPlacementPhase() {
    const { activePlayer, gameBoard, localGame } = this.state.game;
    return gameBoard.map((row, index) => (
      <div key={index} className={`row row-${index}`}>
        {row.map(space => {
          const conditional = (localGame || this.localPlayer === activePlayer) && !space.worker;
          return (
            <div key={space.id} className="game-space">
              {space.worker ? <Worker workerId={space.worker} className="inactive" /> : <span />}
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                onClick={() => this.handleSelectionInPlacementPhase(space.row, space.col)}
              />
            </div>
          );
        })}
      </div>
    ));
  }

  renderBoardInSelectPhase() {
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.state.game;
    return gameBoard.map((row, index) => (
      <div key={index} className={`row row-${index}`}>
        {row.map(space => {
          const conditional = (localGame || this.localPlayer === activePlayer) && (
            space.worker === `p${activePlayer}Female` || space.worker === `p${activePlayer}Male`);
          return (
            <div key={space.id} className="game-space">
              {this.renderLevels(space.height, space.id)}
              {space.worker ?
                <Worker
                  conditional={conditional}
                  onClick={() => this.handleSelectionInSelectPhase(space.row, space.col)}
                  workerId={space.worker}
                  className={space.worker === selectedWorker.workerId ? 'active' : 'inactive'}
                />
              : <span />}
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                onClick={() => this.handleSelectionInSelectPhase(space.row, space.col)}
              />
            </div>
          );
        })}
      </div>
    ));
  }

  renderBoardInMovePhase() {
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.state.game;
    return gameBoard.map((row, index) => (
      <div key={`${this.gameId}-row-${index}`} className={`row row-${index}`}>
        { row.map(space => {
          const conditional =
            (localGame || this.localPlayer === activePlayer) && (
            (space.col === selectedWorker.col && !space.worker &&
            space.height <= selectedWorker.height + 1 && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.col === selectedWorker.col + 1 && !space.worker &&
            space.height <= selectedWorker.height + 1 && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.col === selectedWorker.col - 1 && !space.worker &&
            space.height <= selectedWorker.height + 1 && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.row === selectedWorker.row && !space.worker &&
            space.height <= selectedWorker.height + 1 && space.height < 4 &&
            (space.col === selectedWorker.col + 1 || space.col === selectedWorker.col - 1)));
          return (
            <div key={space.id} className="game-space">
              {this.renderLevels(space.height, space.id)}
              {space.worker ?
                <Worker
                  workerId={space.worker}
                  className={space.worker === selectedWorker.workerId ? 'active' : 'inactive'}
                />
              : <span />}
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                onClick={() => this.handleSelectionInMovePhase(space.row, space.col)}
              />
            </div>
          );
        })}
      </div>
    ));
  }

  renderBoardInBuildPhase() {
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.state.game;
    return gameBoard.map((row, index) => (
      <div key={`${this.gameId}-row-${index}`} className={`row row-${index}`}>
        { row.map(space => {
          const conditional =
            (localGame || this.localPlayer === activePlayer) && (
            (space.col === selectedWorker.col && !space.worker && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.col === selectedWorker.col + 1 && !space.worker && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.col === selectedWorker.col - 1 && !space.worker && space.height < 4 &&
            (space.row === selectedWorker.row + 1 || space.row === selectedWorker.row - 1)) ||
            (space.row === selectedWorker.row && !space.worker && space.height < 4 &&
            (space.col === selectedWorker.col + 1 || space.col === selectedWorker.col - 1)));
          return (
            <div key={space.id} className="game-space">
              {this.renderLevels(space.height, space.id)}
              {space.worker ?
                <Worker
                  workerId={space.worker}
                  className={space.worker === selectedWorker.workerId ? 'active' : 'inactive'}
                />
              : <span />}
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                onClick={() => this.handleSelectionInBuildPhase(space.row, space.col)}
              />
            </div>
          );
        })}
      </div>
    ));
  }

  renderCurrentBoardState() {
    switch (this.state.game.turnPhase) {
      case 'placement':
        return this.renderBoardInPlacementPhase();
      case 'select':
        return this.renderBoardInSelectPhase();
      case 'move':
        return this.renderBoardInMovePhase();
      case 'build':
        return this.renderBoardInBuildPhase();
      default:
        return this.renderBoardInSelectPhase();
    }
  }

  renderPromptText() {
    const { activePlayer, localGame, turnPhase } = this.state.game;
    if (localGame) {
      return (
        <h2 className="prompt-text">
          {`It's Player ${activePlayer}'s Turn`}<br /><span>{turnPhase}</span>
        </h2>
      );
    }
    return (
      <h2 className="prompt-text">
        {activePlayer === this.localPlayer ? 'It\'s Your Turn' : 'It\'s Your Opponent\'s Turn'}<br />
        <span>{turnPhase}</span>
      </h2>
    );
  }

  renderWinConditionMetModal() {
    const { game } = this.state;
    if (game.winConditionMet) {
      return (
        <BasicModal showModal={game.winConditionMet} className="grecianIsle">
          {game.localGame ? <h3>Player {game.activePlayer} Wins!</h3> : <h3>You {game.activePlayer === this.localPlayer ? 'Won' : 'Lost'}!</h3>}
          <Link to="/">
            <button type="button" className="ui-button">
              Menu
            </button>
          </Link>
        </BasicModal>
      );
    }
  }

  renderIncomingNotificationsModal() {
    const { game } = this.state;
    if ((!game.localGame && (!game.joiningPlayer || !game.creatingPlayer)) || game.pendingRequest) {
      return (
        <IncomingNotificationsModal
          gameId={this.gameId}
          gameTitleRef={game.gameTitleRef}
          creatingPlayer={game.creatingPlayer}
          joiningPlayer={game.joiningPlayer}
          leavingPlayer={game.leavingPlayer}
          localGame={game.localGame}
          pendingRequest={game.pendingRequest}
        />  
      )
    }
  }

  renderInstructionalModal() {
    const { game } = this.state;
    if (this.state.showInstructionalModal) {
      return (
        <InstructionalModal
          closeModal={this.toggleInstructionalModal}
          gameTitleRef={game.gameTitleRef}
        >
          {grecianIsleInstructions.map(item => (
            <div key={item.id} className="instructions flex-column">
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              {item.text()}
            </div>
          ))}
        </InstructionalModal>
      );
    }
  }

  render() {
    const { game, rotateX, rotateZ } = this.state;
    console.log('GAME STATE', this.state);
    if (!game) {
      return (
        <div className="wrapper">
          <h2 style={{ color: 'white' }}>
            {this.props.listLoading ? 'Loading...' : 'Something went wrong. This game no longer exists'}
          </h2>
          <Link to="/">
            <button type="button" className="ui-button">
              Menu
            </button>
          </Link>
        </div>
      );
    }
    return (
      <div className="wrapper" style={{ backgroundImage: 'linear-gradient(rgb(22, 34, 86), rgb(51, 51, 51))' }}>
        <div
          className="game-board"
          style={{transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`}}
        >
          <div className="game-board-side front" />
          <div className="game-board-side left" />
          <div className="game-board-side back" />
          <div className="game-board-side right" />
          {this.renderCurrentBoardState()}
        </div>
        <div className="back-button">
          <Link to="/">
            <button type="button" className="ui-button">
              Back
            </button>
          </Link>
        </div>
        { this.renderPromptText() }
        <div className="rotate-buttons-container">
          <button type="button" className="get-info" onClick={this.toggleInstructionalModal}>
            <img
              alt="How to Play"
              src={`${this.imgRoot}/v1521756535/svg-icons/ess-light-white/essential-light-60-question-circle.svg`}
            />
          </button>
          <button type="button" className="arrow-left" onClick={this.rotateBoardLeft}>
            <img
              alt="arrow left"
              src={`${this.imgRoot}/v1521756077/svg-icons/ess-light-white/essential-light-06-arrow-left.svg`}
            />
          </button>
          <button type="button" className="arrow-right" onClick={this.rotateBoardRight}>
            <img
              alt="arrow right"
              src={`${this.imgRoot}/v1521756078/svg-icons/ess-light-white/essential-light-07-arrow-right.svg`}
            />
          </button>
          <button type="button" className="arrow-up" onClick={this.rotateBoardUp}>
            <img
              alt="arrow up"
              src={`${this.imgRoot}/v1521756078/svg-icons/ess-light-white/essential-light-08-arrow-up.svg`}
            />
          </button>
          <button type="button" className="arrow-down" onClick={this.rotateBoardDown}>
            <img
              alt="arrow down"
              src={`${this.imgRoot}/v1521756078/svg-icons/ess-light-white/essential-light-09-arrow-down.svg`}
            />
          </button>
        </div>
        { this.renderWinConditionMetModal() }
        { this.renderIncomingNotificationsModal() }
        { this.renderIncomingNotificationsModal() }
        { this.renderInstructionalModal() }
      </div>
    );
  }
}

export default withRouter(Game);
