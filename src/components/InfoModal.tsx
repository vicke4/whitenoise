import { Download, Monitor, Smartphone, X } from 'lucide-react';

interface InfoModalProps {
  showInfo: boolean;
  onClose: () => void;
}

const InfoModal = ({ showInfo, onClose }: InfoModalProps) => {
  return (
    <div
      className={`absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-lg flex justify-center overflow-y-auto no-drag transition-all duration-300 ${showInfo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="max-w-2xl w-full p-8 md:p-12 mt-12 mb-20 text-slate-300">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <h1 className="text-3xl font-light text-white mb-6 tracking-wide">
          White Noise Now: Online Brown & White Noise Generator
        </h1>

        <article className="prose prose-invert prose-slate max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to <strong>White Noise Now</strong>, a free online tool
            designed to help you focus, sleep, and relax using the power of
            generative audio. Unlike static MP3 files, this app generates
            continuous, loop-free <strong>Brown Noise</strong> and{' '}
            <strong>White Noise</strong> directly in your browser.
          </p>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            Brown Noise vs. White Noise
          </h2>
          <p className="mb-4">This app offers two distinct sound profiles:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2 text-slate-400">
            <li>
              <strong>Brown Noise (Red Noise):</strong> Deep, low-frequency
              rumble similar to heavy rainfall or distant thunder. Excellent for
              deep focus and sleep.
            </li>
            <li>
              <strong>White Noise:</strong> Constant intensity across all
              frequencies, sounding like static or a fan. Great for masking
              tinnitus or blocking out conversations.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            Benefits of Noise Generators
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">
                For Sleep & Insomnia
              </h3>
              <p className="text-sm text-slate-400">
                Steady background noise masks sudden sounds (like barking dogs
                or traffic) that can wake you up, creating a "sound blanket" for
                deeper sleep.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">For ADHD & Focus</h3>
              <p className="text-sm text-slate-400">
                Many users with ADHD find that Brown Noise helps "occupy" the
                distracted part of the brain, allowing for better concentration
                on work or study.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            How to Use This App
          </h2>
          <p className="mb-4">
            We designed this interface to be distraction-free. Simply{' '}
            <strong>drag vertically</strong> to adjust volume to your comfort
            level. Need to time your study session or nap?{' '}
            <strong>Drag horizontally</strong> to set a fade-out timer.
          </p>

          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="font-bold text-white mb-3">Keyboard Shortcuts</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <kbd className="px-2 py-1 bg-slate-800 rounded text-xs mr-2">
                  Space
                </kbd>
                Play / Pause
              </li>
              <li>
                <kbd className="px-2 py-1 bg-slate-800 rounded text-xs mr-2">
                  ↑ ↓
                </kbd>
                Increase / Decrease volume (1% per press)
              </li>
              <li>
                <kbd className="px-2 py-1 bg-slate-800 rounded text-xs mr-2">
                  ← →
                </kbd>
                Decrease / Increase timer (1 min per press)
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4 flex items-center gap-2">
            <Download size={24} />
            Install as an App (Recommended)
          </h2>
          <p className="mb-4">
            You can install White Noise Now on your phone or computer just like
            a regular app—no app store needed! This is called a{' '}
            <strong>Progressive Web App (PWA)</strong>, which means it works
            like a native app but runs in your browser.
          </p>

          <div className="bg-teal-900/20 p-6 rounded-lg border border-teal-800/50 mb-6">
            <h3 className="font-bold text-teal-300 mb-3">Why Install It?</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">✓</span>
                <span>
                  <strong>Works completely offline</strong> — Use it anywhere,
                  even without internet (after first load)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">✓</span>
                <span>
                  <strong>Launches like a real app</strong> — Opens in its own
                  window without browser clutter
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">✓</span>
                <span>
                  <strong>Lives on your home screen</strong> — Quick access with
                  one tap, just like any other app
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">✓</span>
                <span>
                  <strong>Saves battery & data</strong> — Runs efficiently
                  without constant server connections
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">✓</span>
                <span>
                  <strong>No app store required</strong> — Install directly, no
                  account or download needed
                </span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Smartphone size={20} className="text-teal-400" />
                On Mobile (iPhone/Android)
              </h3>
              <div className="space-y-4 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-slate-300 mb-1">
                    iPhone/iPad (Safari):
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      Tap the <strong>Share</strong> button (square with arrow
                      pointing up)
                    </li>
                    <li>
                      Scroll down and tap <strong>"Add to Home Screen"</strong>
                    </li>
                    <li>
                      Tap <strong>"Add"</strong> in the top right
                    </li>
                    <li>Find the app icon on your home screen!</li>
                  </ol>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-1">
                    Android (Chrome):
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      Tap the <strong>three dots</strong> menu (⋮) in the top
                      right
                    </li>
                    <li>
                      Tap <strong>"Add to Home screen"</strong> or{' '}
                      <strong>"Install app"</strong>
                    </li>
                    <li>
                      Confirm by tapping <strong>"Add"</strong> or{' '}
                      <strong>"Install"</strong>
                    </li>
                    <li>The app appears on your home screen!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Monitor size={20} className="text-teal-400" />
                On Desktop/Laptop
              </h3>
              <div className="space-y-4 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-slate-300 mb-1">
                    Chrome/Edge/Brave:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      Look for the <strong>install icon</strong> (⊕ or computer
                      icon) in the address bar
                    </li>
                    <li>
                      Click it and select <strong>"Install"</strong>
                    </li>
                    <li>The app opens in its own window!</li>
                    <li>Access it from your Start Menu or Dock</li>
                  </ol>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-1">
                    Safari (Mac):
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      Click <strong>File</strong> in the menu bar
                    </li>
                    <li>
                      Select <strong>"Add to Dock"</strong>
                    </li>
                    <li>The app is now pinned to your Dock!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic mb-6">
            💡 Tip: Once installed, you can use White Noise Now on flights, in
            areas with poor internet, or anywhere offline. Your settings
            (volume, timer, noise type) are automatically saved!
          </p>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            Why Choose White Noise Now?
          </h2>
          <ul className="list-disc pl-5 mb-6 space-y-2 text-slate-400">
            <li>
              <strong>100% Free & No Ads:</strong> No subscriptions, no
              interruptions.
            </li>
            <li>
              <strong>Loop-Free Audio:</strong> Algorithmically generated sounds
              mean no repetitive loops that your brain can detect
            </li>
            <li>
              <strong>Works Offline:</strong> Once loaded, the generator runs
              entirely in your browser—no internet required
            </li>
            {/* <li>
              <strong>Privacy First:</strong> All audio is generated locally. No
              data is sent to any server
            </li> */}
            <li>
              <strong>Customizable Timer:</strong> Set automatic fade-out from
              1-120 minutes for sleep sessions or focused work blocks
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            Popular Use Cases
          </h2>
          <p className="mb-4">This online noise generator is perfect for:</p>
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Sleep aid</strong> for insomnia or light sleepers
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Study music alternative</strong> for deep focus work
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Tinnitus relief</strong> and ear ringing masking
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Baby sleep sounds</strong> to calm crying infants
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Meditation and relaxation</strong> practices
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-slate-400">
                <strong>Blocking office noise</strong> in open workspaces
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-teal-400 mt-8 mb-4">
            About the Technology
          </h2>
          <p className="mb-4 text-slate-400">
            White Noise Now uses the Web Audio API to generate authentic noise
            patterns in real-time. Unlike pre-recorded sound files that loop
            every few seconds, our algorithm creates truly continuous audio that
            never repeats. This browser-based noise generator requires no
            downloads or installations—just open the page and start playing.
          </p>
        </article>

        <div className="mt-12 pt-8 pb-12 border-t border-slate-800 text-center text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()} White Noise Now. Runs locally in your
            browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
