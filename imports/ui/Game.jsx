import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ActiveGames } from '../api/activeGames';

import Worker from './Worker';
import Block from './Block';
import GameSpaceButton from './GameSpaceButton';
import BasicModal from './BasicModal';
import IncomingNotificationsModal from './IncomingNotificationsModal';
import InstructionalModal from './InstructionalModal';

import { grecianIsleInstructions } from './instructions';

class Game extends Component {
  constructor(props) {
    super(props);
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
    };
  }

  componentWillMount() {
    this.localPlayer = this.props.location.state;
    Meteor.call('game.addPlayer', this.props.match.params.id, this.localPlayer);
    window.addEventListener('beforeunload', () => {
      this.removePlayer();
    });
  }

  componentWillUnmount() {
    this.removePlayer();
  }

  removePlayer() {
    const creatingPlayer = this.props.game[0] ? this.props.game[0].creatingPlayer : null;
    const joiningPlayer = this.props.game[0] ? this.props.game[0].joiningPlayer : null;
    Meteor.call('game.removePlayer', this.props.match.params.id, this.localPlayer, creatingPlayer, joiningPlayer);
  }

  toggleInstructionalModal() {
    console.log('Toggle Instructional Menu Called!');
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
    const { _id, activePlayer, gameBoard, workerBeingPlaced } = this.props.game[0];
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
    Meteor.call('game.handleSelectionInPlacementPhase', _id, {
      activePlayer: newActivePlayer,
      gameBoard: [...newGameBoard],
      turnPhase: newTurnPhase,
    });
  }

  handleSelectionInSelectPhase(row, col) {
    Meteor.call('game.handleSelectionInSelectPhase', this.props.game[0]._id, {
      turnPhase: 'move',
      selectedWorker: {
        workerId: this.props.game[0].gameBoard[row][col].worker,
        row,
        col,
        height: this.props.game[0].gameBoard[row][col].height,
      },
    });
  }

  handleSelectionInMovePhase(row, col) {
    const { _id, gameBoard, selectedWorker } = this.props.game[0];
    const newGameBoard = [...gameBoard];
    newGameBoard[selectedWorker.row][selectedWorker.col].worker = 0;
    newGameBoard[row][col].worker = selectedWorker.workerId;
    Meteor.call('game.handleSelectionInMovePhase', _id, {
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
    const { _id, activePlayer, gameBoard } = this.props.game[0];
    const newGameBoard = [...gameBoard];
    newGameBoard[row][col].height += 1;
    Meteor.call('game.handleSelectionInBuildPhase', _id, {
      activePlayer: activePlayer === 1 ? 2 : 1,
      turnPhase: 'select',
      gameBoard: [...newGameBoard],
      currentUpdate: [row, col, gameBoard[row][col].height],
    });
  }

  renderLevels(height, id) {
    const game = this.props.game[0];
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
    const { activePlayer, gameBoard, localGame } = this.props.game[0];
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
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.props.game[0];
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
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.props.game[0];
    return gameBoard.map((row, index) => (
      <div key={`${this.props.game[0]._id}-row-${index}`} className={`row row-${index}`}>
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
    const { activePlayer, gameBoard, localGame, selectedWorker } = this.props.game[0];
    return gameBoard.map((row, index) => (
      <div key={`${this.props.game[0]._id}-row-${index}`} className={`row row-${index}`}>
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
    switch (this.props.game[0].turnPhase) {
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
    const { activePlayer, localGame, turnPhase } = this.props.game[0];
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
    console.log('Game is Rendering With the Following Props', this.props);
    const game = this.props.game[0];
    if (this.props.game.length === 0) {
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
      <div className="wrapper">
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
          gameId={game._id}
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

export default withTracker((props) => {
  const handle = Meteor.subscribe('game', props.match.params.id);
  return {
    listLoading: !handle.ready(),
    game: ActiveGames.find({ _id: props.match.params.id }).fetch(),
  };
})(withRouter(Game));

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
    workerBeingPlaced: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
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
