import { X } from 'lucide-react';

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
        </article>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()} White Noise Now. Runs locally in your
            browser for privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
