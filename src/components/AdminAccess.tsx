import React, { useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminPanel } from './AdminPanel';
import { Locale, Inquiry, InquiryStatus, MembershipPlan } from '../types';

const ADMIN_EMAIL = '';

interface AdminAccessProps {
  locale: Locale;
  inquiries: Inquiry[];
  onUpdateInquiryStatus: (id: string, status: InquiryStatus, note?: string) => void;
  plans: MembershipPlan[];
  onTogglePlanPublish: (planId: string) => void;
  onClose: () => void;
}

export const AdminAccess: React.FC<AdminAccessProps> = (props) => {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive) return;
      if (sessionError) setError('Session verify nahi ho saka. Dobara koshish karein.');
      const user = data.session?.user ?? null;
      setSessionUser(user?.email?.toLowerCase() === ADMIN_EMAIL ? user : null);
      if (user && user.email?.toLowerCase() !== ADMIN_EMAIL) {
        void supabase?.auth.signOut();
        setError('Is account ko Admin Portal ki ijazat nahi hai.');
      }
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user?.email?.toLowerCase() === ADMIN_EMAIL) {
        setSessionUser(user);
        setError('');
      } else {
        setSessionUser(null);
        if (user) {
          setError('Is account ko Admin Portal ki ijazat nahi hai.');
          void supabase?.auth.signOut();
        }
      }
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (!ADMIN_EMAIL) {
      setError('Admin account abhi configure nahi hua. Owner ka authorized email set karna zaroori hai.');
      return;
    }
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('Sirf authorized admin email se login ho sakta hai.');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    setBusy(false);
    if (loginError) {
      setError('Login nahi hua. Password check karein aur dobara koshish karein.');
      return;
    }
    if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError('Account authorized nahi hai.');
      return;
    }
    setSessionUser(data.user);
    setPassword('');
  };

  const handleResetPassword = async () => {
    if (!supabase || !ADMIN_EMAIL) {
      setError('Naya admin email configure hone ke baad password reset available hoga.');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL);
    setBusy(false);
    if (resetError) setError('Password reset email nahi bheji ja saki. Supabase email settings check karein.');
    else setNotice('Agar is email ka account maujood hai to password reset link email par bhej diya gaya hai.');
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setSessionUser(null);
    setPassword('');
  };

  if (checking) {
    return <div className="fixed inset-0 z-[70] bg-[#0F1115] flex items-center justify-center text-[#B6F500]"><Loader2 className="animate-spin w-7 h-7" /></div>;
  }

  if (sessionUser?.email?.toLowerCase() === ADMIN_EMAIL) {
    return (
      <>
        <div className="fixed top-3 end-3 z-[80] flex items-center gap-2 rounded-lg border border-[#B6F500]/40 bg-[#181B21] px-3 py-2 text-xs text-white shadow-xl">
          <ShieldCheck className="w-4 h-4 text-[#B6F500]" />
          <span>Authorized admin</span>
          <button type="button" onClick={handleLogout} className="ms-2 flex items-center gap-1 text-rose-300 hover:text-white"><LogOut className="w-3.5 h-3.5" /> Logout</button>
        </div>
        <AdminPanel {...props} />
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#343B46] bg-[#181B21] p-7 shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#B6F500]/40 bg-[#B6F500]/10 text-[#B6F500]"><LockKeyhole className="h-7 w-7" /></div>
        <h2 className="text-center text-2xl font-bold text-white">Admin Secure Login</h2>
        <p className="mt-2 text-center text-sm text-[#A3A9B5]">Yeh portal sirf authorized owner ke liye hai.</p>
        {!isSupabaseConfigured ? (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">Supabase connection configured nahi hai. Login enable karne ke liye project ki VITE_SUPABASE_URL aur VITE_SUPABASE_ANON_KEY settings zaroori hain.</div>
        ) : (
          {!ADMIN_EMAIL && <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">Purana admin access band kar diya gaya hai. Naya owner email configure hone tak Admin login temporarily disabled hai.</div>}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-xs font-semibold text-[#A3A9B5]">Authorized email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required className="mt-2 w-full rounded-lg border border-[#343B46] bg-[#0F1115] px-3 py-3 text-sm text-white outline-none focus:border-[#B6F500]" />
            </label>
            <label className="block text-xs font-semibold text-[#A3A9B5]">Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required minLength={8} className="mt-2 w-full rounded-lg border border-[#343B46] bg-[#0F1115] px-3 py-3 text-sm text-white outline-none focus:border-[#B6F500]" placeholder="Apna password enter karein" />
            </label>
            {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
            {notice && <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">{notice}</div>}
            <button disabled={busy || !ADMIN_EMAIL} type="submit" className="w-full rounded-lg bg-[#B6F500] px-4 py-3 font-bold text-[#0F1115] transition hover:bg-[#caff24] disabled:opacity-60">{busy ? 'Please wait…' : 'Secure Login'}</button>
            <button disabled={busy || !ADMIN_EMAIL} type="button" onClick={handleResetPassword} className="w-full py-2 text-xs text-[#B6F500] hover:text-white disabled:opacity-60">Forgot password? Email reset link</button>
          </form>
        )}
        <button type="button" onClick={props.onClose} className="mt-4 w-full rounded-lg border border-[#343B46] px-4 py-2.5 text-sm text-[#A3A9B5] hover:text-white">Close</button>
        <p className="mt-5 text-center text-[11px] text-[#737B88]">Public sign-up is disabled. Access is restricted to the owner email.</p>
      </div>
    </div>
  );
};
