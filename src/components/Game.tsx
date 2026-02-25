'use client';

import React, { useState, useEffect } from 'react';
import { Player, Hex, hexKey, keyToHex, generateBoard, getValidMoves, getNeighbors, INITIAL_BOARD_RADIUS } from '@/utils/hex';
import { useWallet } from '@solana/wallet-adapter-react';
import { updateGameStats } from '@/utils/store';
import HexagonBoard from './HexagonBoard';
import './Game.css';

export default function Game() {
    const { publicKey } = useWallet();
    const [board, setBoard] = useState<Record<string, Player | 0>>({});
    const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
    const [selectedHex, setSelectedHex] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<{ moves: string[], jumps: string[] }>({ moves: [], jumps: [] });
    const [scores, setScores] = useState<{ p1: number, p2: number }>({ p1: 0, p2: 0 });
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [statsSaved, setStatsSaved] = useState<boolean>(false);
    const [winner, setWinner] = useState<Player | null>(null);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const hexes = generateBoard(INITIAL_BOARD_RADIUS);
        const initialBoard: Record<string, Player | 0> = {};

        hexes.forEach(hex => {
            initialBoard[hexKey(hex)] = 0;
        });

        initialBoard[hexKey({ q: 0, r: 4, s: -4 })] = 1;
        initialBoard[hexKey({ q: 4, r: -4, s: 0 })] = 1;
        initialBoard[hexKey({ q: -4, r: 0, s: 4 })] = 1;

        initialBoard[hexKey({ q: 4, r: 0, s: -4 })] = 2;
        initialBoard[hexKey({ q: 0, r: -4, s: 4 })] = 2;
        initialBoard[hexKey({ q: -4, r: 4, s: 0 })] = 2;

        setBoard(initialBoard);
        setCurrentPlayer(1);
        setSelectedHex(null);
        setValidMoves({ moves: [], jumps: [] });
        setGameOver(false);
        setStatsSaved(false);
        setWinner(null);
        updateScores(initialBoard, 1);
    };

    useEffect(() => {
        if (gameOver && !statsSaved && publicKey) {
            const isWin = winner === 1;
            const isTie = winner === null;
            updateGameStats(publicKey.toBase58(), isWin, isTie);
            setStatsSaved(true);
        }
    }, [gameOver, statsSaved, publicKey, winner]);

    const hasValidMoves = (currentBoard: Record<string, Player | 0>, player: Player) => {
        for (const [key, cell] of Object.entries(currentBoard)) {
            if (cell === player) {
                const { moves, jumps } = getValidMoves(keyToHex(key), currentBoard);
                if (moves.length > 0 || jumps.length > 0) return true;
            }
        }
        return false;
    };

    const updateScores = (currentBoard: Record<string, Player | 0>, nextPlayer: Player) => {
        let p1 = 0;
        let p2 = 0;
        Object.values(currentBoard).forEach(val => {
            if (val === 1) p1++;
            if (val === 2) p2++;
        });
        setScores({ p1, p2 });

        if (p1 === 0 || p2 === 0 || (p1 + p2 === Object.keys(currentBoard).length)) {
            setGameOver(true);
            if (p1 > p2) setWinner(1);
            else if (p2 > p1) setWinner(2);
            else setWinner(null); // tie
            return;
        }

        // Check if next player can move
        const nextPlayerCanMove = hasValidMoves(currentBoard, nextPlayer);
        if (!nextPlayerCanMove) {
            const otherPlayer = nextPlayer === 1 ? 2 : 1;
            const otherPlayerCanMove = hasValidMoves(currentBoard, otherPlayer);
            if (!otherPlayerCanMove) {
                // Both can't move, game over
                setGameOver(true);
                if (p1 > p2) setWinner(1);
                else if (p2 > p1) setWinner(2);
                else setWinner(null);
            } else {
                // Skip turn
                setTimeout(() => {
                    alert(`Player ${nextPlayer === 1 ? 'Rubies' : 'Pearls'} has no valid moves. Skip turn!`);
                    setCurrentPlayer(otherPlayer);
                }, 100);
            }
        } else {
            setCurrentPlayer(nextPlayer);
        }
    };

    const handleHexClick = (key: string) => {
        if (gameOver) return;

        const cellOwner = board[key];

        if (cellOwner === currentPlayer) {
            if (selectedHex === key) {
                setSelectedHex(null);
                setValidMoves({ moves: [], jumps: [] });
            } else {
                setSelectedHex(key);
                const { moves, jumps } = getValidMoves(keyToHex(key), board);
                setValidMoves({
                    moves: moves.map(hexKey),
                    jumps: jumps.map(hexKey)
                });
            }
        } else if (selectedHex && board[key] === 0) {
            const isMove = validMoves.moves.includes(key);
            const isJump = validMoves.jumps.includes(key);

            if (isMove || isJump) {
                performMove(selectedHex, key, isJump);
            } else {
                setSelectedHex(null);
                setValidMoves({ moves: [], jumps: [] });
            }
        } else {
            setSelectedHex(null);
            setValidMoves({ moves: [], jumps: [] });
        }
    };

    const performMove = (fromKey: string, toKey: string, isJump: boolean) => {
        const newBoard = { ...board };

        newBoard[toKey] = currentPlayer;
        if (isJump) {
            newBoard[fromKey] = 0;
        }

        const neighbors = getNeighbors(keyToHex(toKey));
        neighbors.forEach(n => {
            const nKey = hexKey(n);
            const neighborCell = newBoard[nKey];
            if (neighborCell !== undefined && neighborCell !== 0 && neighborCell !== currentPlayer) {
                newBoard[nKey] = currentPlayer;
            }
        });

        setBoard(newBoard);
        setSelectedHex(null);
        setValidMoves({ moves: [], jumps: [] });

        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        updateScores(newBoard, nextPlayer);
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <h1>HEXXAGON</h1>
                <div className="scoreboard">
                    <div className={`score-card p1 ${currentPlayer === 1 ? 'active' : ''}`}>
                        <div className="ruby-icon"></div>
                        <span>Rubies: {scores.p1}</span>
                    </div>
                    <div className={`score-card p2 ${currentPlayer === 2 ? 'active' : ''}`}>
                        <div className="pearl-icon"></div>
                        <span>Pearls: {scores.p2}</span>
                    </div>
                </div>
                {gameOver && (
                    <div className="game-over">
                        <h2>Game Over!</h2>
                        <p>{winner === 1 ? 'Rubies Win!' : winner === 2 ? 'Pearls Win!' : 'It is a Tie!'}</p>
                        <button className="reset-btn" onClick={initGame}>Play Again</button>
                    </div>
                )}
            </div>

            <HexagonBoard
                board={board}
                currentPlayer={currentPlayer}
                selectedHex={selectedHex}
                validMoves={validMoves}
                onHexClick={handleHexClick}
            />
        </div>
    );
}
