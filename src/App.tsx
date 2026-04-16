import { useEffect, useMemo, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import AuthPanel from './components/Auth';
import TipGenerator from './components/TipGenerator';
import { Tip, tips as sampleTips, fetchTipsFromGoogleSheet } from './data/tips';

const categories = ['Football', 'Basketball', 'Tennis'] as const;

type Category = typeof categories[number];

type RangeOption = 'any' | 'low' | 'medium' | 'high';

type LocalUser = {
  email: string;
  displayName: string;
  isLocalAdmin: true;
};

type AppUser = User | LocalUser;

const App = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Football');
  const [range, setRange] = useState<RangeOption>('any');
  const [generatedTip, setGeneratedTip] = useState<Tip | null>(null);
  const [tipsData, setTipsData] = useState<Tip[]>(sampleTips);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY as string | undefined;

    fetchTipsFromGoogleSheet(apiKey)
      .then((loadedTips) => {
        if (loadedTips.length > 0) {
          setTipsData(loadedTips);
        }
      })
      .catch((error) => {
        console.warn('Could not load Google Sheet tips:', error);
      });
  }, []);

  useEffect(() => {
    const localAdminSignedIn = localStorage.getItem('localAdminSignedIn') === 'true';
    if (localAdminSignedIn) {
      setUser({ email: 'admin@sportstips.local', displayName: 'Admin', isLocalAdmin: true });
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const stillLocalAdmin = localStorage.getItem('localAdminSignedIn') === 'true';
      if (currentUser) {
        localStorage.removeItem('localAdminSignedIn');
        setUser(currentUser);
      } else if (!stillLocalAdmin) {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const filteredTips = useMemo(() => {
    return tipsData.filter((tip) => {
      if (tip.category !== selectedCategory) return false;
      if (range === 'low') return tip.value <= 2;
      if (range === 'medium') return tip.value >= 3 && tip.value <= 4;
      if (range === 'high') return tip.value >= 5;
      return true;
    });
  }, [selectedCategory, range]);

  const handleGenerate = () => {
    if (filteredTips.length === 0) {
      setGeneratedTip(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredTips.length);
    setGeneratedTip(filteredTips[randomIndex]);
  };

  const handleLogout = async () => {
    if (localStorage.getItem('localAdminSignedIn') === 'true') {
      localStorage.removeItem('localAdminSignedIn');
      setUser(null);
    } else {
      await signOut(auth);
      setUser(null);
    }

    setGeneratedTip(null);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Sports Tips Generator</h1>
        <p>Sign in, pick a sport and a value range, then get a random tip.</p>
      </header>

      {!user ? (
        <AuthPanel
          onLocalAdminSignIn={() => {
            localStorage.setItem('localAdminSignedIn', 'true');
            setUser({ email: 'admin@sportstips.local', displayName: 'Admin', isLocalAdmin: true });
          }}
        />
      ) : (
        <main>
          <section className="profile-bar">
            <div>
              <strong>Signed in as</strong>
              <p>{user.email || user.displayName || 'Anonymous'}</p>
            </div>
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </section>

          <section className="controls">
            <label>
              Sport category
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value as Category)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Value range
              <select value={range} onChange={(event) => setRange(event.target.value as RangeOption)}>
                <option value="any">Any</option>
                <option value="low">Low (1-2)</option>
                <option value="medium">Medium (3-4)</option>
                <option value="high">High (5)</option>
              </select>
            </label>

            <button onClick={handleGenerate}>Generate random tip</button>
          </section>

          <TipGenerator tip={generatedTip} count={filteredTips.length} />

          <section className="notes">
            <h2>Next steps</h2>
            <ul>
              <li>Add more sports categories in <code>src/data/tips.ts</code>.</li>
              <li>Replace local tip data with Google Sheets or a database later.</li>
              <li>Customize the value range to your own scoring system.</li>
            </ul>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;
