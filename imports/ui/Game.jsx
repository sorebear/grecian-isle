import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ActiveGames } from '../api/activeGames';

import Worker from './Worker';
import Block from './Block';
import GameSpaceButton from './GameSpaceButton';
import IncomingRequestModal from './IncomingRequestModal';

class Game extends Component {
  constructor(props) {
    super(props);
    this.localPlayer = null;
    this.handleSelectionInSelectPhase = this.handleSelectionInSelectPhase.bind(this);
    this.handleSelectionInMovePhase = this.handleSelectionInMovePhase.bind(this);
    this.handleSelectionInBuildPhase = this.handleSelectionInBuildPhase.bind(this);
    this.rotateBoardLeft = this.rotateBoardLeft.bind(this);
    this.rotateBoardRight = this.rotateBoardRight.bind(this);
    this.rotateBoardDown = this.rotateBoardDown.bind(this);
    this.rotateBoardUp = this.rotateBoardUp.bind(this);
    this.state = {
      rotateZ: -45,
      rotateX: 60,
    };
  }

  componentWillMount() {
    this.localPlayer = this.props.location.state;
    Meteor.call('game.addPlayer', this.props.match.params.id);
    window.addEventListener('beforeunload', () => {
      Meteor.call('game.removePlayer', this.props.match.params.id);
    });
  }

  componentWillUnmount() {
    Meteor.call('game.removePlayer', this.props.match.params.id);
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
    const game = this.props.game[0];
    const newGameBoard = [...game.gameBoard];
    newGameBoard[game.selectedWorker.row][game.selectedWorker.col].worker = 0;
    newGameBoard[row][col].worker = game.selectedWorker.workerId;
    Meteor.call('game.handleSelectionInMovePhase', game._id, {
      turnPhase: 'build',
      gameBoard: [...newGameBoard],
      selectedWorker: {
        workerId: game.selectedWorker.workerId,
        row,
        col,
        height: game.gameBoard[row][col].height,
      },
    });
  }

  handleSelectionInBuildPhase(row, col) {
    const game = this.props.game[0];
    const newGameBoard = [...game.gameBoard];
    newGameBoard[row][col].height += 1;
    Meteor.call('game.handleSelectionInBuildPhase', game._id, {
      activePlayer: game.activePlayer === 1 ? 2 : 1,
      turnPhase: 'select',
      gameBoard: [...newGameBoard],
    });
  }

  renderLevels(height, id) {
    const heightArr = [];
    for (let i = 1; i <= height; i += 1) {
      heightArr.push(i);
    }
    return heightArr.map(level => (
      <div key={`${id}-${level}`} className={`block-container built-level built-level-${level}`}>
        <Block level={level} />
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
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                className="game-space-button"
                onClick={() => this.handleSelectionInSelectPhase(space.row, space.col)}
              >
                {space.worker ? <Worker workerId={space.worker} className={space.worker === selectedWorker.workerId ? 'active' : ''} /> : <div />}
              </GameSpaceButton>
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
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                className="game-space-button"
                onClick={() => this.handleSelectionInMovePhase(space.row, space.col)}
              >
                {space.worker ? <Worker workerId={space.worker} className={space.worker === selectedWorker.workerId ? 'active' : ''} /> : <div /> }
              </GameSpaceButton>
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
              <GameSpaceButton
                conditional={conditional}
                id={`game-${space.id}`}
                className="game-space-button"
                onClick={() => this.handleSelectionInBuildPhase(space.row, space.col)}
              >
                {space.worker ? <Worker workerId={space.worker} className={space.worker === selectedWorker.workerId ? 'active' : ''} /> : <div />}
              </GameSpaceButton>
            </div>
          );
        })}
      </div>
    ));
  }

  renderCurrentBoardState() {
    switch (this.props.game[0].turnPhase) {
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

  render() {
    console.log('Game is Rendering With the Following Props', this.props);
    console.log('Local Player:', this.localPlayer);
    const game = this.props.game[0];
    if (this.props.game.length === 0) {
      return (
        <div className="wrapper">
          <h2 style={{ color: 'white' }}>Loading...</h2>
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
          {this.renderCurrentBoardState()}
        </div>
        <div className="back-button">
          <Link to="/">
            <button className="ui-button">
              Back
            </button>
          </Link>
        </div>
        <h2 className="prompt-text">
          {`${game.activePlayer === this.localPlayer ? 'It\'s Your Turn' : 'It\'s Your Opponent\'s Turn'}: `}<br/><span>{game.turnPhase}</span>
        </h2>
        <div className="rotate-buttons-container">
          <button onClick={this.rotateBoardLeft}>
            <img
              className="chevron-left"
              alt="chevron left"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521228833/svg-icons/ess-light/essential-light-01-chevron-left.svg"
            />
          </button>
          <button onClick={this.rotateBoardRight}>
            <img
              className="chevron-right"
              alt="chevron right"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521228834/svg-icons/ess-light/essential-light-02-chevron-right.svg"
            />
          </button>
          <button onClick={this.rotateBoardUp}>
            <img
              className="chevron-up"
              alt="chevron up"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521228835/svg-icons/ess-light/essential-light-03-chevron-up.svg"
            />
          </button>
          <button onClick={this.rotateBoardDown}>
            <img
              className="chevron-down"
              alt="chevron down"
              src="https://res.cloudinary.com/sorebear/image/upload/v1521228835/svg-icons/ess-light/essential-light-04-chevron-down.svg"
            />
          </button>
        </div>
        <div className="win-modal modal-mask" style={{ display: game.winConditionMet ? 'flex' : 'none' }}>
          <h2>You {game.activePlayer === this.localPlayer ? 'Won' : 'Lost'}!</h2>
          <Link to="/">
            <button className="ui-button">
              Menu
            </button>
          </Link>
        </div>
        <IncomingRequestModal 
          pendingRequest={game.pendingRequest}
          gameId={game._id}
        />
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
})(Game);

Game.propTypes = {
  game: PropTypes.arrayOf(PropTypes.shape({
    activePlayer: PropTypes.number.isRequired,
    gameBoard: PropTypes.array.isRequired,
    playerCount: PropTypes.number.isRequired,
    selectedWorker: PropTypes.shape({
      workerId: PropTypes.string.isRequired,
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    turnPhase: PropTypes.string.isRequired,
    winConditionMet: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.number.isRequired,
  }).isRequired,
};
