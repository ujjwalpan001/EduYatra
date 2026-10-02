// frontend/src/pages/intro/LegalPage.tsx - Layout for Privacy Policy and Terms
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import PageShell from './PageShell';
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from './site';

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  badge: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}

const LegalPage: React.FC<LegalPageProps> = ({ badge, title, intro, sections }) => (
  <PageShell badge={badge} title={title} subtitle={`Last updated: ${LEGAL_LAST_UPDATED}`}>
    <div className="grid lg:grid-cols-[240px_1fr] gap-10 max-w-6xl mx-auto">
      {/* Table of contents */}
      <nav className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">On this page</div>
          <ol className="space-y-2 text-sm">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="flex gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                  <span className="text-gray-400 tabular-nums">{index + 1}.</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 space-y-10">
        <div className="text-gray-700 leading-relaxed">{intro}</div>
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              <span className="text-blue-600 mr-2">{index + 1}.</span>
              {section.title}
            </h2>
            <div className="legal-body text-gray-700 leading-relaxed space-y-3">{section.body}</div>
          </section>
        ))}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-gray-700">Questions about this page? We're happy to help.</p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 text-blue-700 hover:underline">
              <Mail className="w-4 h-4" /> Email us
            </a>
            <Link to="/contact-us" className="text-blue-700 hover:underline">Contact page</Link>
          </div>
        </div>
      </article>
    </div>

    <style>{`
      .legal-body ul { list-style: disc; padding-left: 1.25rem; }
      .legal-body ul > li + li { margin-top: 0.375rem; }
      .legal-body a { color: #1d4ed8; font-weight: 600; }
      .legal-body a:hover { text-decoration: underline; }
    `}</style>
  </PageShell>
);

export default LegalPage;
