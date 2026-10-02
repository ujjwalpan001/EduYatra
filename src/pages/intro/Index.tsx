// frontend/src/pages/intro/Index.tsx - Interactive landing page with Deskoros Branding
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GraduationCap, BookOpen, Users, Award, Shield, ArrowRight, CheckCircle2,
  Sparkles, Brain, Rocket, ExternalLink, XCircle, BarChart3, Clock, MonitorPlay,
  FileQuestion, ClipboardCheck, RefreshCw, Building2, LineChart, ListChecks, Lightbulb, Zap, LogIn, ArrowUp
} from 'lucide-react';
import Navbar from './navbar';
import SiteFooter from './SiteFooter';
import { MCQ_URL } from './site';
import { getPublicSliders, getPublicPosters, getPublicAds, getPublicSuccessStories, getPublicVideo } from '@/lib/api/public';
import { API_URL } from '@/config/api';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* True once the element has scrolled into view (stays true) */
const useInView = <T extends HTMLElement>(threshold = 0.15) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
};

/* Fades content in once it scrolls into view */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [ref, shown] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
};

/* Thin bar at the top of the viewport showing scroll progress */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none">
      <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" style={{ transform: 'scaleX(0)' }}></div>
    </div>
  );
};

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

/* Bar chart that rises when scrolled into view */
const AnalyticsPreview: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const bars = [38, 55, 47, 68, 62, 84, 91];

  return (
    <div ref={ref} className="flex items-end gap-2 h-28">
      {bars.map((height, index) => (
        <div key={index} className="flex-1 h-full flex items-end">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-300 transition-all duration-1000 ease-out"
            style={{ height: inView ? `${height}%` : '6%', transitionDelay: `${index * 90}ms` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

const COMPARISON = [
  { before: 'Hours spent checking answer sheets by hand', after: 'Results ready the moment students submit' },
  { before: 'Questions scattered across notebooks and files', after: 'One central question bank with equation support' },
  { before: 'No clear view of who is struggling, or where', after: 'Topic-wise reports that highlight weak areas' },
  { before: 'Re-running a test for the whole class', after: 'Individual retests for specific students' },
];

const TAG_MESSAGES = ['Conduct offline MCQ tests', 'Printed papers with OMR sheets', 'mcq.deskoros.tech'];

/* Offline MCQ sign hanging from the navbar on two ropes: drops in, swings, cycles its message */
const HangingTag: React.FC = () => (
  <div className="relative z-20 flex justify-center pointer-events-none">
    <div className="relative pointer-events-auto">
      {/* Rope anchors fixed to the navbar edge */}
      <span className="absolute top-0 left-[10%] -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-white shadow"></span>
      <span className="absolute top-0 left-[90%] -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-white shadow"></span>

      <a
        href={MCQ_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Deskoros Offline MCQ, opens mcq.deskoros.tech"
        className="hang-swing group block pt-7"
      >
        {/* Ropes */}
        <span className="absolute top-0 left-[10%] -translate-x-1/2 w-[2px] h-[2.6rem] bg-white"></span>
        <span className="absolute top-0 left-[90%] -translate-x-1/2 w-[2px] h-[2.6rem] bg-white"></span>

        {/* Signboard */}
        <div className="hang-sign relative overflow-hidden rounded-lg bg-white p-1 w-[17.5rem] sm:w-[19rem]">
          {/* Navy fill that wipes across on hover */}
          <span className="hang-fill" aria-hidden="true"></span>
          <span className="hang-shine" aria-hidden="true"></span>
          {/* Eyelets */}
          <span className="absolute z-10 top-2 left-[10%] -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-slate-100 transition-colors duration-300 delay-150 group-hover:border-white/70 group-hover:bg-white/20"></span>
          <span className="absolute z-10 top-2 left-[90%] -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-slate-100 transition-colors duration-300 delay-150 group-hover:border-white/70 group-hover:bg-white/20"></span>

          <div className="relative rounded-md border border-slate-300 group-hover:border-white/25 px-5 pt-2 pb-2 text-center transition-colors duration-300 delay-150">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 group-hover:text-blue-100 transition-colors duration-300 delay-150">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-slate-500 group-hover:bg-white opacity-60 animate-ping"></span>
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors duration-300 delay-150"></span>
              </span>
              New · Now live
            </div>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[15px] sm:text-base font-extrabold text-slate-900 group-hover:text-white transition-colors duration-300 delay-150">
              Deskoros Offline MCQ
              {/* Arrow: nudges at rest; on hover it slides out and a new one slides in */}
              <span className="relative inline-flex w-4 h-4 overflow-hidden">
                <ArrowRight className="hang-arrow absolute w-4 h-4 text-slate-700 transition-transform duration-300 group-hover:translate-x-5" />
                <ArrowRight className="absolute w-4 h-4 text-white -translate-x-5 transition-transform duration-300 delay-100 group-hover:translate-x-0" />
              </span>
            </div>
            {/* Bottom line: rotating messages at rest, a call to action on hover */}
            <div className="relative h-4 overflow-hidden text-xs">
              <span className="absolute inset-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                <span className="hang-ticker absolute inset-x-0 top-0 flex flex-col">
                  {[...TAG_MESSAGES, TAG_MESSAGES[0]].map((message, index) => (
                    <span key={index} className="h-4 leading-4 whitespace-nowrap">{message}</span>
                  ))}
                </span>
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-1 font-semibold text-cyan-100 translate-y-full opacity-0 transition-all duration-300 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                Open mcq.deskoros.tech <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
);

const FLOATING_SYMBOLS = [
  { symbol: 'π', className: 'top-[14%] left-[6%] text-5xl', delay: '0s' },
  { symbol: '∑', className: 'top-[62%] left-[3%] text-4xl', delay: '1.2s' },
  { symbol: '√x', className: 'top-[22%] left-[46%] text-3xl', delay: '2.1s' },
  { symbol: 'E=mc²', className: 'bottom-[18%] left-[40%] text-2xl', delay: '0.6s' },
  { symbol: 'H₂O', className: 'top-[8%] right-[8%] text-3xl', delay: '1.8s' },
  { symbol: '∫', className: 'bottom-[24%] right-[4%] text-5xl', delay: '2.6s' },
  { symbol: 'Δ', className: 'top-[48%] right-[44%] text-3xl', delay: '3.2s' },
];

const ROTATING_WORDS = ['Smarter Exams', 'Daily Practice', 'Real Insights', 'Top Results'];

const SUBJECTS = [
  'Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science',
  'General Knowledge', 'Reasoning', 'Aptitude', 'History', 'Geography', 'Economics',
];

const SAMPLE_QUESTIONS = [
  {
    question: 'A ball is thrown vertically upward. What is its acceleration at the highest point?',
    options: ['Zero', 'g, directed downward', 'g, directed upward', 'Depends on the mass of the ball'],
  },
  {
    question: 'What is the atomic number of Carbon?',
    options: ['4', '12', '6', '14'],
  },
  {
    question: 'What is the derivative of sin(x) with respect to x?',
    options: ['−cos(x)', 'cos(x)', 'tan(x)', '−sin(x)'],
  },
];

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// The answer strip covers more questions than fit on the first page of the paper
const STRIP_QUESTION_COUNT = 5;
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const SHEET_WIDTH = 640;

/* Decorative QR-style block for the paper header (deterministic pattern) */
const QR_CELLS = (() => {
  const size = 21;
  const finders = [[0, 0], [14, 0], [0, 14]];
  const cells: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const finder = finders.find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
      if (finder) {
        const lx = x - finder[0];
        const ly = y - finder[1];
        const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        if (ring || core) cells.push([x, y]);
      } else if ((x * 7 + y * 13 + x * y) % 5 < 2) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
})();

/* Scales a fixed-width child down to fit narrow screens without horizontal scroll */
const ScaleToFit: React.FC<{ width: number; children: React.ReactNode }> = ({ width, children }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const next = Math.min(1, outer.clientWidth / width);
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };
    update();
    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={outerRef} style={{ height }} className="w-full">
      <div ref={innerRef} style={{ width, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
};

const Bubble: React.FC<{ filled: boolean; label?: string | number; size?: 'sm' | 'md'; onClick?: () => void; ariaLabel?: string }> = ({
  filled, label, size = 'sm', onClick, ariaLabel,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={filled}
    className={`rounded-full border flex items-center justify-center transition-colors ${
      size === 'md' ? 'w-[18px] h-[18px]' : 'w-[14px] h-[14px]'
    } ${filled ? 'bg-black border-black' : 'border-gray-800 hover:bg-gray-200'}`}
  >
    {!filled && label !== undefined && <span className="text-[6px] leading-none text-gray-700">{label}</span>}
  </button>
);

/* Preview of a Deskoros offline MCQ paper: question sheet plus OMR answer strip */
const OfflineMcqSheet: React.FC = () => {
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(STRIP_QUESTION_COUNT).fill(null));
  const [regNo, setRegNo] = useState<(number | null)[]>([null, null, null, null, null]);

  const markAnswer = (question: number, option: number) =>
    setAnswers((prev) => prev.map((value, i) => (i === question ? (value === option ? null : option) : value)));
  const markDigit = (column: number, digit: number) =>
    setRegNo((prev) => prev.map((value, i) => (i === column ? (value === digit ? null : digit) : value)));
  const clearSheet = () => {
    setAnswers(Array(STRIP_QUESTION_COUNT).fill(null));
    setRegNo([null, null, null, null, null]);
  };

  const filledCount = answers.filter((a) => a !== null).length + regNo.filter((d) => d !== null).length;

  return (
    <div className="space-y-4">
      <ScaleToFit width={SHEET_WIDTH}>
        <div className="flex bg-white text-black shadow-2xl shadow-blue-900/20 ring-1 ring-gray-200 select-none">
          {/* Question paper */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-center w-16">
                <img src="/logo.svg" alt="" className="w-9 h-9" />
                <span className="text-[10px] font-bold mt-0.5">Deskoros</span>
              </div>
              <div className="text-center font-serif leading-tight">
                <div className="text-lg font-bold">Institute Name</div>
                <div className="text-xs">Subject</div>
                <div className="text-xs font-bold">Exam</div>
                <div className="text-[11px] mt-0.5">Course Instructor: <span className="font-bold">Instructor</span></div>
              </div>
              <svg viewBox="0 0 21 21" className="w-14 h-14" shapeRendering="crispEdges" aria-hidden="true">
                {QR_CELLS.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />)}
              </svg>
            </div>

            <div className="border-t border-b border-black mt-3 py-1.5 flex justify-between font-serif text-[11px]">
              <span><b>Max Marks:</b> —</span>
              <span><b>Time:</b> —</span>
              <span><b>Paper ID:</b> 000000</span>
            </div>

            <div className="font-serif text-[11px] space-y-2.5 mt-3">
              <div className="flex items-center gap-2">
                <b>Name:</b>
                <div className="flex-1 h-5 border border-black"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <b>Regn No:</b>
                  <div className="flex">
                    {regNo.map((digit, i) => (
                      <div key={i} className="w-5 h-5 border border-black -ml-px first:ml-0 flex items-center justify-center text-[11px] font-sans font-bold">
                        {digit ?? ''}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <b>Section:</b>
                  <div className="w-14 border-b border-black"></div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <b className="mr-1">Date:</b>
                {[2, 2, 4].map((count, group) => (
                  <React.Fragment key={group}>
                    {group > 0 && <span>/</span>}
                    <div className="flex">
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="w-4 h-5 border border-black -ml-px first:ml-0"></div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="border border-black mt-3 p-1.5 font-serif text-[9.5px] leading-snug">
              <b>Instructions:</b> Fill each bubble completely with a dark pen or pencil. Only one answer per
              question. Fill the registration number bubbles in the answer strip on the right; the paper ID
              is pre-printed. Do not write outside the boxes.
            </div>

            <div className="mt-4 space-y-4 font-serif text-[12px] flex-1">
              {SAMPLE_QUESTIONS.map((q, qi) => (
                <div key={qi}>
                  <div className="flex gap-2">
                    <b>Q{qi + 1}.</b>
                    <span>{q.question}</span>
                  </div>
                  <div className="mt-1.5 ml-8 space-y-1">
                    {q.options.map((option, oi) => (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => markAnswer(qi, oi)}
                        className={`block text-left rounded px-1 -mx-1 transition-colors ${
                          answers[qi] === oi ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        <b className="mr-2">{String.fromCharCode(65 + oi)}.</b>{option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 text-[9px] font-sans">
              <span className="italic text-gray-600">Q4–Q5 continue on the next page</span>
              <span className="font-bold">—deskoros.tech</span>
            </div>
          </div>

          {/* OMR answer strip */}
          <div className="w-[200px] bg-white border-l-2 border-black p-2.5 flex flex-col justify-between gap-2.5 font-sans">
            <div className="bg-white border-[1.5px] border-black rounded-lg p-2">
              <div className="text-[7px] font-bold text-center mb-1.5">REGISTRATION NUMBER (5 DIGITS)</div>
              <div className="grid grid-cols-5 gap-y-1 justify-items-center">
                {regNo.map((digit, col) => (
                  <div key={col} className="w-5 h-5 border border-black flex items-center justify-center text-[10px] font-bold mb-1">
                    {digit ?? ''}
                  </div>
                ))}
                {DIGITS.map((digit) =>
                  regNo.map((value, col) => (
                    <Bubble
                      key={`${digit}-${col}`}
                      filled={value === digit}
                      label={digit}
                      onClick={() => markDigit(col, digit)}
                      ariaLabel={`Registration digit ${col + 1}: ${digit}`}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-black rounded-lg p-2">
              <div className="text-[7px] font-bold text-center mb-1.5">QUESTIONS (1-{STRIP_QUESTION_COUNT})</div>
              <div className="grid grid-cols-5 gap-y-1.5 items-center justify-items-center text-[7px] font-bold">
                <span>Q No.</span><span>A</span><span>B</span><span>C</span><span>D</span>
                {answers.map((_, qi) => (
                  <React.Fragment key={qi}>
                    <span className="font-normal">{qi + 1}.</span>
                    {OPTION_LETTERS.map((letter, oi) => (
                      <Bubble
                        key={oi}
                        size="md"
                        filled={answers[qi] === oi}
                        onClick={() => markAnswer(qi, oi)}
                        ariaLabel={`Question ${qi + 1}, option ${letter}`}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-black rounded-lg p-2">
              <div className="text-[7px] font-bold text-center mb-1.5">PAPER ID (6 DIGITS)</div>
              <div className="grid grid-cols-6 gap-y-1 justify-items-center">
                {Array.from({ length: 6 }).map((_, col) => (
                  <div key={col} className="w-5 h-5 border-2 border-black flex items-center justify-center text-[10px] font-bold mb-1">0</div>
                ))}
                {DIGITS.map((digit) =>
                  Array.from({ length: 6 }).map((_, col) => (
                    <span
                      key={`${digit}-${col}`}
                      className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${digit === 0 ? 'bg-black border-black' : 'border-gray-800'}`}
                    >
                      {digit !== 0 && <span className="text-[6px] leading-none text-gray-700">{digit}</span>}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </ScaleToFit>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-gray-500">
          {filledCount === 0 ? 'Tap the bubbles to fill them in, just like on paper.' : `${filledCount} bubble${filledCount === 1 ? '' : 's'} filled`}
        </span>
        {filledCount > 0 && (
          <button type="button" onClick={clearSheet} className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

const ROLES = [
  {
    key: 'students',
    label: 'Students',
    icon: GraduationCap,
    heading: 'Practice with purpose, track every step',
    description: 'Learn topic by topic, take practice exams and see exactly where you stand before the real test.',
    points: [
      { icon: Lightbulb, text: 'Learn by topic with structured question sets' },
      { icon: ListChecks, text: 'Practice exams with instant results' },
      { icon: LineChart, text: 'Personal performance analytics over time' },
      { icon: FileQuestion, text: 'Review answers with full solutions' },
    ],
    cta: { to: '/signin', label: 'Login as Student' },
  },
  {
    key: 'teachers',
    label: 'Teachers',
    icon: BookOpen,
    heading: 'Create, conduct and evaluate in one place',
    description: 'Build question banks with math support, run online or offline tests and monitor students live.',
    points: [
      { icon: FileQuestion, text: 'Question creation with equation (LaTeX) support' },
      { icon: MonitorPlay, text: 'Conduct online tests with live monitoring' },
      { icon: RefreshCw, text: 'Individual retests for specific students' },
      { icon: BarChart3, text: 'Test-wise and student-wise analysis' },
    ],
    cta: { to: '/signin', label: 'Login as Teacher' },
  },
  {
    key: 'institutes',
    label: 'Institutes',
    icon: Building2,
    heading: 'Run your entire institute with confidence',
    description: 'Manage classes, teachers, students and exams from a single admin dashboard.',
    points: [
      { icon: Users, text: 'Manage students, teachers and classes' },
      { icon: ClipboardCheck, text: 'Centralised exams and question banks' },
      { icon: Shield, text: 'Role-based access and audit logs' },
      { icon: Award, text: 'Institute-wide analytics and reports' },
    ],
    cta: { to: '/signin', label: 'Login as Institute' },
  },
];

const FEATURES = [
  { icon: GraduationCap, title: 'For Students', description: 'Practice exams, track progress, excel in studies' },
  { icon: BookOpen, title: 'For Teachers', description: 'Create tests, manage classes, monitor performance' },
  { icon: Users, title: 'For Institutes', description: 'Complete management system for institutions' },
  { icon: Award, title: 'Smart Analytics', description: 'Detailed insights and performance tracking' },
  { icon: Shield, title: 'Secure Platform', description: 'Enterprise-grade security for your data' },
  { icon: Rocket, title: 'Fast & Reliable', description: 'Lightning-fast performance you can count on' },
];

const STEPS = [
  { icon: Users, title: 'Create your account', description: 'Sign up as a student, teacher or institute.' },
  { icon: FileQuestion, title: 'Build or pick tests', description: 'Use question banks or create your own questions with equations.' },
  { icon: Clock, title: 'Attempt & monitor', description: 'Take timed tests online while teachers monitor in real time.' },
  { icon: BarChart3, title: 'Analyse & improve', description: 'Get detailed reports, find weak topics and retest to improve.' },
];

const FAQS = [
  { q: 'How do I get an account?', a: 'Sign-up is currently invite-only. Contact the Deskoros team to get an invite code, then create your account from the sign-up page.' },
  { q: 'What is Deskoros Offline MCQ?', a: 'Deskoros Offline MCQ, at mcq.deskoros.tech, is our dedicated platform for conducting offline MCQ tests.' },
  { q: 'Can teachers conduct both online and offline tests?', a: 'Yes. Teachers can run online tests with live monitoring, or conduct offline tests and record results on the platform.' },
  { q: 'Does it support math and science equations?', a: 'Yes. Questions support LaTeX, so formulas, equations and symbols render cleanly for students.' },
  { q: 'Can a single student be given a retest?', a: 'Yes. Teachers can schedule an individual retest for specific students without affecting the rest of the class.' },
];

const Index: React.FC = () => {
  const [sliders, setSliders] = useState<any[]>([]);
  const [posters, setPosters] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [video, setVideo] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Presentation-only UI state
  const [wordIndex, setWordIndex] = useState(0);
  const [activeRole, setActiveRole] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  // Hide the browser scrollbar on the landing page only; the scroll progress bar replaces it
  useEffect(() => {
    document.documentElement.classList.add('landing-no-scrollbar');
    return () => document.documentElement.classList.remove('landing-no-scrollbar');
  }, []);

  const fetchContent = async () => {
    try {
      const [slidersRes, postersRes, adsRes, storiesRes, videoRes] = await Promise.allSettled([
        getPublicSliders(),
        getPublicPosters(),
        getPublicAds(),
        getPublicSuccessStories(),
        getPublicVideo()
      ]);

      setSliders(slidersRes.status === 'fulfilled' ? (slidersRes.value as any)?.sliders || [] : []);
      setPosters(postersRes.status === 'fulfilled' ? (postersRes.value as any)?.posters || [] : []);
      setAds(adsRes.status === 'fulfilled' ? (adsRes.value as any)?.ads || [] : []);
      setSuccessStories(storiesRes.status === 'fulfilled' ? (storiesRes.value as any)?.stories || [] : []);
      setVideo(videoRes.status === 'fulfilled' ? (videoRes.value as any)?.video || null : null);

      if (slidersRes.status === 'rejected') console.error('Failed to load sliders:', slidersRes.reason);
      if (postersRes.status === 'rejected') console.error('Failed to load posters:', postersRes.reason);
      if (adsRes.status === 'rejected') console.error('Failed to load ads:', adsRes.reason);
      if (storiesRes.status === 'rejected') console.error('Failed to load success stories:', storiesRes.reason);
      if (videoRes.status === 'rejected') console.error('Failed to load video:', videoRes.reason);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    if (sliders.length > 0 && !isSliderHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
      }, 4000); // Auto-slide every 4 seconds
      return () => clearInterval(interval);
    }
  }, [sliders, isSliderHovered]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const trackAdClick = async (adId: string) => {
    try {
      await fetch(`${API_URL}/public/ads/${adId}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  // Mouse-following glow in the hero, written to CSS vars to avoid re-renders
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    if (prefersReducedMotion()) return;
    el.style.setProperty('--ry', `${((e.clientX - rect.left) / rect.width - 0.5) * 8}deg`);
    el.style.setProperty('--rx', `${((e.clientY - rect.top) / rect.height - 0.5) * -8}deg`);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const role = ROLES[activeRole];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <ScrollProgress />
      <Navbar overHero />
      <BackToTop />

      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => {
          heroRef.current?.style.setProperty('--rx', '0deg');
          heroRef.current?.style.setProperty('--ry', '0deg');
        }}
        className="relative overflow-hidden flex flex-col pt-[4.5rem] lg:min-h-[100svh] bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-600 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-xl shadow-blue-900/10"
      >
        {/* Grid pattern + glow */}
        <div className="absolute inset-0 hero-grid opacity-40"></div>
        <div className="absolute inset-0 hero-spotlight pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none select-none hidden md:block" aria-hidden="true">
          {FLOATING_SYMBOLS.map((item) => (
            <span
              key={item.symbol}
              className={`absolute font-serif italic text-white/10 animate-float ${item.className}`}
              style={{ animationDelay: item.delay }}
            >
              {item.symbol}
            </span>
          ))}
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        {/* Offline MCQ sign hanging from the navbar */}
        <HangingTag />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 lg:py-6 flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-left space-y-6 lg:space-y-5 min-w-0">

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                Transform Learning
                <br />
                into{' '}
                <span key={wordIndex} className="inline-block word-swap bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent">
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-xl">
                Empowering educators and students with cutting-edge technology.
                Create, manage, and excel in examinations with Deskoros.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/signin">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-7 h-12 text-base rounded-xl shadow-xl shadow-blue-950/30 hover:-translate-y-0.5 transition-all font-bold">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href={MCQ_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-cyan-400 text-blue-950 hover:bg-cyan-300 px-7 h-12 text-base rounded-xl shadow-xl shadow-cyan-900/30 hover:-translate-y-0.5 transition-all font-bold">
                    <ClipboardCheck className="mr-2 w-5 h-5" />
                    Offline MCQ
                  </Button>
                </a>
                <Link to="/signin">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white px-5 h-12 text-base rounded-xl">
                    <LogIn className="mr-2 w-5 h-5" />
                    Login
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {[
                  { icon: MonitorPlay, label: 'Live test monitoring' },
                  { icon: ClipboardCheck, label: 'Offline MCQ tests' },
                  { icon: BarChart3, label: 'Detailed analytics' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-xs sm:text-sm font-medium text-blue-50">
                    <item.icon className="w-4 h-4 text-cyan-300" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative max-w-lg mx-auto hero-tilt">
                {/* Floating chips */}
                <div className="hidden sm:flex absolute -left-8 top-10 z-20 items-center gap-2 bg-white rounded-xl shadow-2xl px-3 py-2 animate-float">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 leading-none">On submission</div>
                    <div className="text-sm font-bold text-gray-900">Instant results</div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute -right-6 bottom-16 z-20 items-center gap-2 bg-white rounded-xl shadow-2xl px-3 py-2 animate-float-reverse">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 leading-none">Reports</div>
                    <div className="text-sm font-bold text-gray-900">Topic-wise insights</div>
                  </div>
                </div>

                {/* Slider Carousel */}
                {sliders.length > 0 ? (
                  <div
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/40 bg-white ring-1 ring-white/20 group"
                    onMouseEnter={() => setIsSliderHovered(true)}
                    onMouseLeave={() => setIsSliderHovered(false)}
                  >
                    {sliders.map((slider, index) => (
                      <div
                        key={slider._id}
                        className={`transition-all duration-700 ${
                          index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                        }`}
                      >
                        <div className="relative h-[240px] sm:h-[380px] 2xl:h-[420px]">
                          <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent flex items-end">
                            <div className="p-6 text-white w-full">
                              <Badge className="mb-2 bg-cyan-500 hover:bg-cyan-500 text-white px-3 py-1 text-xs">Latest</Badge>
                              <h3 className="text-xl font-bold mb-2">{slider.title}</h3>
                              <p className="text-sm mb-3 text-blue-50">{slider.description}</p>
                              {slider.link_url && (
                                <a href={slider.link_url} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Navigation Dots */}
                    <div className="absolute top-4 right-4 flex space-x-1.5 bg-blue-950/50 px-3 py-2 rounded-full backdrop-blur-sm">
                      {sliders.map((_, index) => (
                        <button
                          key={index}
                          aria-label={`Go to slide ${index + 1}`}
                          onClick={() => setCurrentSlide(index)}
                          className={`transition-all duration-300 rounded-full h-2 ${
                            index === currentSlide
                              ? 'bg-white w-6'
                              : 'bg-white/50 w-2 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Arrow Navigation */}
                    {sliders.length > 1 && (
                      <>
                        <button
                          aria-label="Previous slide"
                          onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                          aria-label="Next slide"
                          onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  /* Feature overview shown until slider content is available */
                  <div className="relative rounded-3xl bg-white/95 backdrop-blur shadow-2xl shadow-blue-950/40 ring-1 ring-white/30 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <img src="/logo.svg" alt="" className="w-10 h-10" />
                      <div>
                        <div className="font-bold text-gray-900">Deskoros</div>
                        <div className="text-xs text-gray-500">Everything for exams, in one place</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: FileQuestion, title: 'Question bank', text: 'Create questions with equation support' },
                        { icon: MonitorPlay, title: 'Online tests', text: 'Conduct tests with live monitoring' },
                        { icon: ClipboardCheck, title: 'Offline MCQ', text: 'Run offline MCQ tests with ease' },
                        { icon: BarChart3, title: 'Analytics', text: 'Test-wise and student-wise reports' },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subject marquee */}
        <div className="relative z-10 bg-white/5 py-4 overflow-hidden marquee-fade">
          <div className="flex w-max marquee">
            {[...SUBJECTS, ...SUBJECTS].map((subject, index) => (
              <span key={index} className="mx-6 inline-flex items-center gap-2 text-sm font-medium text-blue-100/80 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Offline MCQ Spotlight */}
      <section id="offline-mcq" className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="space-y-6">
                <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 mr-1" /> Deskoros Offline MCQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Offline MCQ tests,{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">made simple.</span>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Printed question papers with a built-in OMR answer strip, ready for your classroom.
                  Here is what a paper looks like. Go ahead, fill in a few bubbles. Then head over to{' '}
                  <a href={MCQ_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    mcq.deskoros.tech
                  </a>.
                </p>
                <ul className="space-y-3">
                  {[
                    'Question paper and OMR answer strip on one sheet',
                    'Registration number and pre-printed paper ID bubbles',
                    'Built for classrooms, schools and institutes',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={MCQ_URL} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-7 h-12 rounded-xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all font-semibold">
                    Go to Offline MCQ
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </Reveal>

            {/* Offline MCQ paper preview */}
            <Reveal delay={150}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[2rem] opacity-15 blur-2xl"></div>
                <div className="relative">
                  <OfflineMcqSheet />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {video && (
        <section className="panel-dark relative overflow-hidden mx-3 sm:mx-6 lg:mx-8 my-6 sm:my-10 rounded-[2rem] sm:rounded-[2.5rem] py-16 lg:py-24">
          <div className="band-glow" style={{ background: 'radial-gradient(60% 50% at 30% 50%, rgba(37, 99, 235, 0.35), transparent 70%), radial-gradient(40% 40% at 85% 50%, rgba(34, 211, 238, 0.18), transparent 70%)' }}></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-4 gap-10 items-stretch">
              {/* Video Side - Takes 3 columns */}
              <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <div className="aspect-video">
                  <iframe
                    src={`${video.video_url}?autoplay=1&mute=1&loop=1&playlist=${video.video_url.split('/').pop()}`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Feature Points Poster - Takes 1 column */}
              <div className="lg:col-span-1 relative">
                {/* Notice Board Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-100 rounded-2xl shadow-inner opacity-40 blur-sm"></div>

                {/* Paper Sheet with Blue Tint */}
                <div className="relative h-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-500" style={{
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(147, 197, 253, 0.3)',
                  backgroundImage: 'linear-gradient(to bottom, rgba(239, 246, 255, 0.95) 95%, rgba(219, 234, 254, 0.95) 100%)'
                }}>
                  {/* Push Pins */}
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-blue-500 rounded-full shadow-lg z-20 border-2 border-blue-600">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                  <div className="absolute -top-2 right-8 w-4 h-4 bg-cyan-500 rounded-full shadow-lg z-20 border-2 border-cyan-600">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full"></div>
                  </div>

                  {/* Paper Texture with Blue Tint */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4" /%3E%3C/svg%3E")'
                  }}></div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    {/* Header with Tape Effect */}
                    <div className="space-y-4">
                      {/* Washi Tape with Blue Theme */}
                      <div className="absolute top-4 left-0 right-0 h-8 bg-blue-200/50 border-t border-b border-blue-300/60 -mx-2 transform -rotate-1" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(147, 197, 253, 0.2) 10px, rgba(147, 197, 253, 0.2) 20px)'
                      }}></div>

                      <div className="relative pt-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2" style={{
                          fontFamily: "'Caveat', 'Segoe Print', cursive",
                          textShadow: '1px 1px 0px rgba(59, 130, 246, 0.1)'
                        }}>
                          {video.title}
                        </h2>
                        <p className="text-sm text-blue-700 leading-relaxed" style={{
                          fontFamily: "'Patrick Hand', 'Comic Sans MS', cursive"
                        }}>
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Feature Points - Handwritten List */}
                    {video.feature_points && video.feature_points.length > 0 && (
                      <div className="space-y-4 mt-6">
                        {video.feature_points.map((point: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 group transform hover:translate-x-1 transition-all duration-300"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {/* Hand-drawn checkmark in blue */}
                              <div className="relative w-6 h-6">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-blue-600 transform group-hover:scale-110 transition-transform">
                                  <path
                                    d="M4 12l5 5L20 7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                      filter: 'url(#pencil)',
                                      strokeDasharray: '30',
                                      strokeDashoffset: '0'
                                    }}
                                  />
                                </svg>
                              </div>
                            </div>
                            <p className="text-sm md:text-base text-blue-800 leading-relaxed font-medium" style={{
                              fontFamily: "'Caveat', 'Segoe Print', cursive",
                              fontSize: '1.1rem',
                              lineHeight: '1.6'
                            }}>
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Section with Stamp Effect */}
                    <div className="mt-6 pt-4 border-t-2 border-dashed border-blue-300 relative">
                      <div className="flex items-center justify-between">
                        {/* Stamp in Blue */}
                        <div className="relative">
                          <div className="px-3 py-1.5 border-2 border-blue-600 rounded-md transform -rotate-6 bg-blue-100/70">
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider" style={{ fontFamily: "'Courier New', monospace" }}>
                              Featured
                            </span>
                          </div>
                        </div>

                        {/* Signature Style */}
                        <span className="text-sm text-blue-600" style={{
                          fontFamily: "'Caveat', cursive",
                          fontSize: '1rem'
                        }}>
                          - Deskoros
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Paper Corner Fold with Blue Tint */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-200 to-blue-100 transform rotate-45 origin-bottom-right translate-x-1/2 translate-y-1/2 shadow-inner"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Built for everyone - interactive role tabs */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <Badge className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold">Built for everyone</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                One platform, every role in education
              </h2>
              <p className="text-gray-600">Choose your role to see how Deskoros fits into your day.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-200">
                {ROLES.map((r, index) => (
                  <button
                    key={r.key}
                    onClick={() => setActiveRole(index)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeRole === index
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <r.icon className="w-4 h-4" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div key={role.key} className="grid lg:grid-cols-5 gap-8 items-center fade-in">
            <div className="lg:col-span-2 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <role.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{role.heading}</h3>
              <p className="text-gray-600 leading-relaxed">{role.description}</p>
              <Link to={role.cta.to}>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-6 mt-2">
                  {role.cta.label} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {role.points.map((point, index) => (
                <div
                  key={point.text}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="fade-in-up bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <point.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="panel-dark relative overflow-hidden mx-3 sm:mx-6 lg:mx-8 my-6 sm:my-10 rounded-[2rem] sm:rounded-[2.5rem] py-16 lg:py-24">
        <div className="band-glow" style={{ background: 'radial-gradient(55% 45% at 50% 30%, rgba(34, 211, 238, 0.14), transparent 70%), radial-gradient(60% 50% at 80% 75%, rgba(37, 99, 235, 0.4), transparent 70%), radial-gradient(50% 45% at 15% 70%, rgba(29, 78, 216, 0.35), transparent 70%)' }}></div>
        <div className="absolute inset-0 hero-grid opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-white/10 text-cyan-200 hover:bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold">Why Choose Deskoros</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white tracking-tight">
                Everything You Need
              </h2>
              <p className="text-blue-200/80 max-w-2xl mx-auto">
                Comprehensive tools for modern education
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-auto">
            {/* Live monitoring - large tile */}
            <Reveal className="md:col-span-2 lg:row-span-2">
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bento-icon"><MonitorPlay className="w-5 h-5 text-white" /></div>
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{FEATURES[1].title}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Watch every test unfold, live</h3>
                  <p className="text-sm text-blue-200/80 mb-6 max-w-md">{FEATURES[1].description}. Follow every online test as it happens.</p>
                  <div className="mt-auto grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: MonitorPlay, text: 'Live monitoring of online tests' },
                      { icon: FileQuestion, text: 'Questions with LaTeX equations' },
                      { icon: RefreshCw, text: 'Individual student retests' },
                      { icon: BarChart3, text: 'Test and student analysis' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 rounded-xl bg-blue-950/60 border border-white/10 px-4 py-3">
                        <item.icon className="w-4 h-4 text-cyan-300 shrink-0" />
                        <span className="text-sm text-blue-50">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Analytics */}
            <Reveal delay={80} className="md:col-span-2">
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10 grid sm:grid-cols-2 gap-6 items-end">
                  <div>
                    <div className="bento-icon mb-4"><Award className="w-5 h-5 text-white" /></div>
                    <h3 className="text-lg font-bold text-white mb-2">{FEATURES[3].title}</h3>
                    <p className="text-sm text-blue-200/80">{FEATURES[3].description}, test by test and topic by topic.</p>
                  </div>
                  <AnalyticsPreview />
                </div>
              </div>
            </Reveal>

            {/* Students progress */}
            <Reveal delay={160}>
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10 h-full">
                  <div className="bento-icon mb-4"><GraduationCap className="w-5 h-5 text-white" /></div>
                  <h3 className="text-lg font-bold text-white mb-1">{FEATURES[0].title}</h3>
                  <p className="text-sm text-blue-200/80">{FEATURES[0].description}</p>
                </div>
              </div>
            </Reveal>

            {/* Equations */}
            <Reveal delay={240}>
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="rounded-xl bg-blue-950/60 border border-white/10 py-4 px-3 text-center font-serif italic text-xl text-cyan-100 mb-4">
                    ∫<sub className="text-xs">0</sub><sup className="text-xs">1</sup> x² dx = ⅓
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Math-ready questions</h3>
                  <p className="text-sm text-blue-200/80">Write formulas with LaTeX and they render cleanly for every student.</p>
                </div>
              </div>
            </Reveal>

            {/* Institutes */}
            <Reveal delay={80}>
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10">
                  <div className="bento-icon mb-4"><Users className="w-5 h-5 text-white" /></div>
                  <h3 className="text-lg font-bold text-white mb-1">{FEATURES[2].title}</h3>
                  <p className="text-sm text-blue-200/80">{FEATURES[2].description}</p>
                </div>
              </div>
            </Reveal>

            {/* Online + offline */}
            <Reveal delay={160} className="md:col-span-2">
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10 grid sm:grid-cols-2 gap-5 items-center">
                  <div>
                    <div className="bento-icon mb-4"><ClipboardCheck className="w-5 h-5 text-white" /></div>
                    <h3 className="text-lg font-bold text-white mb-1">Online &amp; offline tests</h3>
                    <p className="text-sm text-blue-200/80">Run tests on screen with live monitoring, or conduct offline MCQ tests with Deskoros Offline MCQ.</p>
                  </div>
                  <div className="space-y-3">
                    <Link to="/signin" className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-cyan-400/50 hover:bg-white/10 transition-all">
                      <span className="flex items-center gap-2 text-sm font-semibold text-white"><MonitorPlay className="w-4 h-4 text-cyan-300" /> Online tests</span>
                      <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href={MCQ_URL} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 hover:border-cyan-300 hover:bg-cyan-400/20 transition-all">
                      <span className="flex items-center gap-2 text-sm font-semibold text-white"><ClipboardCheck className="w-4 h-4 text-cyan-300" /> Offline MCQ</span>
                      <ExternalLink className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Security */}
            <Reveal delay={240}>
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile h-full">
                <div className="relative z-10">
                  <div className="bento-icon mb-4"><Shield className="w-5 h-5 text-white" /></div>
                  <h3 className="text-lg font-bold text-white mb-1">{FEATURES[4].title}</h3>
                  <p className="text-sm text-blue-200/80">{FEATURES[4].description}, with role-based access and audit logs.</p>
                </div>
              </div>
            </Reveal>

            {/* Retests + speed, full width strip */}
            <Reveal delay={80} className="md:col-span-2 lg:col-span-4">
              <div onMouseMove={handleCardMouseMove} className="spotlight-card bento-tile">
                <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bento-icon shrink-0"><RefreshCw className="w-5 h-5 text-white" /></div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Individual retests</h3>
                      <p className="text-sm text-blue-200/80">Give a single student another attempt without disturbing the rest of the class.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bento-icon shrink-0"><Rocket className="w-5 h-5 text-white" /></div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{FEATURES[5].title}</h3>
                      <p className="text-sm text-blue-200/80">{FEATURES[5].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <Badge className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold">The difference</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Leave the paperwork behind
              </h2>
              <p className="text-gray-600">Flip the switch to see how Deskoros changes a teacher's week.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowAfter((prev) => !prev)}
                aria-pressed={showAfter}
                className="flex items-center gap-3 bg-white rounded-full border border-gray-200 shadow-sm pl-5 pr-2 py-2"
              >
                <span className={`text-sm font-semibold transition-colors ${showAfter ? 'text-gray-400' : 'text-gray-900'}`}>Traditional</span>
                <span className={`relative w-14 h-7 rounded-full transition-colors ${showAfter ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${showAfter ? 'left-8' : 'left-1'}`}></span>
                </span>
                <span className={`text-sm font-semibold pr-3 transition-colors ${showAfter ? 'text-blue-700' : 'text-gray-400'}`}>With Deskoros</span>
              </button>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-3">
            {COMPARISON.map((row, index) => (
              <Reveal key={row.before} delay={index * 80}>
                <div className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-500 ${
                  showAfter ? 'bg-white border-blue-200 shadow-md shadow-blue-100' : 'bg-white/60 border-gray-200'
                }`}>
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-500 ${showAfter ? 'bg-emerald-100' : 'bg-red-50'}`}>
                    {showAfter ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                  <p key={String(showAfter)} className={`fade-in text-sm sm:text-base font-medium ${showAfter ? 'text-gray-900' : 'text-gray-500 line-through decoration-red-300'}`}>
                    {showAfter ? row.after : row.before}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <Badge className="mb-3 bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold">How it works</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                From sign-up to success in 4 steps
              </h2>
            </div>
          </Reveal>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200"></div>
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 120}>
                <div className="relative text-center group">
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-white border-2 border-blue-100 flex items-center justify-center shadow-md group-hover:border-cyan-400 group-hover:shadow-cyan-200 group-hover:-translate-y-1 transition-all">
                    <step.icon className="w-7 h-7 text-blue-600" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 max-w-[240px] mx-auto">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Posters Section - Updates & Events */}
      {posters.length > 0 && (
        <section className="py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="text-center mb-10">
                <Badge className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold">
                  Updates & Events
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 tracking-tight">
                  Stay Informed
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The latest announcements, events and updates
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-6">
              {posters.map((poster, index) => (
                <Reveal key={poster._id} delay={(index % 4) * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
                  <Card className="h-full overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                    <div className="relative overflow-hidden">
                      <img
                        src={poster.image_url}
                        alt={poster.title}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-base mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{poster.title}</h3>
                      {poster.description && (
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{poster.description}</p>
                      )}
                      {poster.link_url && (
                        <a href={poster.link_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs py-2">
                            View Details <ArrowRight className="ml-1 w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery Slider - Student Success Stories */}
      {successStories.length > 0 && (
        <section className="panel-dark relative overflow-hidden mx-3 sm:mx-6 lg:mx-8 my-6 sm:my-10 rounded-[2rem] sm:rounded-[2.5rem] panel-bright py-16 lg:py-24">
          <div className="band-glow" style={{ background: 'radial-gradient(60% 55% at 80% 50%, rgba(6, 182, 212, 0.45), transparent 70%), radial-gradient(50% 50% at 15% 40%, rgba(59, 130, 246, 0.35), transparent 70%)' }}></div>
          <div className="absolute inset-0 hero-grid opacity-20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="text-center mb-10">
                <Badge className="mb-3 bg-white/15 text-white hover:bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold">
                  Success Stories
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                  Real Results from Real Students
                </h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  See how Deskoros transforms education
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-6">
              {successStories.map((story, index) => (
                <Reveal key={story._id} delay={(index % 3) * 100} className="w-full md:w-[calc(33.333%-16px)]">
                  <Card className="overflow-hidden rounded-2xl group border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="relative overflow-hidden h-56">
                      <img src={story.image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-sm mb-1">{story.title}</h3>
                        <p className="text-xs text-blue-100">{story.description}</p>
                      </div>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advertisements - Sponsored Content */}
      {ads.length > 0 && (
        <section className="py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="text-center mb-10">
                <Badge className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold">
                  Featured Partners
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                  Trusted Brands
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Partners who help us bring better learning to everyone
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {ads.filter(ad => ad.placement === 'home' || ad.placement === 'global').slice(0, 3).map((ad) => (
                <a
                  key={ad._id}
                  href={ad.link_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAdClick(ad._id)}
                  className="group w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <Card className="overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 bg-white">
                    <div className="relative overflow-hidden">
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                          {ad.ad_type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Sponsored</span>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                        {ad.title}
                      </h3>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            {ads.length > 3 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg rounded-xl">
                  View All Partners <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <Reveal>
              <div className="space-y-4">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold">FAQ</Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Questions? We have answers.</h2>
                <p className="text-gray-600">Ready to begin? Log in to your account and get started.</p>
                <Link to="/signin" className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 gap-1 transition-all">
                  Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-2">
              <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={faq.q}
                    value={`faq-${index}`}
                    className="bg-white border border-gray-200 rounded-xl px-5 data-[state=open]:border-blue-300 data-[state=open]:shadow-md transition-all"
                  >
                    <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline hover:text-blue-700">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 px-6 py-16 sm:px-12 text-center text-white shadow-2xl shadow-blue-900/20">
              <div className="absolute inset-0 hero-grid opacity-30"></div>
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <Badge className="mb-4 bg-white/15 text-white hover:bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold">
                  Get Started Today
                </Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  Ready to Transform Learning?
                </h2>
                <p className="text-base md:text-lg mb-8 text-blue-100">
                  Bring your students, teachers and institute together on Deskoros
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/signin">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 h-12 text-base rounded-xl shadow-xl hover:-translate-y-0.5 transition-all font-bold">
                      Get Started <Rocket className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <a href={MCQ_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-cyan-400 text-blue-950 hover:bg-cyan-300 px-8 h-12 text-base rounded-xl shadow-xl hover:-translate-y-0.5 transition-all font-bold">
                      Offline MCQ <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                  <Link to="/signin">
                    <Button size="lg" variant="outline" className="border-2 border-white/70 bg-transparent text-white hover:bg-white hover:text-blue-700 px-8 h-12 text-base rounded-xl transition-all">
                      <LogIn className="mr-2 w-5 h-5" />
                      Login
                    </Button>
                  </Link>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes word-in {
          from { opacity: 0; transform: translateY(0.4em); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bar-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        .animate-blob { animation: blob 9s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 6s ease infinite; }
        .marquee { animation: marquee 35s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        .word-swap { animation: word-in 0.5s ease-out; }
        .fade-in { animation: fade-in 0.4s ease-out; }
        .fade-in-up { animation: fade-in-up 0.45s ease-out both; }
        .bar-grow { transform-origin: left; animation: bar-grow 1.2s ease-out; }
        .shake { animation: shake 0.4s ease-in-out; }

        .hero-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
        .hero-spotlight {
          background: radial-gradient(600px circle at var(--mx, 70%) var(--my, 30%), rgba(103, 232, 249, 0.15), transparent 45%);
        }
        .spotlight-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), rgba(34, 211, 238, 0.18), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .spotlight-card:hover::before { opacity: 1; }

        /* Hanging Offline MCQ sign */
        .hang-swing {
          position: relative;
          transform-origin: 50% 0;
          animation: hang-drop 1.4s cubic-bezier(0.34, 1.45, 0.64, 1) both, hang-swing 5s ease-in-out 1.4s infinite;
        }
        .hang-swing:hover { animation-play-state: paused; }
        .hang-sign {
          transform-origin: 50% -1.75rem;
          box-shadow: 0 16px 30px -14px rgba(2, 6, 23, 0.7), 0 2px 6px rgba(2, 6, 23, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        /* Hover: the board gets bumped (jiggle around the rope line), lifts, and a navy fill wipes across */
        .hang-swing:hover .hang-sign {
          animation: hang-jiggle 0.9s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
          box-shadow: 0 26px 44px -14px rgba(2, 6, 23, 0.8), 0 0 0 3px rgba(255, 255, 255, 0.35), 0 0 30px rgba(125, 211, 252, 0.25);
        }
        .hang-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, #0f1c48, #1e3a8a);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
          pointer-events: none;
        }
        .hang-swing:hover .hang-fill { transform: scaleX(1); }
        .hang-swing:hover .hang-shine { animation: hang-shine-fast 0.9s ease-out 0.25s; }
        @keyframes hang-jiggle {
          0% { transform: rotate(0deg) translateY(0) scale(1); }
          15% { transform: rotate(4deg) translateY(-2px) scale(1.02); }
          30% { transform: rotate(-3deg) translateY(-3px) scale(1.035); }
          45% { transform: rotate(2deg) translateY(-3px) scale(1.04); }
          60% { transform: rotate(-1deg) translateY(-3px) scale(1.04); }
          80% { transform: rotate(0.5deg) translateY(-3px) scale(1.04); }
          100% { transform: rotate(0deg) translateY(-3px) scale(1.04); }
        }
        @keyframes hang-shine-fast {
          from { left: -50%; }
          to { left: 130%; }
        }
        .hang-shine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -50%;
          width: 40%;
          background: linear-gradient(100deg, transparent, rgba(148, 163, 184, 0.22), transparent);
          transform: skewX(-20deg);
          animation: hang-shine 5s ease-in-out 2s infinite;
          pointer-events: none;
        }
        .hang-ticker { animation: hang-ticker 9s cubic-bezier(0.65, 0, 0.35, 1) 1.4s infinite; }
        .hang-arrow { animation: hang-nudge 1.6s ease-in-out infinite; }
        .hang-swing:hover .hang-arrow { animation: none; }
        @keyframes hang-drop {
          0% { opacity: 0; transform: translateY(-120%) rotate(0deg); }
          55% { opacity: 1; transform: translateY(0) rotate(5deg); }
          75% { transform: rotate(-3deg); }
          90% { transform: rotate(1.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes hang-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2.5deg); }
          75% { transform: rotate(-2.5deg); }
        }
        @keyframes hang-shine {
          0% { left: -50%; }
          30%, 100% { left: 130%; }
        }
        @keyframes hang-ticker {
          0%, 26% { transform: translateY(0); }
          33%, 59% { transform: translateY(-1rem); }
          66%, 92% { transform: translateY(-2rem); }
          100% { transform: translateY(-3rem); }
        }
        @keyframes hang-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        html.landing-no-scrollbar { scrollbar-width: none; }
        html.landing-no-scrollbar::-webkit-scrollbar { display: none; }

        .hero-tilt {
          transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.3s ease-out;
          transform-style: preserve-3d;
        }
        .bento-tile {
          position: relative;
          overflow: hidden;
          border-radius: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          padding: 1.5rem;
          transition: border-color 0.3s, transform 0.3s;
        }
        .bento-tile:hover { border-color: rgba(34, 211, 238, 0.4); transform: translateY(-3px); }
        .bento-icon {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #22d3ee, #3b82f6);
          box-shadow: 0 8px 20px -6px rgba(34, 211, 238, 0.5);
        }

        /* Dark sections are rounded panels floating on the light page */
        .panel-dark {
          background: linear-gradient(160deg, #0f1c48 0%, #12235c 55%, #0f2f6e 100%);
          box-shadow: 0 30px 60px -30px rgba(15, 35, 92, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .panel-bright {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 45%, #0e7490 100%);
        }
        /* Coloured glows live only inside the solid part of a dark band */
        .band-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .marquee-fade {
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob, .animate-float, .animate-float-reverse, .animate-gradient,
          .marquee, .word-swap, .fade-in, .fade-in-up, .bar-grow, .shake {
            animation: none !important;
          }
          .hero-tilt { transform: none !important; }
          .hang-swing, .hang-shine, .hang-ticker, .hang-arrow, .hang-swing:hover .hang-sign, .hang-swing:hover .hang-shine { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Index;
