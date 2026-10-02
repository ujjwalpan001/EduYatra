// frontend/src/pages/intro/About.tsx - About Us
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, BookOpen, Building2, Target, Eye, Heart, ShieldCheck, Lightbulb,
  ClipboardCheck, MonitorPlay, BarChart3, FileQuestion, ArrowRight, ExternalLink, Mail,
} from 'lucide-react';
import PageShell from './PageShell';
import { MCQ_URL } from './site';

const OFFERINGS = [
  { icon: FileQuestion, title: 'Question banks', text: 'Create and organise questions, with LaTeX support for maths and science.' },
  { icon: MonitorPlay, title: 'Online tests', text: 'Run timed tests with live monitoring, fullscreen mode and tab-switch tracking.' },
  { icon: ClipboardCheck, title: 'Offline MCQ', text: 'Printed question papers with a built-in OMR answer strip for classrooms.' },
  { icon: BarChart3, title: 'Analytics', text: 'Test-wise and student-wise reports that show where each learner stands.' },
];

const AUDIENCES = [
  { icon: GraduationCap, title: 'Students', text: 'Practise by topic, attempt tests and track their own progress over time.' },
  { icon: BookOpen, title: 'Teachers', text: 'Build tests, conduct them online or offline, and give individual retests.' },
  { icon: Building2, title: 'Institutes', text: 'Manage classes, teachers, students and exams from one admin dashboard.' },
];

const VALUES = [
  { icon: Lightbulb, title: 'Simplicity', text: 'Tools that teachers can use on day one, without training manuals.' },
  { icon: ShieldCheck, title: 'Fairness', text: 'Exams that are monitored properly, so every result can be trusted.' },
  { icon: Heart, title: 'Care for learners', text: 'Feedback that helps students improve, not just a number on a page.' },
];

const About: React.FC = () => (
  <PageShell
    badge="About Us"
    title={<>Making exams simpler, <span className="bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent">fairer and smarter</span></>}
    subtitle="Deskoros is an education platform that helps institutes, teachers and students create, conduct and learn from examinations, online and offline."
  >
    {/* Mission & vision */}
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {[
        { icon: Target, title: 'Our mission', text: 'To take the paperwork out of examinations, so teachers spend less time checking answer sheets and more time teaching, and students get clear feedback they can act on.' },
        { icon: Eye, title: 'Our vision', text: 'Every classroom, whether it runs tests on screens or on paper, should have access to reliable exams and meaningful insights about learning.' },
      ].map((item) => (
        <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-7 hover:shadow-lg hover:border-blue-200 transition-all">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <item.icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
          <p className="text-gray-600 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>

    {/* What we offer */}
    <section className="mt-20 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">What Deskoros offers</h2>
        <p className="text-gray-600 mt-2">One platform for the whole examination cycle.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OFFERINGS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Who it's for */}
    <section className="mt-20 rounded-[2rem] panel-about relative overflow-hidden px-6 py-14 sm:px-12 max-w-6xl mx-auto">
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Built for everyone in education</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5 relative z-10">
        {AUDIENCES.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-cyan-400/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-blue-200/80">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Values */}
    <section className="mt-20 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">What we care about</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {VALUES.map((item) => (
          <div key={item.title} className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white border-2 border-blue-100 flex items-center justify-center shadow-sm mb-4">
              <item.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="mt-20 max-w-4xl mx-auto text-center rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Want to bring Deskoros to your institute?</h2>
      <p className="text-gray-600 mb-6">Talk to us. We'll help you get set up.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/contact-us">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-6">
            <Mail className="w-4 h-4 mr-2" /> Contact us
          </Button>
        </Link>
        <a href={MCQ_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-xl h-11 px-6 border-blue-200 text-blue-700 hover:bg-blue-50">
            Offline MCQ <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
        <Link to="/signin">
          <Button variant="ghost" className="rounded-xl h-11 px-6 text-blue-700 hover:bg-blue-50">
            Login <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>

    <style>{`
      .panel-about {
        background:
          radial-gradient(60% 60% at 85% 20%, rgba(34, 211, 238, 0.18), transparent 70%),
          radial-gradient(50% 60% at 10% 90%, rgba(37, 99, 235, 0.35), transparent 70%),
          linear-gradient(160deg, #0f1c48 0%, #12235c 55%, #0f2f6e 100%);
        box-shadow: 0 30px 60px -30px rgba(15, 35, 92, 0.45);
      }
    `}</style>
  </PageShell>
);

export default About;
