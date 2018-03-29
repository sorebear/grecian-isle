import React from 'react';

export const grecianIsleInstructions = [
  {
    id: 'grecianIsleInstructions_welcome',
    img: '',
    text() {
      return (
        <p>Welcome to Grecian Isle!</p>
      );
    },
  },
  {
    id: 'grecianIsleInstructions_setUp',
    img: '',
    title: 'Set Up',
    text() {
      return (
        <p>
          The first player begins by placing 2 <span className="highlight-brown">Workers</span> in
          any <span className="highlight-brown">unoccupied space</span>. The
          other player then places their <span className="highlight-brown">Workers</span>.
        </p>
      );
    },
  },
  {
    id: 'grecianIsleInstructions_HTP_selectPhase',
    img: '',
    title: 'How To Play - Select Phase',
    text() {
      return (
        <p>
          On your turn, select one of your <span className="highlight-brown">Workers</span>.
          You must <span className="highlight-blue">move</span> and then <span className="highlight-blue">build</span> with
          the selected <span className="highlight-brown">Worker</span>,
        </p>
      );
    },
  },
  {
    id: 'grecianIsleInstructions_HTP_movePhase',
    img: '',
    title: 'How To Play - Move Phase',
    text() {
      return (
        <p>
          <span className="highlight-blue">Move</span> your selected <span className="highlight-brown">Worker</span> into
          one of the (up to) eight <span className="highlight-brown">unoccupied neighboring</span> spaces.
          A <span className="highlight-brown">Worker</span> may <span className="highlight-blue">move up</span> a
          maximum of one level higher, <span className="highlight-blue">move down</span> any number of levels lower,
          or <span className="highlight-blue">move</span> along the same level. A Worker
          may not <span className="highlight-blue">move up</span> more than one level.
        </p>
      );
    },
  },
  {
    id: 'grecianIsleInstructions_HTP_buildPhase',
    img: '',
    title: 'How To Play - Build Phase',
    text() {
      return (
        <p>
          <span className="highlight-blue">Build</span> a <span className="highlight-brown">block</span> or
          <span className="highlight-blue"> crown</span> on an unoccupied
          space <span className="highlight-blue">neighboring</span> the <span className="highlight-brown">moved Worker</span>.
          You can <span className="highlight-blue">build</span> onto a <span className="highlight-brown">level</span> of
          any height. A tower with 3 <span className="highlight-brown">blocks</span> gets a
          <span className="highlight-brown">&apos;crown&apos;</span> and is then
          considered a <span className="highlight-brown">&apos;Complete Tower&apos;</span>
        </p>
      );
    },
  },
  {
    id: 'grecianIsleInstructions_winningTheGame',
    img: '',
    title: 'Winning The Game',
    text() {
      return (
        <p>
          1. If one of your <span className="highlight-brown">Workers</span>
          <span className="highlight-blue"> moves up</span> on top
          of <span className="highlight-brown">level 3</span> during your turn, you instantly win!<br />
          2. You <em>must</em> always perform a <span className="highlight-blue">move</span> then
          <span className="highlight-blue"> build</span> on your turn. If you are unable to, you lose.
        </p>
      );
    },
  },
];