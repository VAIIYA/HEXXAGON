import React from 'react';
import { Player, keyToHex } from '@/utils/hex';
import './HexagonBoard.css';

interface HexagonBoardProps {
    board: Record<string, Player | 0>;
    currentPlayer: Player;
    selectedHex: string | null;
    validMoves: { moves: string[], jumps: string[] };
    onHexClick: (key: string) => void;
}

export default function HexagonBoard({ board, currentPlayer, selectedHex, validMoves, onHexClick }: HexagonBoardProps) {
    const hexSize = 38; // Radius in pixels
    const width = Math.sqrt(3) * hexSize;
    const height = 2 * hexSize;

    return (
        <div className="board-container">
            <div className="board-wrapper">
                {Object.entries(board).map(([key, cell]) => {
                    const hex = keyToHex(key);
                    const x = hexSize * Math.sqrt(3) * (hex.q + hex.r / 2);
                    const y = hexSize * 1.5 * hex.r;

                    const isSelected = selectedHex === key;
                    const isMove = validMoves.moves.includes(key);
                    const isJump = validMoves.jumps.includes(key);

                    let pieceClass = '';
                    if (cell === 1) pieceClass = 'ruby';
                    else if (cell === 2) pieceClass = 'pearl';

                    let cellClass = 'hex-cell';
                    if (isSelected) cellClass += ' selected';
                    if (isMove) cellClass += ' valid-move';
                    if (isJump) cellClass += ' valid-jump';
                    if (cell === currentPlayer) cellClass += ' current-player-piece';

                    return (
                        <div
                            key={key}
                            className={cellClass}
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                width: `${width}px`,
                                height: `${height}px`,
                            }}
                            onClick={() => onHexClick(key)}
                        >
                            <div className="hex-polygon"></div>
                            {cell !== 0 && (
                                <div className={`hex-piece ${pieceClass}`}></div>
                            )}
                            {isMove && <div className="move-indicator"></div>}
                            {isJump && <div className="jump-indicator"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
