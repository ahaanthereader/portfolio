/* ---- Pick a sweet: Every page is a delightful storybook candy.
   Clicking one sends it to 3D Ahaan, he eats it, and the page opens.
   Calm mode and modified clicks follow the link immediately. ---- */
(function () {
  const GROUPS = [
    ["📚 Read", [
      ["reading.html", "Reading"],
      ["kindle.html", "Kindle"],
      ["library.html", "Library"],
      ["story.html", "Stories"],
      ["sketchbook.html", "Sketch"]
    ]],
    ["🧭 Explore", [
      ["geography.html", "Maps"],
      ["quiz.html", "Quiz"],
      ["doors.html", "Doors"],
      ["bells.html", "Bells"]
    ]],
    ["🎈 Play", [
      ["swing.html", "Swing"],
      ["games.html", "Games"],
      ["music.html", "Music"],
      ["movies.html", "Movies"]
    ]],
    ["⭐ My stuff", [
      ["calendar.html", "Calendar"],
      ["rewards.html", "Rewards"],
      ["journey.html", "Journey"]
    ]]
  ];

  const shelf = document.getElementById("candyShelf");
  if (!shelf) return;
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";

  /* Distinct, meaningful illustrated icons for each of the 16 pages (Singapore Sketchbook style). */
  const ICONS = {
    "reading.html": '<defs><radialGradient id="g-read" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#faece8"/><stop offset="100%" stop-color="#df9a8c"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-read)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M18 52 C26 49 34 50 40 53 C46 50 54 49 62 52 L62 30 C54 27 46 28 40 31 C34 28 26 27 18 30 Z" fill="#b35848" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 50 C27 47 34 48 39.5 51 L39.5 29 C34 26 27 25 20 28 Z" fill="#fffdf9" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><path d="M60 50 C53 47 46 48 40.5 51 L40.5 29 C46 26 53 25 60 28 Z" fill="#fbf7ef" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><line x1="24" y1="33" x2="35" y2="34.5" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><line x1="24" y1="38" x2="36" y2="39.5" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><line x1="24" y1="43" x2="33" y2="44.5" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><line x1="45" y1="34.5" x2="56" y2="33" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><line x1="44" y1="39.5" x2="56" y2="38" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><line x1="45" y1="44.5" x2="53" y2="43" stroke="#8a7364" stroke-width="1.3" stroke-linecap="round"/><path d="M40 30 C40 36 38 48 43 57 L45 52 L48 57 C45 49 41 38 40 30 Z" fill="#c93838" stroke="#33241b" stroke-width="0.8"/>',

    "kindle.html": '<defs><radialGradient id="g-kindle" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#e8f0f8"/><stop offset="100%" stop-color="#a4bcd2"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-kindle)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="23" y="16" width="34" height="48" rx="4" fill="#324354" stroke="#222f3b" stroke-width="1.5"/><rect x="27" y="21" width="26" height="35" rx="1.5" fill="#f5f0e6"/><line x1="30" y1="26" x2="50" y2="26" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="30" x2="48" y2="30" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="34" x2="51" y2="34" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="38" x2="47" y2="38" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="42" x2="49" y2="42" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="46" x2="42" y2="46" stroke="#4a3e35" stroke-width="1.5" stroke-linecap="round"/><circle cx="40" cy="59.5" r="1.5" fill="#a4bcd2"/>',

    "library.html": '<defs><radialGradient id="g-lib" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#ebf5eb"/><stop offset="100%" stop-color="#a8cda9"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-lib)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="15" y="55" width="50" height="4" rx="1.5" fill="#80563b" stroke="#33241b" stroke-width="1.2"/><rect x="20" y="24" width="8" height="31" rx="1.5" fill="#4d6f8f" stroke="#33241b" stroke-width="1.4"/><line x1="22" y1="28" x2="26" y2="28" stroke="#e0c38c" stroke-width="1.2"/><rect x="29" y="20" width="9" height="35" rx="1.5" fill="#c05c46" stroke="#33241b" stroke-width="1.4"/><line x1="31.5" y1="25" x2="35.5" y2="25" stroke="#f6deb5" stroke-width="1.2"/><rect x="39" y="26" width="7.5" height="29" rx="1.5" fill="#598762" stroke="#33241b" stroke-width="1.4"/><g transform="translate(48 27) rotate(14)"><rect x="0" y="0" width="8" height="28" rx="1.5" fill="#d9a84e" stroke="#33241b" stroke-width="1.4"/><line x1="2" y1="5" x2="6" y2="5" stroke="#fff" stroke-width="1.2"/></g>',

    "story.html": '<defs><radialGradient id="g-story" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#fdf4db"/><stop offset="100%" stop-color="#dec076"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-story)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M20 22 C24 20 44 20 48 22 C50 28 50 48 48 56 C44 58 24 58 20 56 Z" fill="#fffdf6" stroke="#33241b" stroke-width="1.4" stroke-linejoin="round"/><path d="M42 22 L48 28 L42 28 Z" fill="#e2d2ba" stroke="#33241b" stroke-width="1.2"/><path d="M24 30 Q30 29 36 30 M24 36 Q32 35 40 36 M24 42 Q30 41 38 42 M24 48 Q28 47 34 48" stroke="#856b57" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M60 17 C54 22 44 38 41 53 L38 58 L42 55 C46 45 57 26 62 18 C64 15 62 14 60 17 Z" fill="#5a7b97" stroke="#33241b" stroke-width="1.4" stroke-linejoin="round"/><path d="M41 53 L38 58 L42 55" fill="#d9a84e" stroke="#33241b" stroke-width="1.2"/><path d="M59 19 Q49 35 40 55" stroke="#f6f2e9" stroke-width="1" fill="none"/><circle cx="36" cy="59" r="1.5" fill="#33241b"/>',

    "sketchbook.html": '<defs><radialGradient id="g-sketch" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#f3e8f4"/><stop offset="100%" stop-color="#bda2c3"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-sketch)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M22 34 C20 46 28 58 42 58 C50 58 58 53 58 45 C58 39 53 38 52 34 C51 30 55 27 52 23 C48 19 36 18 28 23 C23 27 22 30 22 34 Z" fill="#e8c799" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="48" cy="44" rx="3.5" ry="4.5" fill="#bda2c3" stroke="#33241b" stroke-width="1.3"/><circle cx="28" cy="28" r="3.2" fill="#c05646"/><circle cx="36" cy="24" r="3.2" fill="#dfa745"/><circle cx="45" cy="26" r="3.2" fill="#52835c"/><circle cx="29" cy="38" r="3.2" fill="#4a7399"/><g transform="translate(24 48) rotate(-42)"><rect x="0" y="-2" width="34" height="4" rx="1.5" fill="#9e663d" stroke="#33241b" stroke-width="1.2"/><rect x="25" y="-2.5" width="5" height="5" fill="#d2d7df" stroke="#33241b" stroke-width="1"/><path d="M30 -2 C34 -2 36 -0.5 37 0 C36 0.5 34 2 30 2 Z" fill="#33241b"/></g>',

    "geography.html": '<defs><radialGradient id="g-maps" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#e2f0f8"/><stop offset="100%" stop-color="#9fc2db"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-maps)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M18 24 L32 20 L46 24 L60 20 L60 54 L46 58 L32 54 L18 58 Z" fill="#f8f4ea" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><line x1="32" y1="20" x2="32" y2="54" stroke="#d5c7b2" stroke-width="1.3" stroke-dasharray="2 2"/><line x1="46" y1="24" x2="46" y2="58" stroke="#d5c7b2" stroke-width="1.3" stroke-dasharray="2 2"/><path d="M22 46 Q28 36 34 42 T48 34 T56 38" stroke="#689fc7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="39" cy="38" r="12" fill="#fffcf6" stroke="#33241b" stroke-width="1.3"/><polygon points="39,27 41.5,37 39,39" fill="#c04e3e"/><polygon points="39,27 36.5,37 39,39" fill="#e07d70"/><polygon points="39,49 41.5,39 39,37" fill="#3d5a78"/><polygon points="39,49 36.5,39 39,37" fill="#718fae"/><polygon points="50,38 40,40.5 38,38" fill="#d9a84e"/><polygon points="28,38 38,35.5 40,38" fill="#d9a84e"/><circle cx="39" cy="38" r="2" fill="#33241b"/>',

    "quiz.html": '<defs><radialGradient id="g-quiz" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#fff6dd"/><stop offset="100%" stop-color="#f5cb68"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-quiz)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M30 36 C30 26 50 26 50 36 C50 41 46 44 45 49 L35 49 C34 44 30 41 30 36 Z" fill="#fffbe8" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><path d="M37 49 L37 40 L40 43 L43 40 L43 49" stroke="#e59832" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="35" y="49" width="10" height="3" rx="1" fill="#cbb27a" stroke="#33241b" stroke-width="1.2"/><rect x="36" y="52" width="8" height="3" rx="1" fill="#cbb27a" stroke="#33241b" stroke-width="1.2"/><path d="M37 55 C37 57 43 57 43 55 Z" fill="#5c4e3e" stroke="#33241b" stroke-width="1"/><path d="M40 18 L40 22 M23 28 L27 30 M57 28 L53 30 M21 40 L25 40 M59 40 L55 40" stroke="#d49422" stroke-width="1.6" stroke-linecap="round"/><path d="M48 20 Q50 22 52 20 Q50 22 48 24 Q50 22 48 20" fill="#f19e28"/>',

    "doors.html": '<defs><radialGradient id="g-doors" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#faeee7"/><stop offset="100%" stop-color="#cca08a"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-doors)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="18" y="58" width="44" height="4" rx="1" fill="#99806e" stroke="#33241b" stroke-width="1.4"/><path d="M22 58 L22 28 C22 18 58 18 58 28 L58 58 Z" fill="#69432e" stroke="#33241b" stroke-width="1.6" stroke-linejoin="round"/><path d="M25 58 L25 30 C25 21 55 21 55 30 L55 58 Z" fill="#a46d4a" stroke="#33241b" stroke-width="1.4"/><path d="M29 33 C29 27 51 27 51 33 L51 40 L29 40 Z" fill="#8c5838" stroke="#33241b" stroke-width="1.2"/><rect x="29" y="44" width="22" height="11" rx="1.5" fill="#8c5838" stroke="#33241b" stroke-width="1.2"/><circle cx="33" cy="42" r="2.2" fill="#d9aa42" stroke="#33241b" stroke-width="1"/><rect x="32" y="44" width="2" height="3" rx="0.5" fill="#d9aa42"/>',

    "bells.html": '<defs><radialGradient id="g-bells" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#fdf3dc"/><stop offset="100%" stop-color="#deb45d"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-bells)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><circle cx="40" cy="19" r="4.5" fill="none" stroke="#8a6729" stroke-width="2"/><circle cx="40" cy="19" r="4.5" fill="none" stroke="#33241b" stroke-width="1.3"/><path d="M33 24 C33 24 47 24 47 24 C49 32 54 44 58 48 C54 50 26 50 22 48 C26 44 31 32 33 24 Z" fill="#e8ba45" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><path d="M25 45 C32 46 48 46 55 45" stroke="#8c6422" stroke-width="1.4" fill="none"/><line x1="40" y1="46" x2="40" y2="55" stroke="#33241b" stroke-width="1.8"/><circle cx="40" cy="56" r="3.5" fill="#d99f2e" stroke="#33241b" stroke-width="1.3"/><path d="M17 40 C14 44 14 48 17 52" stroke="#d49c2d" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M63 40 C66 44 66 48 63 52" stroke="#d49c2d" stroke-width="1.5" stroke-linecap="round" fill="none"/>',

    "swing.html": '<defs><radialGradient id="g-swing" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#eaf5eb"/><stop offset="100%" stop-color="#9fc7a3"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-swing)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><line x1="28" y1="16" x2="28" y2="48" stroke="#78593a" stroke-width="1.6"/><line x1="52" y1="16" x2="52" y2="48" stroke="#78593a" stroke-width="1.6"/><rect x="22" y="47" width="36" height="6" rx="2" fill="#aa7142" stroke="#33241b" stroke-width="1.5"/><line x1="24" y1="50" x2="56" y2="50" stroke="#754722" stroke-width="1"/><path d="M28 26 C24 24 22 27 24 30 C27 30 28 28 28 26 Z" fill="#5c9367" stroke="#33241b" stroke-width="0.8"/><path d="M52 32 C56 30 58 33 56 36 C53 36 52 34 52 32 Z" fill="#5c9367" stroke="#33241b" stroke-width="0.8"/>',

    "games.html": '<defs><radialGradient id="g-games" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#e8eef4"/><stop offset="100%" stop-color="#a4b7ca"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-games)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="18" y="27" width="44" height="26" rx="10" fill="#4b5d6e" stroke="#222e38" stroke-width="1.5"/><rect x="21" y="30" width="38" height="20" rx="8" fill="#586d80"/><path d="M28 35 H32 V38 H35 V42 H32 V45 H28 V42 H25 V38 H28 Z" fill="#202a33"/><circle cx="50" cy="37" r="2.5" fill="#cf5c48" stroke="#222e38" stroke-width="0.8"/><circle cx="55" cy="42" r="2.5" fill="#dfa83d" stroke="#222e38" stroke-width="0.8"/><rect x="38" y="44" width="3" height="1.5" rx="0.5" fill="#202a33"/><rect x="42" y="44" width="3" height="1.5" rx="0.5" fill="#202a33"/>',

    "music.html": '<defs><radialGradient id="g-music" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#f5eef7"/><stop offset="100%" stop-color="#c1a8ca"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-music)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><path d="M33 55 C31 55 29 53 29 51 C29 48 31 46 34 47 C37 48 37 54 34 56 C33 57 33 60 35 60 C37 60 38 56 38 53 L38 23 C38 17 34 19 33 24 C32 29 39 37 39 42 C39 47 34 50 30 46 C26 42 27 35 32 32 C34 31 35 32 34 34 C33 36 30 36 30 40 C30 43 34 44 36 41 C37 38 33 32 35 25 C36 21 39 20 40 22 C41 24 41 45 41 53" fill="none" stroke="#2c2236" stroke-width="2" stroke-linecap="round"/><ellipse cx="48" cy="46" rx="3.5" ry="2.5" fill="#2c2236" transform="rotate(-18 48 46)"/><ellipse cx="58" cy="43" rx="3.5" ry="2.5" fill="#2c2236" transform="rotate(-18 58 43)"/><line x1="51" y1="45" x2="51" y2="28" stroke="#2c2236" stroke-width="1.8"/><line x1="61" y1="42" x2="61" y2="25" stroke="#2c2236" stroke-width="1.8"/><polygon points="50,28 62,25 62,29 50,32" fill="#2c2236"/><circle cx="56" cy="19" r="1.5" fill="#d99f2e"/>',

    "movies.html": '<defs><radialGradient id="g-movies" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#f5ede6"/><stop offset="100%" stop-color="#c6b19f"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-movies)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="20" y="32" width="40" height="28" rx="3" fill="#30261e" stroke="#1f1812" stroke-width="1.5"/><line x1="26" y1="40" x2="54" y2="40" stroke="#f6eee6" stroke-width="1.5"/><line x1="26" y1="47" x2="42" y2="47" stroke="#f6eee6" stroke-width="1.3"/><line x1="26" y1="53" x2="38" y2="53" stroke="#f6eee6" stroke-width="1.3"/><polygon points="49,46 50.5,50 54.5,50 51.5,52.5 52.5,56.5 49,54 45.5,56.5 46.5,52.5 43.5,50 47.5,50" fill="#dfa83d"/><g transform="translate(18 20) rotate(-10)"><rect x="0" y="0" width="44" height="10" rx="2" fill="#30261e" stroke="#1f1812" stroke-width="1.3"/><polygon points="6,0 12,0 8,10 2,10" fill="#fffdf8"/><polygon points="17,0 23,0 19,10 13,10" fill="#fffdf8"/><polygon points="28,0 34,0 30,10 24,10" fill="#fffdf8"/><polygon points="39,0 44,0 41,10 35,10" fill="#fffdf8"/></g>',

    "calendar.html": '<defs><radialGradient id="g-cal" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#faeee9"/><stop offset="100%" stop-color="#d69f92"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-cal)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="22" y="21" width="36" height="40" rx="4" fill="#fffdf7" stroke="#33241b" stroke-width="1.5"/><path d="M22 25 C22 23 23 21 26 21 L54 21 C57 21 58 23 58 25 L58 31 L22 31 Z" fill="#b94f3e" stroke="#33241b" stroke-width="1.3"/><circle cx="28" cy="20" r="1.8" fill="#755a46" stroke="#33241b" stroke-width="1"/><circle cx="40" cy="20" r="1.8" fill="#755a46" stroke="#33241b" stroke-width="1"/><circle cx="52" cy="20" r="1.8" fill="#755a46" stroke="#33241b" stroke-width="1"/><g fill="#9e8a7c"><circle cx="28" cy="37" r="1.5"/><circle cx="35" cy="37" r="1.5"/><circle cx="42" cy="37" r="1.5"/><circle cx="49" cy="37" r="1.5"/><circle cx="28" cy="44" r="1.5"/><circle cx="35" cy="44" r="1.5"/><circle cx="42" cy="44" r="1.5"/><circle cx="49" cy="44" r="1.5"/><circle cx="28" cy="51" r="1.5"/><circle cx="35" cy="51" r="1.5"/><circle cx="42" cy="51" r="1.5"/><circle cx="49" cy="51" r="1.5"/></g><circle cx="42" cy="44" r="4.5" fill="#f8d672" stroke="#caa168" stroke-width="1"/><circle cx="42" cy="44" r="2" fill="#c04e3e"/><circle cx="48" cy="18" r="2.2" fill="#e5b23d" stroke="#33241b" stroke-width="1"/>',

    "rewards.html": '<defs><radialGradient id="g-trophy" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#fff8df"/><stop offset="100%" stop-color="#f5cf6d"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-trophy)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><rect x="28" y="55" width="24" height="6" rx="1.5" fill="#694b34" stroke="#33241b" stroke-width="1.4"/><path d="M37 47 L37 55 L43 55 L43 47 Z" fill="#d9a738" stroke="#33241b" stroke-width="1.3"/><path d="M26 23 L54 23 C54 36 48 47 40 47 C32 47 26 36 26 23 Z" fill="#f1be42" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="40" cy="23" rx="14" ry="3.5" fill="#ffd868" stroke="#33241b" stroke-width="1.3"/><path d="M26 26 C19 26 19 38 27 41" fill="none" stroke="#d9a738" stroke-width="2.5" stroke-linecap="round"/><path d="M26 26 C19 26 19 38 27 41" fill="none" stroke="#33241b" stroke-width="1.3" stroke-linecap="round"/><path d="M54 26 C61 26 61 38 53 41" fill="none" stroke="#d9a738" stroke-width="2.5" stroke-linecap="round"/><path d="M54 26 C61 26 61 38 53 41" fill="none" stroke="#33241b" stroke-width="1.3" stroke-linecap="round"/><polygon points="40,28 41.5,32.5 46,32.5 42.5,35 43.8,39.5 40,37 36.2,39.5 37.5,35 34,32.5 38.5,32.5" fill="#ffffff" stroke="#c08f25" stroke-width="0.8"/><path d="M22 18 Q24 20 26 18 Q24 20 22 22 Q24 20 22 18" fill="#e5b23d"/>',

    "journey.html": '<defs><radialGradient id="g-rocket" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#e2eff9"/><stop offset="100%" stop-color="#91b5d6"/></radialGradient></defs><circle cx="40" cy="40" r="34" fill="url(#g-rocket)" stroke="#caa168" stroke-width="1.2"/><ellipse cx="36" cy="18" rx="16" ry="6" fill="#ffffff" opacity="0.45"/><g transform="translate(40 40) rotate(-45) translate(-40 -40)"><polygon points="36,54 40,68 44,54 40,58" fill="#f39c12"/><polygon points="38,54 40,64 42,54" fill="#f1c40f"/><path d="M30 46 C28 54 25 56 24 56 C28 55 33 52 34 48 Z" fill="#b94a3a" stroke="#33241b" stroke-width="1.2"/><path d="M50 46 C52 54 55 56 56 56 C52 55 47 52 46 48 Z" fill="#b94a3a" stroke="#33241b" stroke-width="1.2"/><path d="M40 18 C33 28 33 46 34 54 L46 54 C47 46 47 28 40 18 Z" fill="#fdfaf5" stroke="#33241b" stroke-width="1.5" stroke-linejoin="round"/><path d="M40 18 C37 23 35 27 34 31 L46 31 C45 27 43 23 40 18 Z" fill="#b94a3a" stroke="#33241b" stroke-width="1.3"/><circle cx="40" cy="38" r="4.5" fill="#5b92bd" stroke="#33241b" stroke-width="1.3"/><ellipse cx="39" cy="37" rx="2" ry="1" fill="#ffffff" opacity="0.7"/></g><circle cx="22" cy="24" r="1.2" fill="#ffd97d"/><circle cx="60" cy="20" r="1.5" fill="#ffd97d"/><circle cx="62" cy="56" r="1" fill="#ffd97d"/>'
  };

  /* Build each group and candy item in the shelf. */
  GROUPS.forEach(([title, links]) => {
    const g = document.createElement("div");
    g.className = "candy-group";
    g.setAttribute("role", "group");
    g.setAttribute("aria-label", title.replace(/^\S+\s/, ""));
    g.style.setProperty("--n", links.length);
    g.innerHTML = '<div class="candy-glabel" aria-hidden="true">' + title + '</div><div class="candy-row"></div>';
    const row = g.querySelector(".candy-row");
    links.forEach(([href, label]) => {
      const a = document.createElement("a");
      a.className = "candy";
      a.href = href;
      const svgArt = ICONS[href] || ICONS["reading.html"];
      a.innerHTML = '<span class="candy-art" aria-hidden="true"><svg viewBox="0 0 80 80">' + svgArt + '</svg></span><span class="candy-label">' + label + '</span>';
      a.addEventListener("click", e => eat(e, a));
      row.appendChild(a);
    });
    shelf.appendChild(g);
  });

  /* Storybook Drawer Toggle logic */
  const drawer = document.getElementById("candyDrawer");
  const toggleBtn = document.getElementById("candyToggleBtn");
  const closeBtn = document.getElementById("candyCloseBtn");
  const backdrop = document.getElementById("candyBackdrop");
  const blanket = document.getElementById("candyBlanket");

  function setDrawerOpen(open) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
      const arrow = toggleBtn.querySelector(".candy-toggle-arrow");
      if (arrow) arrow.textContent = open ? "▶" : "◀";
    }
    if (blanket) {
      if (open) {
        blanket.removeAttribute("aria-hidden");
      } else {
        blanket.setAttribute("aria-hidden", "true");
      }
    }
    try {
      localStorage.setItem("ahaanCandyDrawerOpen", open ? "true" : "false");
    } catch (e) {}
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentlyOpen = drawer && drawer.classList.contains("is-open");
      setDrawerOpen(!currentlyOpen);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setDrawerOpen(false);
      if (toggleBtn) toggleBtn.focus();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => setDrawerOpen(false));
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
      setDrawerOpen(false);
      if (toggleBtn) toggleBtn.focus();
    }
  });

  /* Keep collapsed by default on phones and tablets to leave the 3D park clear. */
  let savedOpen = false;
  try {
    savedOpen = localStorage.getItem("ahaanCandyDrawerOpen") === "true";
  } catch (e) {}
  if (window.innerWidth < 860) savedOpen = false;
  setDrawerOpen(savedOpen);

  // Five comic lines per page
  const PHRASES = {
    "reading.html": ["Bookworm power, ACTIVATE!", "This book is so good my eyeballs did a backflip!", "Shh... the pages are whispering!", "One more chapter. Okay, FIVE more!", "Reading gives my brain the zoomies!"],
    "kindle.html": ["Beep boop! Story download complete!", "My Kindle is HUNGRY for stories!", "Swipe, swipe... ADVENTURE!", "Tiny screen, GIGANTIC stories!", "Page-turning power: 1000 percent!"],
    "library.html": ["To the library, at TOP SPEED!", "Shhh... ZOOM! Library mode!", "So many books, so little bedtime!", "Library card: FULLY CHARGED!", "The books missed me. I could tell."],
    "story.html": ["Once upon a time... something SILLY happened!", "Author Ahaan is IN the building!", "My pencil has BIG plans!", "Warning: this story may contain giggles!", "Plot twist: the hot dog was the hero all along!"],
    "sketchbook.html": ["Time to draw and explore!", "Singapore sketchbook open!", "Check out these cool drawings!", "Magnifying glass ready!", "Curled pages feel like real paper!"],
    "geography.html": ["Map-tastic! Where to, Captain?", "Continents, ASSEMBLE!", "Latitude! Longitude! LUNCH-itude!", "Adventure is THAT way. Probably.", "I can see my house from here! (Not really.)"],
    "quiz.html": ["Brain, don't fail me now!", "Capital cities? I've GOT this!", "Ding ding! Quiz brain ONLINE!", "My brain is doing push-ups!", "Ask me anything. Well... almost anything!"],
    "doors.html": ["Knock knock! Who's there? THE WHOLE WORLD!", "Which door? ALL the doors!", "Opening doors like a PRO!", "Wisdom delivery, coming right up!", "Behind this door: something AWESOME!"],
    "bells.html": ["DING! DONG! Hello, world!", "Ring-a-ding-ding, here I go!", "Bells of the world, UNITE!", "Jingle mode: ON!", "Tiny ring, BIG smile!"],
    "swing.html": ["Higher! HIGHER! To the MOON!", "Whoosh! My tummy just did a flip!", "Swing champion, reporting for duty!", "I'm basically flying. Pretty much.", "Up, up, and a-SWING!"],
    "games.html": ["Game face: ON!", "Ready, set, GAME TIME!", "Level up, here I come!", "Victory dance... loading...", "High score, you're MINE!"],
    "music.html": ["Drop the beat! (Gently.)", "My ears are throwing a PARTY!", "La la la... I'm a ROCK STAR!", "Piano fingers: warmed up!", "This song is stuck in my brain. GOOD!"],
    "movies.html": ["Lights, camera, SNACKS!", "Popcorn ready! Eyeballs ready!", "Movie night is the BEST night!", "Plot twist: I ate all the popcorn!", "Shh... the good part is coming!"],
    "calendar.html": ["What day is it? FUN day!", "Stickers on my calendar? YES!", "Planning mode: ACTIVATED!", "Today is a great day to be awesome!", "Countdown to fun: 3... 2... 1!"],
    "rewards.html": ["Badge time! SHINY!", "Look at all my trophies!", "Achievement unlocked: being AWESOME!", "Gold star for ME!", "My badges are sparkling at me!"],
    "journey.html": ["Look how far I've come!", "Chapter one: me! Chapter two: ALSO me!", "My story so far is EPIC!", "Time machine, take me back!", "From tiny to TERRIFIC!"]
  };

  function phraseFor(href) {
    const list = PHRASES[href] || ["YUM! Let's go!"];
    let lastMap = {}; try { lastMap = JSON.parse(localStorage.getItem("ahaanPhraseLast")) || {}; } catch (e) {}
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastMap[href]) i = (i + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
    lastMap[href] = i; try { localStorage.setItem("ahaanPhraseLast", JSON.stringify(lastMap)); } catch (e) {}
    return list[i];
  }

  function bubble(text, at) {
    const b = document.createElement("div"); b.className = "comic-bubble"; b.setAttribute("role", "status"); b.textContent = text;
    const m = (window.AhaanFigure && AhaanFigure.mouth && AhaanFigure.mouth()) || at;
    Object.assign(b.style, { left: Math.max(290, m.x - 30) + "px", top: (m.y + 46) + "px" });
    document.body.appendChild(b);
  }

  function burst(text, at) {
    const b = document.createElement("div"); b.className = "comic-burst"; b.setAttribute("aria-hidden", "true"); b.textContent = text;
    Object.assign(b.style, { left: at.x + 70 + "px", top: at.y + 10 + "px" }); document.body.appendChild(b);
  }

  let busy = false, timers = [];
  function eat(e, a) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || calm()) return;   // normal link
    e.preventDefault();
    if (busy) return; busy = true;
    const F = window.AhaanFigure || {}, href = a.getAttribute("href");
    const art = a.querySelector(".candy-art"), r = art.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const fig = document.getElementById("ahaanFigure").getBoundingClientRect();
    const fallback = { x: fig.left + fig.width / 2, y: fig.top + fig.height * 0.2 };
    const where = fn => (typeof fn === "function" && fn()) || fallback;
    const fly = art.cloneNode(true);
    fly.className = "candy-fly";
    Object.assign(fly.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.appendChild(fly);
    const moveTo = (pt, scale, ms) => { fly.style.transitionDuration = ms + "ms, 250ms"; fly.style.transform = "translate(" + (pt.x - cx) + "px," + (pt.y - cy) + "px) scale(" + scale + ") rotate(20deg)"; };
    const go = () => { if (busy) location.href = a.href; };
    if (F.pose) F.pose("reach");                                                               // 1. he reaches for the sweet
    timers = [
      setTimeout(() => moveTo(where(F.hand), 0.55, 420), 300),                                  // 2. it lands in his hand
      setTimeout(() => { if (F.pose) F.pose("mouth"); moveTo(where(F.mouth), 0.4, 380); }, 760), // 3. hand to mouth
      setTimeout(() => {                                                                        // 4. CHOMP! and a silly line
        fly.style.opacity = "0"; if (F.chomp) F.chomp();
        burst("CHOMP!", where(F.mouth)); bubble(phraseFor(href), where(F.head));
      }, 1160),
      setTimeout(() => { if (F.pose) F.pose("rest"); }, 1600),
      setTimeout(go, 3000)                                                                      // 5. off to the page
    ];
    setTimeout(() => document.addEventListener("click", go, { once: true }), 50);              // a click anywhere skips ahead
  }

  // Coming back with the Back button: clear any leftover sweets.
  addEventListener("pageshow", () => {
    busy = false;
    timers.forEach(clearTimeout);
    if (window.AhaanFigure && AhaanFigure.pose) AhaanFigure.pose("rest");
    document.querySelectorAll(".candy-fly, .nom, .comic-bubble, .comic-burst").forEach(n => n.remove());
  });
})();
