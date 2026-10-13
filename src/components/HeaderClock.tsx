import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe } from 'lucide-react';

export const HeaderClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  let displayHours = hours;
  let ampm = '';

  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    displayHours = hours % 12 || 12;
  }

  const hoursStr = String(displayHours).padStart(2, '0');

  // Greeting
  let greeting = 'Good Morning';
  if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
  else if (hours >= 17) greeting = 'Good Evening';

  // Date formatting
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
  const dateFormatted = now.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Timezone
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Week number
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const quarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl border border-slate-700/60">
      {/* Subtle decorative glow spots */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: App Branding & Greeting */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Automated MOM Suite
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {greeting}, Executive
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            MinuteCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">AI</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-md">
            Convert meeting MP3 recordings into structured Minutes of Meeting & download certified Word (.docx) documents.
          </p>
        </div>

        {/* Right: Live Digital Clock & Calendar Widget */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-800/80 backdrop-blur-md px-5 py-4 rounded-xl border border-slate-700 shadow-inner">
          {/* Clock Display */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Clock className="w-6 h-6 animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                  {hoursStr}:{minutes}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-indigo-400">
                  :{seconds}
                </span>
                {!is24Hour && (
                  <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 ml-1">
                    {ampm}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setIs24Hour(!is24Hour)}
                  className="hover:text-indigo-300 underline underline-offset-2 transition-colors cursor-pointer"
                  title="Toggle 12h / 24h format"
                >
                  {is24Hour ? 'Switch to 12h' : 'Switch to 24h'}
                </button>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {timeZoneName}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-slate-700" />

          {/* Date & Week Widget */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {weekday}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {dateFormatted}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                  {quarter}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Week {weekNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
