/* =================  — vanilla JS ==================
   Features:
   1. Composer (live counter, poll builder, posts to top of timeline)
   2. Interactive actions: like / repost / bookmark / reply counts w/ animation
   3. Infinite-scroll timeline + "Show new posts" live pill
   4. Customize your view (accent color, font size, background) persisted
   5. Explore page with category chips + search filtering, votable polls
========================================================= */
(function () {
  "use strict";

  /* ---------------- data ---------------- */
  const AV = [
    ["#7c5cff", "#31d0aa"], ["#f5a524", "#ff5d8f"], ["#1d9bf0", "#00ba7c"],
    ["#ff7a45", "#ffd166"], ["#8b5cf6", "#22d3ee"], ["#ef4444", "#f59e0b"]
  ];

  const SEED = [
    { name: "Ndeeleh ❤️", handle: "sleendeel", v: 1, time: "2h",
      text: "There's this trending hairstyle that most ladies are doing now. Yessesss 😭🔥🔥🔥",
      c: 12, r: 10, l: 241, views: "41K", tag: "Trending" },

    { name: "NASA", handle: "NASA", v: 1, time: "3h",
      text: "Webb just resolved water vapour in a protoplanetary disk 370 light-years away. Baby planets are drinking. 🪐💧",
      media: "JWST · PROTOPLANETARY DISK", g: 2,
      c: 1204, r: 8900, l: 62000, views: "3.1M", tag: "Science" },

    { name: "Letterboxd", handle: "letterboxd", v: 1, time: "4h",
      text: "Nobody: \nAbsolutely nobody:\nMe at 2am: rewatching Spider-Verse to study the frame rate 🕷️",
      c: 430, r: 1200, l: 18400, views: "902K", tag: "Pop culture" },

    { name: "Dr. Ada Okonjo", handle: "quantum_ada", v: 0, time: "5h",
      text: "Reminder: a cup of coffee cooling on your desk is doing thermodynamics better than most of my students. ☕📉",
      c: 88, r: 302, l: 4100, views: "210K", tag: "Science" },

    { name: "FTMO.com", handle: "FTMO_com", v: 2, time: "6h", ad: true,
      text: "Trust in yourself. Trust in FTMO. Trading masters are born every day. Master your skills today!",
      media: "FTMO CHALLENGE", g: 0,
      c: 64, r: 21, l: 190, views: "1.2M" },

    { name: "Beyhive HQ", handle: "beyhive", v: 1, time: "7h",
      text: "The tour visuals were rendered on 12 GPUs and a prayer. Renaissance never ended. 🐝✨",
      c: 900, r: 5400, l: 88000, views: "6.4M", tag: "Pop culture" },

    { name: "Chirp Polls", handle: "chirp_polls", v: 1, time: "8h",
      text: "Best sci-fi that actually respects physics?",
      poll: ["Interstellar", "The Expanse", "Arrival", "Contact"],
      c: 340, r: 210, l: 2900, views: "540K", tag: "Poll" },

    { name: "CERN", handle: "CERN", v: 1, time: "9h",
      text: "We collided protons 40 million times a second today and the most fragile thing in the building was still the coffee machine.",
      c: 210, r: 3300, l: 41000, views: "2.2M", tag: "Science" },

    { name: "Retro Gamer", handle: "pixel_pushr", v: 0, time: "11h",
      text: "Sonic on the Mega Drive ran at 60fps in 1991. Your loading spinner does not need 400kb of JavaScript. 🦔",
      c: 512, r: 2100, l: 30100, views: "1.5M", tag: "Tech" },

    { name: "Kitchen Chaos", handle: "chaos_chef", v: 0, time: "13h",
      text: "Maillard reaction is just science giving you permission to burn the steak a little. 🥩🔥",
      c: 74, r: 190, l: 3300, views: "180K", tag: "Food" },

    { name: "Space Weather", handle: "aurora_watch", v: 1, time: "15h",
      text: "G3 storm incoming — aurora possible as far south as Cape Town's latitude twin. Look up around 22:00 local. 🌌",
      media: "KP INDEX 7 · AURORA ALERT", g: 4,
      c: 150, r: 2400, l: 19000, views: "1.1M", tag: "Science" },

    { name: "Afrobeats Daily", handle: "afro_daily", v: 1, time: "18h",
      text: "Ayra Starr drops 'Starrgirl' and lands the halftime headline. Sis said global and meant it. 🌍🎤",
      c: 620, r: 4100, l: 51000, views: "3.8M", tag: "Pop culture" }
  ];

  const MORE = [
    "Fun fact: octopuses have three hearts and zero interest in your deadlines. 🐙",
    "Just learned that honey found in Egyptian tombs is still edible. Sugar is immortal. 🍯",
    "Hot take: the best Star Wars is whichever one you watched at nine years old. ⭐",
    "Physicists named a quark 'strange' and then acted surprised when it behaved oddly. ⚛️",
    "The Mars rover plays itself Happy Birthday every year. Alone. On a dead planet. 🎂🔴",
    "A Rubik's cube has 43 quintillion states and I have found none of them. 🧩",
    "Sourdough starters are technically pets you are legally allowed to eat. 🍞",
    "Voyager 1 is 24 billion km away and still returning calls. Best signal in the family. 📡",
    "Anime openings solved pacing before Hollywood knew there was a problem. 🎬",
    "Your phone has more compute than the entire Apollo program. Use it for cat videos. Respectfully. 🐈"
  ];

  const NAMES = [
    ["Sci Bites", "sci_bites"],
    ["Culture Log", "culture_log"],
    ["Deep Field", "deep_field"],
    ["Studio Notes", "studio_notes"],
    ["Lab Leak (the good kind)", "lab_notes"]
  ];

  const TRENDS = [
    ["Science · Trending", "Artemis II", "128K posts"],
    ["Music · Trending", "#Starrgirl", "94.2K posts"],
    ["Pop culture", "Spider-Verse 3", "61K posts"],
    ["Tech · Trending", "WebGPU", "22.8K posts"],
    ["Sports", "Halftime Show", "312K posts"]
  ];

  const FOLLOWS = [
    ["Vera Rubin Obs.", "rubin_obs", 1],
    ["Pop Culture Died", "pcd", 0],
    ["Quantum Daily", "qdaily", 1]
  ];

  const EXPLORE = [
    { cat: "Science", t: "Artemis II crew shares first Earthrise photos", s: "Trending · 128K posts" },
    { cat: "Science", t: "Room-temperature superconductor claim, round nine", s: "1 hour ago · Science" },
    { cat: "Pop culture", t: "Ayra Starr drops 'Starrgirl' album", s: "1 day ago · Entertainment · 1,874 posts" },
    { cat: "Pop culture", t: "Spider-Verse 3 teaser breaks record", s: "Trending · 61K posts" },
    { cat: "Tech", t: "Everyone is rewriting their app in Rust again", s: "Trending · 22.8K posts" },
    { cat: "Tech", t: "Local-first apps are having a moment", s: "4 hours ago · Technology" },
    { cat: "Sports", t: "Halftime show line-up leaks early", s: "Trending · 312K posts" },
    { cat: "Gaming", t: "Speedrunner clears classic in 4 minutes", s: "6 hours ago · Gaming" },
    { cat: "Science", t: "Octopus cognition study stuns researchers", s: "Trending · 18K posts" },
    { cat: "Gaming", t: "Handheld emulation golden age, explained", s: "Yesterday · Gaming" }
  ];

  const ACCENTS = [
    ["#1d9bf0", "Blue"],
    ["#ffd400", "Yellow"],
    ["#f91880", "Pink"],
    ["#7856ff", "Purple"],
    ["#ff7a00", "Orange"],
    ["#00ba7c", "Green"]
  ];

  const FONTS = ["13px", "14px", "15px", "16px", "17px"];

  /* ---------------- helpers ---------------- */

  const $ = (s, r) =>
    (r || document).querySelector(s);

  const $$ = (s, r) =>
    Array.from((r || document).querySelectorAll(s));

  const esc = (s) =>
    s.replace(
      /[&<>"]/g,
      (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      }[c])
    );

  const nfmt = (n) =>
    n >= 1e6
      ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
      : n >= 1e3
      ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
      : String(n);

  const rand = (a) =>
    a[Math.floor(Math.random() * a.length)];

  const linkify = (t) =>
    esc(t)
      .replace(
        /(#[\w]+)/g,
        '<a href="#">$1</a>'
      )
      .replace(
        /(@[\w]+)/g,
        '<a href="#">$1</a>'
      )
      .replace(/\n/g, "<br>");

  let toastT;

  function toast(msg) {
    const el = $("#toast");

    if (!el) return;

    el.textContent = msg;
    el.classList.add("show");

    clearTimeout(toastT);

    toastT = setTimeout(
      () => el.classList.remove("show"),
      1800
    );
  }

  /* ---------------- SVG icons ---------------- */

  const ICON = {
    reply:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5h16v11H9l-5 4V5Z"/></svg>',

    rt:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 7h9a3 3 0 0 1 3 3v5m0 0-3-3m3 3 3-3M17 17H8a3 3 0 0 1-3-3V9m0 0 3 3M5 9 2 12"/></svg>',

    like:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1c0 4.9-7 9.3-7 9.3Z"/></svg>',

    views:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 20V10M10 20V4M16 20v-7M22 20h-20"/></svg>',

    save:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 3h12v18l-6-5-6 5V3Z"/></svg>',

    share:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 16V4m0 0-4 4m4-4 4 4M5 15v4h14v-4"/></svg>',

    check:
      '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" d="m5 12 5 5 9-10"/></svg>',

    verified: (gold) =>
      '<svg class="verified' +
      (gold ? " gold" : "") +
      '" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 1.8 3-.3 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.3L12 22l-2.4-1.8-3 .3-1-2.8L3 16.1l1-2.9-1-2.9 2.6-1.6 1-2.8 3 .3L12 2Zm-1 13 5-5-1.4-1.4L11 12.2 9.4 10.6 8 12l3 3Z"/></svg>'
  };

  /* ---------------- tweet rendering ---------------- */

  let uid = 0;

  function tweetEl(t) {
    const g =
      AV[
        t.g != null
          ? t.g
          : uid % AV.length
      ];

    const el = document.createElement("article");

    el.className = "tweet";
    el.dataset.tag = t.tag || "";
    el.dataset.id = "t" + ++uid;

    const poll = t.poll
      ? '<div class="poll">' +
        t.poll
          .map(
            (o, i) =>
              '<button class="poll-opt" data-i="' +
              i +
              '"><span class="fill"></span><span>' +
              esc(o) +
              '<b class="pct"></b></span></button>'
          )
          .join("") +
        "</div>"
      : "";

    const media = t.media
      ? '<div class="t-media" style="background:linear-gradient(135deg,' +
        g[0] +
        "," +
        g[1] +
        ')">' +
        esc(t.media) +
        "</div>"
      : "";

    el.innerHTML =
      '<span class="avatar" style="--c1:' +
      g[0] +
      ";--c2:" +
      g[1] +
      '">' +
      esc(t.name[0]) +
      "</span>" +

      '<div class="t-body">' +

      '<div class="t-head">' +

      "<strong>" +
      esc(t.name) +
      "</strong>" +

      (t.v
        ? ICON.verified(t.v === 2)
        : "") +

      "<span>@" +
      esc(t.handle) +
      "</span>" +

      "<span>·</span>" +

      "<span>" +
      esc(t.time) +
      "</span>" +

      (t.ad
        ? '<span style="margin-left:auto">Ad</span>'
        : "") +

      '<button class="t-more" aria-label="More">' +
      '<svg viewBox="0 0 24 24">' +
      '<circle cx="5" cy="12" r="2" fill="currentColor"/>' +
      '<circle cx="12" cy="12" r="2" fill="currentColor"/>' +
      '<circle cx="19" cy="12" r="2" fill="currentColor"/>' +
      "</svg>" +
      "</button>" +

      "</div>" +

      '<p class="t-text">' +
      linkify(t.text) +
      "</p>" +

      media +

      poll +

      (t.tag
        ? '<span class="t-tag">' +
          esc(t.tag) +
          "</span>"
        : "") +

      '<div class="actions">' +
      act("reply", t.c) +
      act("rt", t.r) +
      act("like", t.l) +

      '<button class="act" data-k="views">' +
      ICON.views +
      "<span>" +
      (t.views || "1K") +
      "</span></button>" +

      '<button class="act" data-k="save">' +
      ICON.save +
      "</button>" +

      '<button class="act" data-k="share">' +
      ICON.share +
      "</button>" +

      "</div>" +

      "</div>";

    return el;
  }

  function act(k, n) {
    return (
      '<button class="act" data-k="' +
      k +
      '" data-n="' +
      (n || 0) +
      '">' +
      ICON[k] +
      "<span>" +
      nfmt(n || 0) +
      "</span>" +
      "</button>"
    );
  }

  const timeline = $("#timeline");

  function render(list, prepend) {
    if (!timeline) return;

    list.forEach((t) => {
      const el = tweetEl(t);

      if (prepend) {
        timeline.prepend(el);
      } else {
        timeline.append(el);
      }
    });
  }

  render(SEED);

  /* ---------------- interactive actions ---------------- */

  timeline.addEventListener("click", (e) => {
    const b = e.target.closest(".act");

    if (b) {
      const k = b.dataset.k;

      if (k === "like" || k === "rt") {
        const on = b.classList.toggle("on");

        let n =
          +b.dataset.n +
          (on ? 1 : -1);

        b.dataset.n = n;

        const span = $("span", b);

        if (span) {
          span.textContent = nfmt(n);
        }

        b.classList.remove("pop");

        void b.offsetWidth;

        b.classList.add("pop");

        if (on) {
          toast(
            k === "like"
              ? "Liked"
              : "Reposted"
          );
        }
      }

      else if (k === "save") {
        toast(
          b.classList.toggle("on")
            ? "Added to Bookmarks"
            : "Removed from Bookmarks"
        );
      }

      else if (k === "reply") {
        const composer = $("#composerInput");

        if (composer) {
          composer.focus();
        }

        toast("Replying in composer");
      }

      else if (k === "share") {
        toast("Link copied to clipboard");

        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(location.href)
            .catch(() => {});
        }
      }

      return;
    }

    const opt =
      e.target.closest(".poll-opt");

    if (opt) {
      const poll =
        opt.closest(".poll");

      if (
        poll.classList.contains("voted")
      ) {
        return;
      }

      poll.classList.add("voted");

      const opts =
        $$(".poll-opt", poll);

      let vals = opts.map(
        () => 10 + Math.random() * 60
      );

      vals[opts.indexOf(opt)] += 40;

      const sum =
        vals.reduce(
          (a, b) => a + b,
          0
        );

      opts.forEach((o, i) => {
        const p = Math.round(
          (vals[i] / sum) * 100
        );

        $(".fill", o).style.width =
          p + "%";

        $(".pct", o).textContent =
          " " + p + "%";

        if (o === opt) {
          o.style.fontWeight = "800";
        }
      });

      toast("Vote counted");

      return;
    }

    if (
      e.target.closest(".t-more")
    ) {
      toast("Post menu");
    }
  });

  /* ---------------- composer ---------------- */

  const input =
    $("#composerInput");

  const postBtn =
    $("#postBtn");

  const counter =
    $("#counter");

  const MAX = 280;

  function sync() {
    if (!input || !counter || !postBtn) {
      return;
    }

    const len =
      input.textContent
        .trim()
        .length;

    const left =
      MAX - len;

    counter.textContent = left;

    counter.classList.toggle(
      "warn",
      left < 20
    );

    postBtn.disabled =
      len === 0 || left < 0;
  }

  if (input) {
    input.addEventListener(
      "input",
      sync
    );

    input.addEventListener(
      "keydown",
      (e) => {
        if (
          (e.metaKey ||
            e.ctrlKey) &&
          e.key === "Enter"
        ) {
          e.preventDefault();
          publish();
        }
      }
    );
  }

  if (postBtn) {
    postBtn.addEventListener(
      "click",
      publish
    );
  }

  const navPostBtn =
    $("#navPostBtn");

  if (navPostBtn) {
    navPostBtn.addEventListener(
      "click",
      () => input && input.focus()
    );
  }

  function publish() {
    if (!input) return;

    const text =
      input.textContent.trim();

    if (!text) return;

    const pollInputs =
      $$("#pollBuilder input")
        .map((i) =>
          i.value.trim()
        )
        .filter(Boolean);

    render(
      [
        {
          name: "Moe",
          handle: "timid_jess",
          v: 0,
          time: "now",
          text: text,
          poll:
            pollInputs.length >= 2
              ? pollInputs
              : null,
          c: 0,
          r: 0,
          l: 0,
          views: "1",
          tag: "Your post"
        }
      ],
      true
    );

    input.textContent = "";

    sync();

    const pollBuilder =
      $("#pollBuilder");

    if (pollBuilder) {
      pollBuilder.classList.add(
        "hidden"
      );
    }

    $$("#pollBuilder input")
      .forEach(
        (i) => (i.value = "")
      );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    toast("Your post was sent");
  }

  $$(".composer-icons button")
    .forEach((b) =>
      b.addEventListener(
        "click",
        () => {
          const a =
            b.dataset.act;

          if (a === "poll") {
            $("#pollBuilder")
              .classList.remove(
                "hidden"
              );

            $("#pollBuilder input")
              .focus();
          }

          else if (a === "emoji") {
            input.textContent +=
              " ✨";

            input.focus();

            sync();
          }

          else {
            toast(
              a.charAt(0).toUpperCase() +
              a.slice(1) +
              " coming soon"
            );
          }
        }
      )
    );

  const removePoll =
    $("#removePoll");

  if (removePoll) {
    removePoll.addEventListener(
      "click",
      () =>
        $("#pollBuilder")
          .classList.add("hidden")
    );
  }

  /* ---------------- infinite scroll ---------------- */

  let loading = false;
  let pages = 0;

  function makeMore(n) {
    const out = [];

    for (let i = 0; i < n; i++) {
      const nm = rand(NAMES);

      out.push({
        name: nm[0],
        handle: nm[1],
        v: Math.random() > 0.6 ? 1 : 0,
        time:
          2 +
          Math.floor(
            Math.random() * 40
          ) +
          "h",
        text: rand(MORE),

        media:
          Math.random() > 0.75
            ? "CHIRP MEDIA · " +
              rand([
                "SCIENCE",
                "POP CULTURE",
                "TECH"
              ])
            : null,

        c: Math.floor(
          Math.random() * 900
        ),

        r: Math.floor(
          Math.random() * 5000
        ),

        l: Math.floor(
          Math.random() * 60000
        ),

        views: nfmt(
          Math.floor(
            Math.random() * 3e6
          )
        ),

        tag: rand([
          "Science",
          "Pop culture",
          "Tech",
          "Gaming",
          "Food"
        ])
      });
    }

    return out;
  }

  const loader =
    $("#loader");

  if (loader) {
    new IntersectionObserver(
      (entries) => {
        if (
          !entries[0].isIntersecting ||
          loading ||
          pages > 12
        ) {
          return;
        }

        loading = true;

        setTimeout(() => {
          render(makeMore(6));
          pages++;
          loading = false;
        }, 550);
      },
      {
        rootMargin: "600px"
      }
    ).observe(loader);
  }

  const newPosts =
    $("#newPosts");

  if (newPosts) {
    setInterval(() => {
      if (!newPosts.dataset.q) {
        newPosts.dataset.q = "1";

        newPosts.classList.remove(
          "hidden"
        );
      }
    }, 25000);

    newPosts.addEventListener(
      "click",
      () => {
        render(makeMore(2), true);

        newPosts.classList.add(
          "hidden"
        );

        delete newPosts.dataset.q;

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  /* ---------------- tabs ---------------- */

  $$("#feedTabs .tab[data-tab]")
    .forEach((t) =>
      t.addEventListener(
        "click",
        () => {
          $$("#feedTabs .tab")
            .forEach((x) =>
              x.classList.remove(
                "active"
              )
            );

          t.classList.add("active");

          const following =
            t.dataset.tab ===
            "following";

          $$(".tweet", timeline)
            .forEach((el) => {
              el.style.display =
                following &&
                ![
                  "Science",
                  "Poll",
                  "Your post"
                ].includes(
                  el.dataset.tag
                )
                  ? "none"
                  : "flex";
            });

          toast(
            following
              ? "Showing accounts you follow"
              : "For you"
          );
        }
      )
    );

  const sparkBtn =
    $("#sparkBtn");

  if (sparkBtn) {
    sparkBtn.addEventListener(
      "click",
      () => toast("Timeline options")
    );
  }

  /* ---------------- right rail ---------------- */

  const trends =
    $("#trends");

  if (trends) {
    trends.innerHTML =
      TRENDS.map(
        (t) =>
          "<li>" +
          "<small>" +
          t[0] +
          "</small>" +
          "<strong>" +
          t[1] +
          "</strong>" +
          "<small>" +
          t[2] +
          "</small>" +
          "</li>"
      ).join("");

    trends.addEventListener(
      "click",
      (e) => {
        const li =
          e.target.closest("li");

        if (li) {
          openExplore();

          toast(
            "Exploring " +
            $("strong", li)
              .textContent
          );
        }
      }
    );
  }

  const follows =
    $("#follows");

  if (follows) {
    follows.innerHTML =
      FOLLOWS.map(
        (f, i) =>
          '<li>' +
          '<span class="avatar" style="--c1:' +
          AV[i][0] +
          ";--c2:" +
          AV[i][1] +
          '">' +
          f[0][0] +
          "</span>" +

          '<div class="f-txt">' +
          "<strong>" +
          f[0] +
          (f[2]
            ? ICON.verified(false)
            : "") +
          "</strong>" +

          "<small>@" +
          f[1] +
          "</small>" +

          "</div>" +

          '<button class="follow-btn">Follow</button>' +
          "</li>"
      ).join("");

    follows.addEventListener(
      "click",
      (e) => {
        const b =
          e.target.closest(
            ".follow-btn"
          );

        if (!b) return;

        const on =
          b.classList.toggle("on");

        b.textContent = on
          ? "Following"
          : "Follow";
      }
    );
  }

  /* ---------------- search ---------------- */

  const search =
    $("#search");

  if (search) {
    search.addEventListener(
      "input",
      (e) => {
        const q =
          e.target.value.toLowerCase();

        $$(".tweet", timeline)
          .forEach((el) => {
            el.style.display =
              el.textContent
                .toLowerCase()
                .includes(q)
                ? "flex"
                : "none";
          });
      }
    );
  }

  /* ---------------- Explore page ---------------- */

  const cats = [
    "For you",
    "Science",
    "Pop culture",
    "Tech",
    "Sports",
    "Gaming"
  ];

  const exploreChips =
    $("#exploreChips");

  if (exploreChips) {
    exploreChips.innerHTML =
      cats
        .map(
          (c, i) =>
            '<button class="chip' +
            (i === 0
              ? " active"
              : "") +
            '" data-cat="' +
            c +
            '">' +
            c +
            "</button>"
        )
        .join("");
  }

  function paintExplore(cat) {
    const list =
      cat === "For you"
        ? EXPLORE
        : EXPLORE.filter(
            (x) => x.cat === cat
          );

    const grid =
      $("#exploreGrid");

    if (!grid) return;

    grid.innerHTML =
      list
        .map((x, i) => {
          const g =
            AV[i % AV.length];

          return (
            '<article class="ex-card">' +
            '<div class="ex-cover" style="background:linear-gradient(135deg,' +
            g[0] +
            "," +
            g[1] +
            ')">' +
            x.cat.toUpperCase() +
            "</div>" +

            '<div class="ex-body">' +
            "<small>" +
            x.s +
            "</small>" +

            "<p>" +
            x.t +
            "</p>" +

            "</div>" +
            "</article>"
          );
        })
        .join("") ||
      '<p style="color:var(--muted)">Nothing here yet.</p>';
  }

  paintExplore("For you");

  if (exploreChips) {
    exploreChips.addEventListener(
      "click",
      (e) => {
        const c =
          e.target.closest(".chip");

        if (!c) return;

        $$("#exploreChips .chip")
          .forEach((x) =>
            x.classList.remove(
              "active"
            )
          );

        c.classList.add("active");

        paintExplore(
          c.dataset.cat
        );
      }
    );
  }

  function openExplore() {
    const page =
      $("#explorePage");

    if (!page) return;

    page.hidden = false;

    document.body.style.overflow =
      "hidden";
  }

  function closePages() {
    const page =
      $("#explorePage");

    if (page) {
      page.hidden = true;
    }

    document.body.style.overflow =
      "";
  }

  $$("[data-close-page]")
    .forEach((b) =>
      b.addEventListener(
        "click",
        closePages
      )
    );

  /* ---------------- nav routing ---------------- */

  $$(".nav-item[data-page], .mobile-bar button[data-page]")
    .forEach((n) =>
      n.addEventListener(
        "click",
        (e) => {
          e.preventDefault();

          const p =
            n.dataset.page;

          $$(".nav-item")
            .forEach((x) =>
              x.classList.remove(
                "active"
              )
            );

          $$(".mobile-bar button")
            .forEach((x) =>
              x.classList.remove(
                "active"
              )
            );

          n.classList.add("active");

          if (p === "explore") {
            return openExplore();
          }

          closePages();

          if (p === "home") {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

            const badge =
              $("#notifBadge");

            if (badge) {
              badge.hidden = false;
            }
          }

          else if (
            p === "notifications"
          ) {
            const badge =
              $("#notifBadge");

            if (badge) {
              badge.hidden = true;
            }

            toast(
              "You're all caught up"
            );
          }

          else {
            toast(
              p.charAt(0).toUpperCase() +
              p.slice(1) +
              " · demo view"
            );
          }
        }
      )
    );

  /* ---------------- Customize your view ---------------- */

  const store = {
    get(k, d) {
      try {
        return (
          localStorage.getItem(
            "chirp_" + k
          ) || d
        );
      } catch (e) {
        return d;
      }
    },

    set(k, v) {
      try {
        localStorage.setItem(
          "chirp_" + k,
          v
        );
      } catch (e) {}
    }
  };

  const swatches =
    $("#swatches");

  if (swatches) {
    swatches.innerHTML =
      ACCENTS.map(
        (a) =>
          '<button class="swatch" data-c="' +
          a[0] +
          '" title="' +
          a[1] +
          '" style="background:' +
          a[0] +
          '">' +
          ICON.check +
          "</button>"
      ).join("");
  }

  function applyAccent(c) {
    document.documentElement.style.setProperty(
      "--accent",
      c
    );

    document.documentElement.style.setProperty(
      "--accent-soft",
      hexA(c, 0.14)
    );

    $$("#swatches .swatch")
      .forEach((s) =>
        s.classList.toggle(
          "active",
          s.dataset.c === c
        )
      );

    store.set("accent", c);
  }

  function hexA(h, a) {
    const n =
      parseInt(
        h.slice(1),
        16
      );

    return (
      "rgba(" +
      ((n >> 16) & 255) +
      "," +
      ((n >> 8) & 255) +
      "," +
      (n & 255) +
      "," +
      a +
      ")"
    );
  }

  function applyFont(i) {
    document.documentElement.style.setProperty(
      "--fs",
      FONTS[i]
    );

    const range =
      $("#fontRange");

    if (range) {
      range.value = i;
    }

    store.set("font", i);
  }

  function applyBg(b) {
    document.documentElement.dataset.theme =
      b;

    $$("#bgOptions button")
      .forEach((x) =>
        x.classList.toggle(
          "active",
          x.dataset.bg === b
        )
      );

    store.set("bg", b);
  }

  if (swatches) {
    swatches.addEventListener(
      "click",
      (e) => {
        const s =
          e.target.closest(
            ".swatch"
          );

        if (s) {
          applyAccent(
            s.dataset.c
          );
        }
      }
    );
  }

  const fontRange =
    $("#fontRange");

  if (fontRange) {
    fontRange.addEventListener(
      "input",
      (e) =>
        applyFont(
          +e.target.value
        )
    );
  }

  const bgOptions =
    $("#bgOptions");

  if (bgOptions) {
    bgOptions.addEventListener(
      "click",
      (e) => {
        const b =
          e.target.closest(
            "button[data-bg]"
          );

        if (b) {
          applyBg(
            b.dataset.bg
          );
        }
      }
    );
  }

  applyAccent(
    store.get(
      "accent",
      "#1d9bf0"
    )
  );

  applyFont(
    +store.get("font", 2)
  );

  applyBg(
    store.get("bg", "light")
  );

  /* ---------------- customize modal ---------------- */

  const backdrop =
    $("#customizeBackdrop");

  const openCust = () => {
    if (!backdrop) return;

    backdrop.hidden = false;

    document.body.style.overflow =
      "hidden";
  };

  const closeCust = () => {
    if (!backdrop) return;

    backdrop.hidden = true;

    const explore =
      $("#explorePage");

    document.body.style.overflow =
      explore && !explore.hidden
        ? "hidden"
        : "";
  };

  const openCustomize =
    $("#openCustomize");

  if (openCustomize) {
    openCustomize.addEventListener(
      "click",
      openCust
    );
  }

  const mOpenCustomize =
    $("#mOpenCustomize");

  if (mOpenCustomize) {
    mOpenCustomize.addEventListener(
      "click",
      openCust
    );
  }

  const closeCustomize =
    $("#closeCustomize");

  if (closeCustomize) {
    closeCustomize.addEventListener(
      "click",
      closeCust
    );
  }

  const doneCustomize =
    $("#doneCustomize");

  if (doneCustomize) {
    doneCustomize.addEventListener(
      "click",
      () => {
        closeCust();
        toast("View updated");
      }
    );
  }

  if (backdrop) {
    backdrop.addEventListener(
      "click",
      (e) => {
        if (e.target === backdrop) {
          closeCust();
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape") {
        return;
      }

      if (
        backdrop &&
        !backdrop.hidden
      ) {
        closeCust();
      } else {
        closePages();
      }
    }
  );

  /* Initial composer state */
  sync();

})();