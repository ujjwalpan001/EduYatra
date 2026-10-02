// frontend/src/pages/intro/Contact.tsx - Contact Us
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, ClipboardCheck, ExternalLink, Send, Copy, Check, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import PageShell from './PageShell';
import { MCQ_URL, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from './site';

// Messages are delivered by FormSubmit (formsubmit.co) straight to the contact inbox
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const TOPICS = ['General question', 'Request an invite code', 'Institute / partnership', 'Technical support', 'Offline MCQ'];

const Contact: React.FC = () => {
  const emptyForm = { name: '', email: '', topic: TOPICS[0], message: '', honey: '' };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copied, setCopied] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honey) return; // spam bot filled the hidden field
    setStatus('sending');
    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic: form.topic,
          message: form.message,
          _subject: `[Deskoros] ${form.topic} - ${form.name}`,
          _replyto: form.email,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || String(data.success) !== 'true') {
        throw new Error(data.message || 'Could not send your message.');
      }
      setStatus('sent');
      setForm(emptyForm);
    } catch (error) {
      setStatus('idle');
      toast.error(error instanceof Error ? error.message : 'Could not send your message.', {
        description: `Please try again, or email us at ${CONTACT_EMAIL}.`,
      });
    }
  };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); the links still work
    }
  };

  const channels = [
    { key: 'email', icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, copyValue: CONTACT_EMAIL },
    { key: 'phone', icon: Phone, label: 'Phone', value: CONTACT_PHONE_DISPLAY, href: `tel:${CONTACT_PHONE}`, copyValue: CONTACT_PHONE },
  ];

  return (
    <PageShell
      badge="Contact Us"
      title="We'd love to hear from you"
      subtitle="Questions, invite code requests, partnerships or support. Reach out and we'll get back to you."
    >
      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {/* Contact details */}
        <div className="lg:col-span-2 space-y-4">
          {channels.map((channel) => (
            <div key={channel.key} className="group rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <channel.icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{channel.label}</div>
                <a href={channel.href} className="block font-semibold text-gray-900 hover:text-blue-700 break-all">
                  {channel.value}
                </a>
              </div>
              <button
                type="button"
                onClick={() => copy(channel.copyValue, channel.key)}
                aria-label={`Copy ${channel.label.toLowerCase()}`}
                className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:border-blue-200 transition-colors"
              >
                {copied === channel.key ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-1">
              <KeyRound className="w-4 h-4 text-blue-600" /> Need an invite code?
            </div>
            <p className="text-sm text-gray-600">
              Sign-up is currently invite-only. Choose "Request an invite code" in the form and tell us about yourself or your institute.
            </p>
          </div>

          <a
            href={MCQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl p-5 flex items-center gap-4 text-white bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Deskoros Offline MCQ</div>
              <div className="text-sm text-blue-100">mcq.deskoros.tech</div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-100 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Message form */}
        {status === 'sent' ? (
          <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Message sent!</h2>
            <p className="text-gray-600 mt-2 max-w-sm">Thanks for reaching out. We'll reply to the email address you gave us as soon as we can.</p>
            <Button onClick={() => setStatus('idle')} variant="outline" className="mt-6 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50">
              Send another message
            </Button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
            <p className="text-sm text-gray-500 mt-1">We usually reply by email.</p>
          </div>
          {/* Honeypot: hidden from people, bots tend to fill it in */}
          <input
            type="text"
            name="honey"
            value={form.honey}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <select
              id="topic"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={6} required />
          </div>
          <Button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl h-11 px-7"
          >
            {status === 'sending'
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
              : <><Send className="w-4 h-4 mr-2" /> Send message</>}
          </Button>
        </form>
        )}
      </div>
    </PageShell>
  );
};

export default Contact;
