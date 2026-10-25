import { ArrowLeft, BookOpen, Lightbulb, RotateCcw, Search, Sparkles, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CHESS_DEPTH, CHESS_MODES } from './constants';
import './ChessGame.css';
import {
  START_FEN,
  applyMove,
  bestMove,
  describeMove,
  fromFen,
  gameResult,
  isInCheck,
  legalMoves,
  moveLabel,
  squareName,
  toFen,
  type Move,
  type Piece,
} from './engine';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const GLYPHS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

interface ReviewItem {
  label: string;
  kind: 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  best: string;
  loss: number;
  reason: string;
  reply?: string;
}

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export function ChessGame({ playerNames, onBack }: Props) {
  const { t } = useTranslation();
  const { mode, difficulty } = useGameSettings();
  const isLocal = mode === CHESS_MODES.LOCAL;
  const isTraining = mode === CHESS_MODES.TRAINING;
  const [fens, setFens] = usePersistedState<string[]>(GameKey.Chess, 'fens', [START_FEN]);
  const [moves, setMoves] = usePersistedState<string[]>(GameKey.Chess, 'moves', []);
  const [selected, setSelected] = useState<number | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<Move[] | null>(null);
  const [hint, setHint] = useState<Move | null>(null);
  const [thinking, setThinking] = useState(false);
  const [review, setReview] = useState<ReviewItem[] | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const analysisRun = useRef(0);
  const analysisWorker = useRef<Worker | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const current = useMemo(() => fromFen(fens[fens.length - 1] ?? START_FEN), [fens]);
  const displayed = useMemo(() => fromFen(
    reviewIndex === null ? fens[fens.length - 1] ?? START_FEN : fens[reviewIndex + 1] ?? START_FEN,
  ), [fens, reviewIndex]);
  const available = useMemo(() => legalMoves(current), [current]);
  const selectedMoves = selected === null ? [] : available.filter(move => move.from === selected);
  const repetitions = fens.filter(fen => fen.split(' ').slice(0, 4).join(' ') === toFen(current).split(' ').slice(0, 4).join(' ')).length;
  const result = gameResult(current, repetitions);
  const lastMove = useMemo(() => {
    const index = reviewIndex ?? moves.length - 1;
    if (index < 0 || !fens[index] || !fens[index + 1]) return null;
    const before = fromFen(fens[index]);
    return legalMoves(before).find(move => toFen(applyMove(before, move)) === fens[index + 1]) ?? null;
  }, [fens, moves.length, reviewIndex]);
  const playerTurn = isLocal || current.turn === 'w';
  const depth = CHESS_DEPTH[difficulty];
  const text = (key: string, vars?: Record<string, string | number>) => t(`${NS.CHESS}.${key}`, vars);

  useEffect(() => {
    if (isLocal || current.turn !== 'b' || result || reviewIndex !== null || reviewing) return;
    const timer = window.setTimeout(() => {
      setThinking(true);
      const choice = bestMove(current, depth);
      if (choice) {
        const next = applyMove(current, choice.move);
        setFens(prev => [...prev, toFen(next)]);
        setMoves(prev => [...prev, moveLabel(current, choice.move)]);
      }
      setThinking(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [current, depth, isLocal, result, reviewIndex, reviewing, setFens, setMoves]);

  const play = (move: Move) => {
    const next = applyMove(current, move);
    setFens(prev => [...prev, toFen(next)]);
    setMoves(prev => [...prev, moveLabel(current, move)]);
    setSelected(null);
    setPendingPromotion(null);
    setHint(null);
    setReview(null);
    setReviewIndex(null);
  };

  const onSquare = (square: number) => {
    if (!playerTurn || result || thinking || reviewing || reviewIndex !== null) return;
    const candidates = selectedMoves.filter(move => move.to === square);
    if (candidates.length > 1) {
      setPendingPromotion(candidates);
      return;
    }
    if (candidates[0]) {
      play(candidates[0]);
      return;
    }
    const piece = current.board[square];
    setSelected(piece && (piece === piece.toUpperCase() ? 'w' : 'b') === current.turn ? square : null);
    setHint(null);
  };

  const askHint = () => {
    const suggestion = bestMove(current, Math.max(2, depth));
    setHint(suggestion?.move ?? null);
  };

  const undo = () => {
    const count = isLocal ? 1 : current.turn === 'w' ? 2 : 1;
    setFens(prev => prev.slice(0, Math.max(1, prev.length - count)));
    setMoves(prev => prev.slice(0, Math.max(0, prev.length - count)));
    setSelected(null);
    setHint(null);
    setReview(null);
    setReviewIndex(null);
  };

  const analyze = () => {
    analysisWorker.current?.terminate();
    const run = ++analysisRun.current;
    setReviewing(true);
    setReviewProgress(0);
    setReviewIndex(null);
    const worker = new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' });
    analysisWorker.current = worker;
    const rows: ReviewItem[] = [];
    worker.onmessage = ({ data }: MessageEvent<{ id: number; index?: number; item?: ReviewItem; done?: boolean }>) => {
      if (data.id !== analysisRun.current || data.id !== run) return;
      if (data.item && data.index !== undefined) {
        rows[data.index] = data.item;
        setReviewProgress(data.index + 1);
      }
      if (data.done) {
        setReview(rows.filter(Boolean));
        setReviewing(false);
        worker.terminate();
        analysisWorker.current = null;
      }
    };
    worker.onerror = () => { setReviewing(false); worker.terminate(); analysisWorker.current = null; };
    worker.postMessage({ id: run, fens, moves });
  };

  const reset = () => {
    analysisRun.current++;
    analysisWorker.current?.terminate();
    setReviewing(false);
    setFens([START_FEN]);
    setMoves([]);
    setSelected(null);
    setHint(null);
    setReview(null);
    setReviewIndex(null);
  };

  useEffect(() => () => { analysisRun.current++; analysisWorker.current?.terminate(); }, []);

  const status = result === 'white' ? text('whiteWins') : result === 'black' ? text('blackWins')
    : result === 'draw' ? text('draw') : thinking ? text('thinking')
      : isInCheck(current, current.turn) ? text('check') : current.turn === 'w' ? text('whiteTurn') : text('blackTurn');
  const names = [playerNames[0] ?? text('white'), isLocal ? playerNames[1] ?? text('black') : text('computer')];

  return (
    <div className="chess-scene mx-auto flex w-full max-w-5xl flex-col gap-5 px-3 pb-10 text-white">
      <div className="chess-header flex items-center justify-between gap-2 pt-5">
        <button className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-white/80" onClick={() => { analysisRun.current++; onBack(); }}>
          <ArrowLeft size={20} />{t('common.back')}
        </button>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-wide"><Sparkles size={19} className="text-amber-300" />{text('title')}</h1>
        <button className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-white/80" onClick={reset}>
          <RotateCcw size={18} />{text('newGame')}
        </button>
      </div>
      <div className="chess-table rounded-[2rem] p-3 sm:p-6">
        <div className="chess-player mb-4 flex items-center justify-between gap-2 px-2 py-2 text-sm">
          <span className="flex items-center gap-3"><span className="chess-avatar">♚</span>{names[1]}</span>
          <span className={`chess-status ${result ? 'font-bold text-amber-300' : ''}`}>{status}</span>
        </div>
        <div className="chess-board mx-auto grid aspect-square w-full max-w-[620px] grid-cols-8 overflow-hidden rounded-xl">
          {displayed.board.map((piece, square) => {
            const target = selectedMoves.some(move => move.to === square);
            const suggested = hint && (hint.from === square || hint.to === square);
            const highlighted = lastMove && (lastMove.from === square || lastMove.to === square);
            const dark = (Math.floor(square / 8) + square % 8) % 2 === 1;
            return (
              <button
                key={square}
                type="button"
                onClick={() => onSquare(square)}
                aria-label={squareName(square)}
                className={`chess-square relative flex aspect-square items-center justify-center text-[clamp(1.8rem,7vw,3.7rem)] leading-none ${dark ? 'chess-dark' : 'chess-light'} ${selected === square ? 'chess-selected' : ''} ${highlighted ? 'chess-last' : ''} ${suggested ? 'chess-hint' : ''}`}
              >
                {square % 8 === 0 && <span className="chess-coordinate absolute left-1 top-1 text-[10px] font-bold">{8 - Math.floor(square / 8)}</span>}
                {square >= 56 && <span className="chess-coordinate absolute bottom-0.5 right-1 text-[10px] font-bold">{'abcdefgh'[square % 8]}</span>}
                {target && <span className="chess-target absolute h-[23%] w-[23%] rounded-full" />}
                {piece && <span key={piece} className={`chess-piece ${piece === piece.toUpperCase() ? 'chess-white-piece' : 'chess-black-piece'}`}>{GLYPHS[piece]}</span>}
              </button>
            );
          })}
        </div>
        <div className="chess-player mt-4 flex items-center justify-between px-2 py-2 text-sm"><span className="flex items-center gap-3"><span className="chess-avatar">♔</span>{names[0]}</span><span className="text-white/55">{text('movesCount', { n: moves.length })}</span></div>
      </div>
      {pendingPromotion && (
        <div className="glass-card rounded-2xl p-4">
          <p className="mb-3 font-semibold">{text('choosePromotion')}</p>
          <div className="flex gap-2">
            {(['q', 'r', 'b', 'n'] as Piece[]).map(piece => (
              <button key={piece} className="min-h-12 min-w-12 rounded-xl bg-white/15 text-3xl" onClick={() => play(pendingPromotion.find(move => move.promotion === piece)!)}>{GLYPHS[current.turn === 'w' ? piece.toUpperCase() : piece]}</button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button className="chess-action flex min-h-11 items-center gap-2 rounded-xl px-4 disabled:opacity-40" disabled={!moves.length || thinking || reviewing} onClick={undo}><Undo2 size={18} />{text('undo')}</button>
        {isTraining && <button className="chess-action flex min-h-11 items-center gap-2 rounded-xl px-4 disabled:opacity-40" disabled={!playerTurn || !!result || thinking} onClick={askHint}><Lightbulb size={18} />{text('hint')}</button>}
        <button className="chess-action chess-action-primary flex min-h-11 items-center gap-2 rounded-xl px-4 disabled:opacity-40" disabled={!moves.length || reviewing} onClick={analyze}><Search size={18} />{reviewing ? text('analyzingProgress', { done: reviewProgress, total: moves.length }) : text('analyze')}</button>
      </div>
      {hint && <div className="glass-card rounded-2xl p-4 text-sm"><strong>{text('suggestion')} {moveLabel(current, hint)}</strong><p className="mt-1 text-white/70">{text(`reasons.${describeMove(current, hint)}`)}</p></div>}
      <div className="glass-card rounded-2xl p-4">
        <h2 className="mb-2 flex items-center gap-2 font-semibold"><BookOpen size={18} />{text('moveHistory')}</h2>
        <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto">
          {moves.map((label, index) => <button key={index} onClick={() => setReviewIndex(index)} className={`min-h-9 rounded-lg px-2 text-sm ${reviewIndex === index ? 'bg-cyan-600' : 'bg-white/10'}`}>{index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ''} {label}</button>)}
        </div>
        {reviewIndex !== null && <button className="mt-2 text-sm text-cyan-300" onClick={() => setReviewIndex(null)}>{text('liveBoard')}</button>}
      </div>
      {review && (
        <div className="glass-card rounded-2xl p-4">
          <h2 className="mb-2 font-semibold">{text('analysisTitle')}</h2>
          <p className="mb-3 text-xs text-white/60">{text('analysisNote')}</p>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {review.map((item, index) => (
              <button key={index} onClick={() => setReviewIndex(index)} className="block min-h-11 w-full rounded-xl bg-white/10 p-3 text-left text-sm">
                <strong>{index + 1}. {item.label} — {text(`grades.${item.kind}`)}</strong>
                <span className="ml-2 text-white/60">−{(item.loss / 100).toFixed(2)}</span>
                <p className="text-white/75">{text('betterMove', { move: item.best })} {text(`reasons.${item.reason}`)}</p>
                {item.reply && <p className="text-amber-200/80">{text('opponentReply', { move: item.reply })}</p>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
