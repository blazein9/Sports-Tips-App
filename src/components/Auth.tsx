import { useState, type FormEvent } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const ADMIN_EMAIL = 'admin@sportstips.local';
const ADMIN_PASSWORD = 'admin123';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

type AuthPanelProps = {
  onLocalAdminSignIn: () => void;
};

const AuthPanel = ({ onLocalAdminSignIn }: AuthPanelProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'signin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          onLocalAdminSignIn();
          return;
        }

        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (authError) {
      setError((authError as Error).message);
    }
  };

  const socialLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    setError('');

    try {
      await signInWithPopup(auth, provider);
    } catch (authError) {
      setError((authError as Error).message);
    }
  };

  return (
    <section className="auth-panel">
      <h2>{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
      <form onSubmit={submit} className="auth-form">
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button type="submit">{mode === 'signin' ? 'Sign in' : 'Sign up'}</button>
      </form>

      <div className="social-buttons">
        <button type="button" onClick={() => socialLogin(googleProvider)}>
          Continue with Google
        </button>
        <button type="button" onClick={() => socialLogin(facebookProvider)}>
          Continue with Facebook
        </button>
      </div>

      <div className="admin-signin">
        <button type="button" onClick={onLocalAdminSignIn}>
          Sign in as local admin
        </button>
        <p>Admin demo credentials: <strong>{ADMIN_EMAIL}</strong> / <strong>{ADMIN_PASSWORD}</strong></p>
      </div>

      <div className="toggle-mode">
        {mode === 'signin' ? (
          <>
            <span>New to the app?</span>
            <button type="button" onClick={() => setMode('signup')}>
              Create account
            </button>
          </>
        ) : (
          <>
            <span>Already a member?</span>
            <button type="button" onClick={() => setMode('signin')}>
              Sign in
            </button>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default AuthPanel;
