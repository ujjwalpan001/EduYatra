// frontend/src/pages/intro/Privacy.tsx - Privacy Policy
import React from 'react';
import LegalPage, { LegalSection } from './LegalPage';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from './site';

const SECTIONS: LegalSection[] = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    body: (
      <>
        <p>We collect only what we need to run the platform:</p>
        <ul>
          <li><strong>Account details</strong>: your name, email address, password, role (student, teacher or admin), institute, and grade or subject.</li>
          <li><strong>Exam data</strong>: the tests you create or attempt, your answers, submissions, scores and results.</li>
          <li><strong>Exam integrity data</strong>: during online tests we record events such as leaving fullscreen mode and switching tabs, so teachers can review how a test was taken.</li>
          <li><strong>Technical data</strong>: basic information your browser sends, such as device type, browser and server logs, used to keep the service secure and working.</li>
          <li><strong>Messages</strong>: anything you send us by email, phone or the contact form.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use your information',
    body: (
      <ul>
        <li>To create and manage your account and sign you in.</li>
        <li>To let teachers and institutes create, conduct, monitor and grade tests.</li>
        <li>To show students and teachers results, reports and analytics.</li>
        <li>To keep exams fair and the platform secure, and to investigate misuse.</li>
        <li>To respond to your questions and support requests.</li>
        <li>To improve Deskoros. We do not sell your personal information.</li>
      </ul>
    ),
  },
  {
    id: 'sharing',
    title: 'Who can see your information',
    body: (
      <ul>
        <li><strong>Your institute</strong>: teachers and administrators of your institute can see your profile, test attempts, results and exam integrity data.</li>
        <li><strong>Service providers</strong>: companies that host or operate parts of the service for us, only as needed to provide it.</li>
        <li><strong>Legal reasons</strong>: when required by law, or to protect the rights and safety of users and Deskoros.</li>
      </ul>
    ),
  },
  {
    id: 'storage',
    title: 'Cookies and local storage',
    body: (
      <p>
        Deskoros stores a sign-in token and basic profile and preference settings (such as your theme) in your browser's
        local storage so you stay signed in. Clearing your browser data signs you out. The landing page may show sponsored
        links from partners; we count clicks on these links, but we do not use third-party advertising trackers.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    body: (
      <p>
        We keep account and exam data for as long as your account is active or your institute needs it for its academic
        records. You or your institute can ask us to delete your data, and we will do so unless we must keep it for
        legal reasons.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We use access controls based on user roles and take reasonable steps to protect your information. No
        system is completely secure, so please keep your password private and tell us right away if you think your
        account has been misused.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your choices and rights',
    body: (
      <p>
        You can ask to see, correct or delete your personal information, or ask questions about how it is used, by
        contacting us. Some requests may need to go through your institute, since it manages its own exam records.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Students under 18',
    body: (
      <p>
        Many of our students are under 18 and use Deskoros through their school or institute. In those cases the
        institute is responsible for getting any consent required from parents or guardians.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy from time to time. When we do, we will change the "Last updated" date at the top of
        this page.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <p>
        For privacy questions or requests, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call{' '}
        <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>.
      </p>
    ),
  },
];

const Privacy: React.FC = () => (
  <LegalPage
    badge="Legal"
    title="Privacy Policy"
    intro={
      <p>
        This Privacy Policy explains what information Deskoros collects when you use our website and platform, how we
        use it, and the choices you have. By using Deskoros, you agree to this policy.
      </p>
    }
    sections={SECTIONS}
  />
);

export default Privacy;
