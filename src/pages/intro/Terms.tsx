// frontend/src/pages/intro/Terms.tsx - Terms of Service
import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { LegalSection } from './LegalPage';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from './site';

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Accepting these terms',
    body: (
      <p>
        By creating an account or using Deskoros, including Deskoros Offline MCQ at mcq.deskoros.tech, you agree to these
        Terms of Service and to our <Link to="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the
        service.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts',
    body: (
      <ul>
        <li>Sign-up is currently by invite code only. Invite codes are personal and must not be shared publicly.</li>
        <li>You must give accurate information and choose the correct role (student, teacher or admin).</li>
        <li>You are responsible for keeping your password safe and for everything done through your account.</li>
        <li>Tell us right away if you think someone else has used your account.</li>
      </ul>
    ),
  },
  {
    id: 'exam-conduct',
    title: 'Fair exam conduct',
    body: (
      <>
        <p>When taking a test on Deskoros, you agree to:</p>
        <ul>
          <li>Attempt tests yourself, without help from other people or tools that your teacher has not allowed.</li>
          <li>Stay in fullscreen mode and on the test page. Leaving fullscreen and switching tabs are recorded and shared with your teacher.</li>
          <li>Not share questions, answers or test content outside the platform unless your institute allows it.</li>
        </ul>
        <p>Your institute decides how to handle any breach of exam rules.</p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <ul>
        <li>Do not try to access accounts, tests or data that you are not allowed to see.</li>
        <li>Do not disrupt, overload, reverse-engineer or attack the service.</li>
        <li>Do not upload content that is unlawful, harmful, or that you do not have the right to use.</li>
      </ul>
    ),
  },
  {
    id: 'content',
    title: 'Your content',
    body: (
      <p>
        Teachers and institutes keep ownership of the questions and tests they create. You give Deskoros permission to
        store, display and process that content only to provide the service to you and your institute.
      </p>
    ),
  },
  {
    id: 'our-service',
    title: 'Our service',
    body: (
      <p>
        We work to keep Deskoros reliable, but the service is provided "as is" and may sometimes be unavailable or change.
        We may add, change or remove features. Results and analytics are tools to support teaching; final academic
        decisions remain with your institute.
      </p>
    ),
  },
  {
    id: 'sponsored',
    title: 'Sponsored content and links',
    body: (
      <p>
        Deskoros may show sponsored content and links to other websites. We are not responsible for the content or
        practices of those websites.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Suspension and termination',
    body: (
      <p>
        We may suspend or close accounts that break these terms or put other users or the service at risk. You can stop
        using Deskoros at any time and ask us to delete your account.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <p>
        To the extent allowed by law, Deskoros is not liable for indirect or consequential losses, including lost data or
        lost opportunities, arising from your use of the service.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. When we do, we will change the "Last updated" date at the top of
        this page. Continuing to use Deskoros after an update means you accept the new terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <p>
        Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call{' '}
        <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>.
      </p>
    ),
  },
];

const Terms: React.FC = () => (
  <LegalPage
    badge="Legal"
    title="Terms of Service"
    intro={
      <p>
        These Terms of Service set out the rules for using Deskoros. They apply to students, teachers, institute
        administrators and anyone else who visits or uses the platform.
      </p>
    }
    sections={SECTIONS}
  />
);

export default Terms;
