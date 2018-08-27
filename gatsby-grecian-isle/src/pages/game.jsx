import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
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
    console.log('DATABASE', db);
    this.gameId = this.props.location.search.slice(1);
    this.dbRoot = db.data.ref(`activeGames/${this.gameId}`);
    this.localPlayer = null;

    this.handleSelectionInSelectPhase = this.handleSelectionInSelectPhase.bind(this);
    this.handleSelectionInMovePhase = this.handleSelectionInMovePhase.bind(this);
    this.handleSelectionInBuildPhase = this.handleSelectionInBuildPhase.bind(this);
    this.toggleInstructionalModal = this.toggleInstructionalModal.bind(this);
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

  componentDidMount() {
    console.log('COMPONENT MOUNTING');
    console.log('Starting DB', this.dbRoot);
    this.dbRoot.on('value', (snapshot) => {
      console.log(snapshot.val());
      this.setState({
        game: snapshot.val()
      });
    });
    this.localPlayer = this.props.location.state;
    db.addPlayer(this.gameId, this.localPlayer);
    window.addEventListener('beforeunload', () => {
      this.removePlayer();
    });
  }

  updateWithDb() {
    this.dbRoot = db.ref(`activeGames/${id}`);
    this.dbRoot.on('value', snapshot => {
      snapshot.forEach((snap) => {
        if (snap.val().active) {
          this.setState({ game: snap.val() })
        }
      })
    })
  }

  componentWillUnmount() {
    this.removePlayer();
  }

  removePlayer() {
    const creatingPlayer = this.props.game[0] ? this.props.game[0].creatingPlayer : null;
    const joiningPlayer = this.props.game[0] ? this.props.game[0].joiningPlayer : null;
    db.removePlayer(this.gameId, this.localPlayer, creatingPlayer, joiningPlayer);
  }

  toggleInstructionalModal() {
    this.setState({ showInstructionalModal: !this.state.showInstructionalModal });
  }

  rotateBoardLeft() {
    this.setState({ rotateZ: this.state.rotateZ - 45 });
  }

  rotateBoardRight() {
    this.setState({ rotateZ: this.state.rotateZ + 45 });
  }

  rotateBoardUp() {
    if (this.state.rotateX > 0) {
      this.setState({ rotateX: this.state.rotateX - 15 });
    }
  }

  rotateBoardDown() {
    if (this.state.rotateX < 90) {
      this.setState({ rotateX: this.state.rotateX + 15 });
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
    db.handleSelectionInPlacementPhase(this.gameId, {
      activePlayer: newActivePlayer,
      gameBoard: [...newGameBoard],
      turnPhase: newTurnPhase,
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
        selectedWorker.column,
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

  render() {
    console.log('STATE GAME', this.state.game);
    console.log('GAME PROPS', this.props);
    console.log('GAME DB', this.dbRoot.child);
    const game = this.state.game;
    if (!this.state.game) {
      return (
        <div className="wrapper">
          <h2 style={{ color: 'white' }}>
            {this.props.listLoading ? 'Loading...' : 'Something went wrong. This game no longer exists'}
          </h2>
          <Link to="/">
            <button className="ui-button">
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
          style={{ transform: `rotateX(${this.state.rotateX}deg) rotateZ(${this.state.rotateZ}deg)` }}
        >
          <div className="game-board-side front" />
          <div className="game-board-side left" />
          <div className="game-board-side back" />
          <div className="game-board-side right" />
          {this.renderCurrentBoardState()}
        </div>
        <div className="back-button">
          <Link to="/">
            <button className="ui-button">
              Back
            </button>
          </Link>
        </div>
        { this.renderPromptText() }
        <div className="rotate-buttons-container">
          <button className="get-info" onClick={this.toggleInstructionalModal}>
            <img
              alt="How to Play"
              src="http://res.cloudinary.com/sorebear/image/upload/v1521756535/svg-icons/ess-light-white/essential-light-60-question-circle.svg"
            />
          </button>
          <button className="arrow-left" onClick={this.rotateBoardLeft}>
            <img
              alt="arrow left"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521756077/svg-icons/ess-light-white/essential-light-06-arrow-left.svg"
            />
          </button>
          <button className="arrow-right" onClick={this.rotateBoardRight}>
            <img
              alt="arrow right"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521756078/svg-icons/ess-light-white/essential-light-07-arrow-right.svg"
            />
          </button>
          <button className="arrow-up" onClick={this.rotateBoardUp}>
            <img
              alt="arrow up"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521756078/svg-icons/ess-light-white/essential-light-08-arrow-up.svg"
            />
          </button>
          <button className="arrow-down" onClick={this.rotateBoardDown}>
            <img
              alt="arrow down"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521756078/svg-icons/ess-light-white/essential-light-09-arrow-down.svg"
            />
          </button>
        </div>
        <BasicModal showModal={game.winConditionMet} className="grecianIsle">
          {game.localGame ? <h3>Player {game.activePlayer} Wins!</h3> : <h3>You {game.activePlayer === this.localPlayer ? 'Won' : 'Lost'}!</h3>}
          <Link to="/">
            <button className="ui-button">
              Menu
            </button>
          </Link>
        </BasicModal>
        { game.localGame ? <span /> :
        <IncomingNotificationsModal
          gameId={this.gameId}
          gameTitleRef={game.gameTitleRef}
          creatingPlayer={game.creatingPlayer}
          joiningPlayer={game.joiningPlayer}
          leavingPlayer={game.leavingPlayer}
          localGame={game.localGame}
          pendingRequest={game.pendingRequest}
        />
        }
        <InstructionalModal
          showModal={this.state.showInstructionalModal}
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
      </div>
    );
  }
}

export default withRouter(Game);

Game.propTypes = {
  listLoading: PropTypes.bool.isRequired,
  game: PropTypes.arrayOf(PropTypes.shape({
    activePlayer: PropTypes.number.isRequired,
    creatingPlayer: PropTypes.string.isRequired,
    joiningPlayer: PropTypes.string,
    gameBoard: PropTypes.array.isRequired,
    playerCount: PropTypes.number.isRequired,
    localGame: PropTypes.bool.isRequired,
    selectedWorker: PropTypes.shape({
      workerId: PropTypes.string.isRequired,
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    turnPhase: PropTypes.string.isRequired,
    winConditionMet: PropTypes.bool.isRequired,
    workerBeingPlaced: PropTypes.number.isRequired
  })),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.number.isRequired,
  }).isRequired,
};

Game.defaultProps = {
  game: {
    joiningPlayer: null,
  },
};
