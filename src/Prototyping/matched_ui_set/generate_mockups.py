#!/usr/bin/env python3
import os
import subprocess
import shutil

OUTPUT_DIR = "/home/syedhaseeaio/Documents/Stand-HF/src/Prototyping/matched_ui_set"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, "benchmarks"), exist_ok=True)

# 1. Copy curated benchmarks
benchmarks = [
    ("/home/syedhaseeaio/Documents/Stand-HF/src/Prototyping/login/original-9082b9b495511d1460abf79c9ba106a2.webp", "benchmarks/ref_01_login_portal.webp"),
    ("/home/syedhaseeaio/Documents/Stand-HF/src/Prototyping/home/IMG-20261107-WA0016.jpg", "benchmarks/ref_02_home_resume.jpg"),
    ("/home/syedhaseeaio/Documents/Stand-HF/src/assets/original-817e8d5833dcaa72626fd46e55c080e6.png", "benchmarks/ref_03_dashboard_coursue.png"),
    ("/home/syedhaseeaio/Documents/Stand-HF/src/Prototyping/courses/original-622eb65208f11be39cef3096a0b75635.webp", "benchmarks/ref_04_courses_edumate.webp")
]

for src, dst in benchmarks:
    dst_path = os.path.join(OUTPUT_DIR, dst)
    if os.path.exists(src):
        shutil.copy2(src, dst_path)
        print(f"Copied benchmark: {dst}")

# 2. Generate SVG for 01_login
svg_login = '''<svg width="1440" height="900" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f8f9fd"/>
      <stop offset="100%" stop-color="#eef2fb"/>
    </linearGradient>
    <linearGradient id="violet-glow" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#582be8" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#582be8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="coral-glow" x1="1440" y1="900" x2="900" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff4760" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ff4760" stop-opacity="0"/>
    </linearGradient>
    <filter id="card-shadow" x="380" y="90" width="680" height="740" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1440" height="900" fill="url(#bg-grad)"/>
  <circle cx="200" cy="150" r="400" fill="url(#violet-glow)"/>
  <circle cx="1200" cy="750" r="450" fill="url(#coral-glow)"/>

  <!-- Minimal Top Header -->
  <rect x="0" y="0" width="1440" height="72" fill="#ffffff" fill-opacity="0.8"/>
  <line x1="0" y1="72" x2="1440" y2="72" stroke="#e8ecf4" stroke-width="1"/>
  
  <!-- Logo -->
  <rect x="64" y="18" width="36" height="36" rx="10" fill="#582be8"/>
  <path d="M74 36 L80 26 L84 38 L90 36" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="112" y="42" class="font" font-size="19" font-weight="700" fill="#0f172a">STAND-HF <tspan fill="#582be8">Academy</tspan></text>
  <rect x="290" y="24" width="138" height="24" rx="12" fill="#f5f3ff"/>
  <text x="302" y="40" class="font" font-size="11" font-weight="600" fill="#582be8">CLINICAL STUDY PORTAL</text>

  <text x="1260" y="42" class="font" font-size="13" font-weight="600" fill="#64748b">Support: +92 21 9920 1271</text>

  <!-- Main Login Card Container -->
  <g filter="url(#card-shadow)">
    <rect x="420" y="110" width="600" height="690" rx="24" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  </g>

  <!-- Card Top Badge & Header -->
  <rect x="660" y="145" width="120" height="28" rx="14" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
  <circle cx="674" cy="159" r="4" fill="#10b981"/>
  <text x="686" y="163" class="font" font-size="12" font-weight="700" fill="#065f46">PMDC VERIFIED</text>

  <text x="720" y="215" class="font" font-size="26" font-weight="800" fill="#0f172a" text-anchor="middle">Physician Sign In</text>
  <text x="720" y="245" class="font" font-size="14" font-weight="500" fill="#64748b" text-anchor="middle">Access accredited Heart Failure CME protocols &amp; trial modules</text>

  <!-- Quick Demo Profile Selector -->
  <rect x="464" y="280" width="512" height="74" rx="14" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <text x="484" y="306" class="font" font-size="12" font-weight="700" fill="#0f172a">ONE-CLICK INVESTIGATOR DEMO ACCESS</text>
  <rect x="484" y="318" width="150" height="26" rx="6" fill="#582be8" fill-opacity="0.1"/>
  <text x="496" y="335" class="font" font-size="11" font-weight="600" fill="#582be8">Dr. Sarah Khan (PI)</text>
  <rect x="644" y="318" width="156" height="26" rx="6" fill="#ffffff" stroke="#e8ecf4"/>
  <text x="654" y="335" class="font" font-size="11" font-weight="600" fill="#475569">Dr. A. Siddiqui (Co-PI)</text>
  <rect x="810" y="318" width="150" height="26" rx="6" fill="#ffffff" stroke="#e8ecf4"/>
  <text x="822" y="335" class="font" font-size="11" font-weight="600" fill="#475569">Prof. M. Hashim (Admin)</text>

  <!-- Form Field 1: PMDC Number -->
  <text x="464" y="388" class="font" font-size="13" font-weight="700" fill="#0f172a">PMDC / Medical License Number</text>
  <rect x="464" y="400" width="512" height="48" rx="12" fill="#ffffff" stroke="#582be8" stroke-width="2"/>
  <text x="484" y="430" class="font" font-size="15" font-weight="600" fill="#0f172a">PMDC-74920-P</text>
  <rect x="910" y="412" width="54" height="24" rx="6" fill="#ecfdf5"/>
  <text x="918" y="428" class="font" font-size="11" font-weight="700" fill="#10b981">VALID</text>

  <!-- Form Field 2: Hospital Center -->
  <text x="464" y="482" class="font" font-size="13" font-weight="700" fill="#0f172a">Study Center / Hospital Affiliation</text>
  <rect x="464" y="494" width="512" height="48" rx="12" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="484" y="524" class="font" font-size="14" font-weight="500" fill="#0f172a">NICVD Karachi — Center #01 (STAND-HF Lead)</text>
  <path d="M944 515 L952 525 L960 515" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>

  <!-- Form Field 3: Access PIN -->
  <text x="464" y="576" class="font" font-size="13" font-weight="700" fill="#0f172a">Security Access PIN / OTP</text>
  <rect x="464" y="588" width="512" height="48" rx="12" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="484" y="618" class="font" font-size="16" font-weight="600" fill="#64748b">••••••</text>
  <text x="900" y="618" class="font" font-size="13" font-weight="600" fill="#582be8">Send OTP</text>

  <!-- Submit Button -->
  <rect x="464" y="660" width="512" height="52" rx="14" fill="#582be8"/>
  <text x="720" y="692" class="font" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Enter Learning Portal →</text>

  <!-- Security Footer -->
  <text x="720" y="748" class="font" font-size="12" font-weight="500" fill="#64748b" text-anchor="middle">🔒 End-to-End Encrypted Session · STAND-HF Protocol Registry #NCT0529841</text>
  <rect x="520" y="765" width="400" height="2" fill="#e8ecf4"/>
</svg>'''

# 3. Generate SVG for 02_home
svg_home = '''<svg width="1440" height="900" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1440" height="900" fill="#f8f9fd"/>

  <!-- Left Sidebar (Unified Navigation) -->
  <rect x="0" y="0" width="260" height="900" fill="#ffffff"/>
  <line x1="260" y1="0" x2="260" y2="900" stroke="#e8ecf4" stroke-width="1"/>

  <!-- Sidebar Brand -->
  <rect x="28" y="24" width="36" height="36" rx="10" fill="#582be8"/>
  <path d="M38 42 L44 32 L48 44 L54 42" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="76" y="48" class="font" font-size="18" font-weight="700" fill="#0f172a">STAND-HF</text>

  <!-- Nav Items -->
  <!-- Active: Home -->
  <rect x="16" y="96" width="228" height="44" rx="12" fill="#f5f3ff"/>
  <circle cx="38" cy="118" r="6" fill="#582be8"/>
  <text x="56" y="123" class="font" font-size="14" font-weight="700" fill="#582be8">Home Hub</text>

  <!-- Inactive: Courses -->
  <rect x="16" y="148" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="175" class="font" font-size="14" font-weight="600" fill="#64748b">Courses &amp; Protocols</text>

  <!-- Inactive: Dashboard -->
  <rect x="16" y="200" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="227" class="font" font-size="14" font-weight="600" fill="#64748b">CME Dashboard</text>

  <!-- Inactive: Certificates -->
  <rect x="16" y="252" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="279" class="font" font-size="14" font-weight="600" fill="#64748b">Certificates</text>

  <!-- Inactive: Study Docs -->
  <rect x="16" y="304" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="331" class="font" font-size="14" font-weight="600" fill="#64748b">Trial Guidelines</text>

  <!-- Sidebar Bottom Doctor Profile Card -->
  <rect x="16" y="796" width="228" height="72" rx="14" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <circle cx="48" cy="832" r="18" fill="#582be8"/>
  <text x="48" y="837" class="font" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">SK</text>
  <text x="76" y="826" class="font" font-size="13" font-weight="700" fill="#0f172a">Dr. Sarah Khan</text>
  <text x="76" y="844" class="font" font-size="11" font-weight="500" fill="#64748b">Principal Investigator</text>

  <!-- Top App Header -->
  <rect x="260" y="0" width="1180" height="72" fill="#ffffff"/>
  <line x1="260" y1="72" x2="1440" y2="72" stroke="#e8ecf4" stroke-width="1"/>

  <rect x="292" y="16" width="340" height="40" rx="10" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <text x="316" y="41" class="font" font-size="13" font-weight="500" fill="#64748b">🔍  Search guidelines, lectures, faculty...</text>

  <rect x="1230" y="18" width="168" height="36" rx="10" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1"/>
  <text x="1246" y="41" class="font" font-size="12" font-weight="700" fill="#582be8">⚡ 90% Rule Enforced</text>

  <!-- Main Content Area -->
  <!-- Welcome Banner Card -->
  <rect x="292" y="96" width="1108" height="150" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <rect x="292" y="96" width="1108" height="6" fill="#582be8" rx="3"/>
  <text x="328" y="146" class="font" font-size="24" font-weight="800" fill="#0f172a">Welcome back, Dr. Sarah Khan 👋</text>
  <text x="328" y="176" class="font" font-size="14" font-weight="500" fill="#64748b">You have completed 12.0 of 15.0 required CME units for the STAND-HF Acute Protocol Accreditation.</text>

  <rect x="328" y="196" width="220" height="32" rx="8" fill="#ecfdf5"/>
  <text x="342" y="217" class="font" font-size="12" font-weight="700" fill="#065f46">✓ PMDC Accreditation On-Track</text>

  <!-- Quick Resume Big Spotlight Card -->
  <rect x="292" y="266" width="720" height="260" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="324" y="304" class="font" font-size="12" font-weight="700" fill="#ff4760">CURRENT ACTIVE MODULE · QUICK RESUME</text>
  <text x="324" y="336" class="font" font-size="20" font-weight="800" fill="#0f172a">Module 03: GDMT Up-Titration in Worsening HF</text>
  <text x="324" y="362" class="font" font-size="13" font-weight="500" fill="#64748b">Lecture 4: SGLT2i and ARNI Co-Administration Timelines (18 mins remaining)</text>

  <!-- Progress Bar with 90% threshold line -->
  <rect x="324" y="390" width="656" height="12" rx="6" fill="#eef2f9"/>
  <rect x="324" y="390" width="485" height="12" rx="6" fill="#582be8"/>
  <!-- 90% Marker -->
  <line x1="914" y1="384" x2="914" y2="408" stroke="#ff4760" stroke-width="2.5" stroke-dasharray="2 2"/>
  <text x="888" y="424" class="font" font-size="11" font-weight="700" fill="#ff4760">90% Target</text>
  <text x="324" y="424" class="font" font-size="12" font-weight="600" fill="#0f172a">74% Watched (28m / 38m)</text>

  <!-- Resume Button -->
  <rect x="324" y="450" width="200" height="46" rx="12" fill="#582be8"/>
  <text x="424" y="478" class="font" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Resume Lecture 4 ▶</text>

  <!-- Right Metrics Card -->
  <rect x="1032" y="266" width="368" height="260" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="1060" y="304" class="font" font-size="16" font-weight="800" fill="#0f172a">Accreditation Summary</text>
  
  <rect x="1060" y="328" width="312" height="54" rx="12" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <text x="1076" y="352" class="font" font-size="12" font-weight="600" fill="#64748b">Total CME Credits</text>
  <text x="1076" y="372" class="font" font-size="16" font-weight="800" fill="#582be8">12.0 / 15.0 hrs</text>

  <rect x="1060" y="394" width="312" height="54" rx="12" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <text x="1076" y="418" class="font" font-size="12" font-weight="600" fill="#64748b">Mandatory Watch Threshold</text>
  <text x="1076" y="438" class="font" font-size="16" font-weight="800" fill="#10b981">92.4% Average</text>

  <rect x="1060" y="460" width="312" height="46" rx="12" fill="#f5f3ff"/>
  <text x="1076" y="488" class="font" font-size="13" font-weight="700" fill="#582be8">View Full CME Dashboard →</text>

  <!-- Lower Section: Next Protocols Grid -->
  <text x="292" y="562" class="font" font-size="18" font-weight="800" fill="#0f172a">Recommended Protocols &amp; Grand Rounds</text>

  <!-- Protocol Card 1 -->
  <rect x="292" y="582" width="354" height="270" rx="18" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <rect x="312" y="602" width="80" height="24" rx="6" fill="#f5f3ff"/>
  <text x="322" y="618" class="font" font-size="11" font-weight="700" fill="#582be8">CLINICAL</text>
  <text x="312" y="652" class="font" font-size="16" font-weight="800" fill="#0f172a">Diuretic Resistance &amp; Biomarkers</text>
  <text x="312" y="678" class="font" font-size="12" font-weight="500" fill="#64748b">Guidance on loop diuretics, thiazides, and urine sodium assessment.</text>
  <text x="312" y="740" class="font" font-size="12" font-weight="600" fill="#0f172a">Credits: 3.5 CME · 4 Lectures</text>
  <rect x="312" y="760" width="314" height="8" rx="4" fill="#eef2f9"/>
  <rect x="312" y="760" width="314" height="8" rx="4" fill="#10b981"/>
  <text x="312" y="790" class="font" font-size="12" font-weight="700" fill="#10b981">Completed &amp; Certified ✓</text>

  <!-- Protocol Card 2 -->
  <rect x="668" y="582" width="354" height="270" rx="18" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <rect x="688" y="602" width="80" height="24" rx="6" fill="#fff1f3"/>
  <text x="698" y="618" class="font" font-size="11" font-weight="700" fill="#ff4760">TRIALS</text>
  <text x="688" y="652" class="font" font-size="16" font-weight="800" fill="#0f172a">In-Hospital Protocol Execution</text>
  <text x="688" y="678" class="font" font-size="12" font-weight="500" fill="#64748b">STAND-HF randomisation, inclusion/exclusion, and safety reporting.</text>
  <text x="688" y="740" class="font" font-size="12" font-weight="600" fill="#0f172a">Credits: 4.0 CME · 6 Lectures</text>
  <rect x="688" y="760" width="314" height="8" rx="4" fill="#eef2f9"/>
  <rect x="688" y="760" width="180" height="8" rx="4" fill="#582be8"/>
  <text x="688" y="790" class="font" font-size="12" font-weight="700" fill="#582be8">In Progress (58%)</text>

  <!-- Protocol Card 3 -->
  <rect x="1046" y="582" width="354" height="270" rx="18" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <rect x="1066" y="602" width="80" height="24" rx="6" fill="#f8f9fd" stroke="#e8ecf4"/>
  <text x="1076" y="618" class="font" font-size="11" font-weight="700" fill="#64748b">ELECTIVE</text>
  <text x="1066" y="652" class="font" font-size="16" font-weight="800" fill="#0f172a">Cardiorenal Syndrome Interventions</text>
  <text x="1066" y="678" class="font" font-size="12" font-weight="500" fill="#64748b">Renal hemodynamics, ultrafiltration, and nephrology coordination.</text>
  <text x="1066" y="740" class="font" font-size="12" font-weight="600" fill="#0f172a">Credits: 2.5 CME · 3 Lectures</text>
  <rect x="1066" y="760" width="314" height="8" rx="4" fill="#eef2f9"/>
  <text x="1066" y="790" class="font" font-size="12" font-weight="600" fill="#64748b">Not Started</text>
</svg>'''

# 4. Generate SVG for 03_dashboard
svg_dashboard = '''<svg width="1440" height="900" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1440" height="900" fill="#f8f9fd"/>

  <!-- Left Sidebar (Matching) -->
  <rect x="0" y="0" width="260" height="900" fill="#ffffff"/>
  <line x1="260" y1="0" x2="260" y2="900" stroke="#e8ecf4" stroke-width="1"/>

  <rect x="28" y="24" width="36" height="36" rx="10" fill="#582be8"/>
  <path d="M38 42 L44 32 L48 44 L54 42" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="76" y="48" class="font" font-size="18" font-weight="700" fill="#0f172a">STAND-HF</text>

  <rect x="16" y="96" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="123" class="font" font-size="14" font-weight="600" fill="#64748b">Home Hub</text>

  <rect x="16" y="148" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="175" class="font" font-size="14" font-weight="600" fill="#64748b">Courses &amp; Protocols</text>

  <!-- Active: Dashboard -->
  <rect x="16" y="200" width="228" height="44" rx="12" fill="#f5f3ff"/>
  <circle cx="38" cy="222" r="6" fill="#582be8"/>
  <text x="56" y="227" class="font" font-size="14" font-weight="700" fill="#582be8">CME Dashboard</text>

  <rect x="16" y="252" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="279" class="font" font-size="14" font-weight="600" fill="#64748b">Certificates</text>

  <rect x="16" y="304" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="331" class="font" font-size="14" font-weight="600" fill="#64748b">Trial Guidelines</text>

  <!-- Top App Header -->
  <rect x="260" y="0" width="1180" height="72" fill="#ffffff"/>
  <line x1="260" y1="72" x2="1440" y2="72" stroke="#e8ecf4" stroke-width="1"/>
  <text x="292" y="43" class="font" font-size="20" font-weight="800" fill="#0f172a">Study Compliance &amp; CME Metrics</text>

  <!-- Top 4 Metrics Summary Cards -->
  <g transform="translate(292, 96)">
    <!-- Metric 1 -->
    <rect x="0" y="0" width="262" height="110" rx="16" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="20" y="32" class="font" font-size="12" font-weight="600" fill="#64748b">TOTAL TIME LOGGED</text>
    <text x="20" y="68" class="font" font-size="28" font-weight="800" fill="#0f172a">14h 25m</text>
    <text x="20" y="92" class="font" font-size="11" font-weight="600" fill="#10b981">▲ +2.4 hrs this week</text>

    <!-- Metric 2 -->
    <rect x="282" y="0" width="262" height="110" rx="16" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="302" y="32" class="font" font-size="12" font-weight="600" fill="#64748b">MANDATORY THRESHOLD</text>
    <text x="302" y="68" class="font" font-size="28" font-weight="800" fill="#ff4760">90.0%</text>
    <text x="302" y="92" class="font" font-size="11" font-weight="600" fill="#ff4760">Rule: rules.js Strict Threshold</text>

    <!-- Metric 3 -->
    <rect x="564" y="0" width="262" height="110" rx="16" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="584" y="32" class="font" font-size="12" font-weight="600" fill="#64748b">ACTUAL WATCH COMPLETION</text>
    <text x="584" y="68" class="font" font-size="28" font-weight="800" fill="#10b981">92.4%</text>
    <text x="584" y="92" class="font" font-size="11" font-weight="700" fill="#10b981">✓ COMPLIANT FOR CERTIFICATION</text>

    <!-- Metric 4 -->
    <rect x="846" y="0" width="262" height="110" rx="16" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="866" y="32" class="font" font-size="12" font-weight="600" fill="#64748b">QUIZ PASS STATUS</text>
    <text x="866" y="68" class="font" font-size="28" font-weight="800" fill="#582be8">3 / 4</text>
    <text x="866" y="92" class="font" font-size="11" font-weight="600" fill="#582be8">1 quiz ready to unlock</text>
  </g>

  <!-- Main Left Card: 90% Watch Threshold Tracker & Module Table -->
  <rect x="292" y="230" width="760" height="630" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="324" y="268" class="font" font-size="18" font-weight="800" fill="#0f172a">STAND-HF Protocol Watch Compliance Matrix</text>
  <text x="324" y="292" class="font" font-size="13" font-weight="500" fill="#64748b">Every physician must watch $\ge$90% of each lecture video before quiz unlocking and CME certification.</text>

  <!-- Table Header -->
  <rect x="324" y="318" width="696" height="40" rx="8" fill="#f8f9fd"/>
  <text x="340" y="342" class="font" font-size="11" font-weight="700" fill="#64748b">PROTOCOL / MODULE</text>
  <text x="610" y="342" class="font" font-size="11" font-weight="700" fill="#64748b">WATCH %</text>
  <text x="750" y="342" class="font" font-size="11" font-weight="700" fill="#64748b">THRESHOLD</text>
  <text x="880" y="342" class="font" font-size="11" font-weight="700" fill="#64748b">QUIZ STATUS</text>

  <!-- Row 1 -->
  <line x1="324" y1="368" x2="1020" y2="368" stroke="#e8ecf4"/>
  <text x="340" y="398" class="font" font-size="14" font-weight="700" fill="#0f172a">Module 01: Acute Heart Failure Biomarkers</text>
  <text x="340" y="416" class="font" font-size="12" font-weight="500" fill="#64748b">NT-proBNP &amp; Troponin kinetics · 4 Lectures</text>
  <rect x="610" y="392" width="100" height="8" rx="4" fill="#eef2f9"/>
  <rect x="610" y="392" width="96" height="8" rx="4" fill="#10b981"/>
  <text x="610" y="416" class="font" font-size="12" font-weight="700" fill="#10b981">96.0%</text>
  <rect x="750" y="390" width="84" height="24" rx="6" fill="#ecfdf5"/>
  <text x="758" y="406" class="font" font-size="11" font-weight="700" fill="#065f46">PASS (≥90%)</text>
  <rect x="880" y="390" width="84" height="24" rx="6" fill="#f5f3ff"/>
  <text x="892" y="406" class="font" font-size="11" font-weight="700" fill="#582be8">Passed (92%)</text>

  <!-- Row 2 -->
  <line x1="324" y1="436" x2="1020" y2="436" stroke="#e8ecf4"/>
  <text x="340" y="466" class="font" font-size="14" font-weight="700" fill="#0f172a">Module 02: In-Hospital Worsening Protocol</text>
  <text x="340" y="484" class="font" font-size="12" font-weight="500" fill="#64748b">STAND-HF IV Diuretic titration · 5 Lectures</text>
  <rect x="610" y="460" width="100" height="8" rx="4" fill="#eef2f9"/>
  <rect x="610" y="460" width="91" height="8" rx="4" fill="#10b981"/>
  <text x="610" y="484" class="font" font-size="12" font-weight="700" fill="#10b981">91.5%</text>
  <rect x="750" y="458" width="84" height="24" rx="6" fill="#ecfdf5"/>
  <text x="758" y="474" class="font" font-size="11" font-weight="700" fill="#065f46">PASS (≥90%)</text>
  <rect x="880" y="458" width="84" height="24" rx="6" fill="#f5f3ff"/>
  <text x="892" y="474" class="font" font-size="11" font-weight="700" fill="#582be8">Passed (88%)</text>

  <!-- Row 3 -->
  <line x1="324" y1="504" x2="1020" y2="504" stroke="#e8ecf4"/>
  <text x="340" y="534" class="font" font-size="14" font-weight="700" fill="#0f172a">Module 03: GDMT Initiation &amp; Co-Therapy</text>
  <text x="340" y="552" class="font" font-size="12" font-weight="500" fill="#64748b">SGLT2i + ARNI Quadruple Therapy · 4 Lectures</text>
  <rect x="610" y="528" width="100" height="8" rx="4" fill="#eef2f9"/>
  <rect x="610" y="528" width="74" height="8" rx="4" fill="#582be8"/>
  <text x="610" y="552" class="font" font-size="12" font-weight="700" fill="#582be8">74.0%</text>
  <rect x="750" y="526" width="98" height="24" rx="6" fill="#fff1f3"/>
  <text x="758" y="542" class="font" font-size="11" font-weight="700" fill="#ff4760">16% TO UNLOCK</text>
  <rect x="880" y="526" width="84" height="24" rx="6" fill="#f8f9fd" stroke="#e8ecf4"/>
  <text x="894" y="542" class="font" font-size="11" font-weight="700" fill="#64748b">Locked 🔒</text>

  <!-- Row 4 -->
  <line x1="324" y1="572" x2="1020" y2="572" stroke="#e8ecf4"/>
  <text x="340" y="602" class="font" font-size="14" font-weight="700" fill="#0f172a">Module 04: Advanced Cardiorenal Hemodynamics</text>
  <text x="340" y="620" class="font" font-size="12" font-weight="500" fill="#64748b">Venous congestion and nephron blockade · 3 Lectures</text>
  <rect x="610" y="596" width="100" height="8" rx="4" fill="#eef2f9"/>
  <rect x="610" y="596" width="94" height="8" rx="4" fill="#10b981"/>
  <text x="610" y="620" class="font" font-size="12" font-weight="700" fill="#10b981">94.2%</text>
  <rect x="750" y="594" width="84" height="24" rx="6" fill="#ecfdf5"/>
  <text x="758" y="610" class="font" font-size="11" font-weight="700" fill="#065f46">PASS (≥90%)</text>
  <rect x="880" y="594" width="84" height="24" rx="6" fill="#f5f3ff"/>
  <text x="892" y="610" class="font" font-size="11" font-weight="700" fill="#582be8">Passed (95%)</text>

  <!-- Rule Engine Footer Note -->
  <rect x="324" y="670" width="696" height="50" rx="10" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1"/>
  <text x="340" y="700" class="font" font-size="12" font-weight="600" fill="#582be8">⚖ STAND-HF Rule: RULES.isQuizUnlocked() requires watchPercent >= 90.0% for every enrolled lecture.</text>

  <!-- Right Side: Circular Gauge & CME Certificate Status -->
  <rect x="1076" y="230" width="324" height="630" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
  <text x="1104" y="268" class="font" font-size="18" font-weight="800" fill="#0f172a">Compliance Gauge</text>

  <!-- Circular Ring Progress Chart -->
  <g transform="translate(1238, 380)">
    <!-- Background Circle -->
    <circle cx="0" cy="0" r="80" stroke="#f1f3f9" stroke-width="16" fill="none"/>
    <!-- Progress Circle (92.4%) -->
    <circle cx="0" cy="0" r="80" stroke="#582be8" stroke-width="16" fill="none" stroke-dasharray="502" stroke-dashoffset="38" stroke-linecap="round"/>
    <text x="0" y="8" class="font" font-size="32" font-weight="800" fill="#0f172a" text-anchor="middle">92.4%</text>
    <text x="0" y="28" class="font" font-size="11" font-weight="700" fill="#10b981" text-anchor="middle">OVER THRESHOLD</text>
  </g>

  <!-- Breakdown List -->
  <rect x="1104" y="500" width="268" height="60" rx="12" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <circle cx="1124" cy="530" r="6" fill="#10b981"/>
  <text x="1140" y="526" class="font" font-size="13" font-weight="700" fill="#0f172a">Completed Protocols</text>
  <text x="1140" y="544" class="font" font-size="12" font-weight="500" fill="#64748b">3 Modules (12.0 CME)</text>

  <rect x="1104" y="572" width="268" height="60" rx="12" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <circle cx="1124" cy="602" r="6" fill="#582be8"/>
  <text x="1140" y="598" class="font" font-size="13" font-weight="700" fill="#0f172a">In-Progress Protocol</text>
  <text x="1140" y="616" class="font" font-size="12" font-weight="500" fill="#64748b">1 Module (74% Watched)</text>

  <rect x="1104" y="644" width="268" height="60" rx="12" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
  <circle cx="1124" cy="674" r="6" fill="#ff4760"/>
  <text x="1140" y="670" class="font" font-size="13" font-weight="700" fill="#0f172a">Target Certificate</text>
  <text x="1140" y="688" class="font" font-size="12" font-weight="500" fill="#64748b">STAND-HF Cert #SHF-8492</text>

  <rect x="1104" y="730" width="268" height="48" rx="12" fill="#582be8"/>
  <text x="1238" y="759" class="font" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Generate CME Report ↓</text>
</svg>'''

# 5. Generate SVG for 04_courses
svg_courses = '''<svg width="1440" height="900" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1440" height="900" fill="#f8f9fd"/>

  <!-- Left Sidebar (Matching) -->
  <rect x="0" y="0" width="260" height="900" fill="#ffffff"/>
  <line x1="260" y1="0" x2="260" y2="900" stroke="#e8ecf4" stroke-width="1"/>

  <rect x="28" y="24" width="36" height="36" rx="10" fill="#582be8"/>
  <path d="M38 42 L44 32 L48 44 L54 42" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="76" y="48" class="font" font-size="18" font-weight="700" fill="#0f172a">STAND-HF</text>

  <rect x="16" y="96" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="123" class="font" font-size="14" font-weight="600" fill="#64748b">Home Hub</text>

  <!-- Active: Courses -->
  <rect x="16" y="148" width="228" height="44" rx="12" fill="#f5f3ff"/>
  <circle cx="38" cy="170" r="6" fill="#582be8"/>
  <text x="56" y="175" class="font" font-size="14" font-weight="700" fill="#582be8">Courses &amp; Protocols</text>

  <rect x="16" y="200" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="227" class="font" font-size="14" font-weight="600" fill="#64748b">CME Dashboard</text>

  <rect x="16" y="252" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="279" class="font" font-size="14" font-weight="600" fill="#64748b">Certificates</text>

  <rect x="16" y="304" width="228" height="44" rx="12" fill="transparent"/>
  <text x="56" y="331" class="font" font-size="14" font-weight="600" fill="#64748b">Trial Guidelines</text>

  <!-- Top App Header -->
  <rect x="260" y="0" width="1180" height="72" fill="#ffffff"/>
  <line x1="260" y1="72" x2="1440" y2="72" stroke="#e8ecf4" stroke-width="1"/>
  <text x="292" y="43" class="font" font-size="20" font-weight="800" fill="#0f172a">Course &amp; Protocol Catalog</text>

  <!-- Filter & Tab Strip (EduMate Standard) -->
  <g transform="translate(292, 96)">
    <!-- EduMate Category Tabs -->
    <rect x="0" y="0" width="128" height="38" rx="10" fill="#582be8"/>
    <text x="64" y="24" class="font" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">All Protocols (8)</text>

    <rect x="138" y="0" width="120" height="38" rx="10" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="198" y="24" class="font" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">In Progress (3)</text>

    <rect x="268" y="0" width="120" height="38" rx="10" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="328" y="24" class="font" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">Completed (4)</text>

    <rect x="398" y="0" width="130" height="38" rx="10" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="463" y="24" class="font" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">CME Certified (1)</text>

    <!-- Search Input -->
    <rect x="790" y="0" width="318" height="38" rx="10" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>
    <text x="810" y="24" class="font" font-size="13" font-weight="500" fill="#64748b">Filter by faculty, track or title...</text>
  </g>

  <!-- Main Tabular Container (EduMate Table Architecture) -->
  <rect x="292" y="156" width="1108" height="700" rx="20" fill="#ffffff" stroke="#e8ecf4" stroke-width="1.5"/>

  <!-- Table Column Header -->
  <rect x="292" y="156" width="1108" height="52" rx="20" fill="#f8f9fd"/>
  <line x1="292" y1="208" x2="1400" y2="208" stroke="#e8ecf4"/>

  <text x="324" y="188" class="font" font-size="11" font-weight="700" fill="#64748b">PROTOCOL &amp; LECTURE TITLE</text>
  <text x="730" y="188" class="font" font-size="11" font-weight="700" fill="#64748b">FACULTY &amp; TRACK</text>
  <text x="910" y="188" class="font" font-size="11" font-weight="700" fill="#64748b">WATCH PROGRESS</text>
  <text x="1100" y="188" class="font" font-size="11" font-weight="700" fill="#64748b">STATUS</text>
  <text x="1270" y="188" class="font" font-size="11" font-weight="700" fill="#64748b">ACTION</text>

  <!-- Table Row 1 -->
  <g transform="translate(0, 208)">
    <rect x="292" y="0" width="1108" height="90" fill="#ffffff"/>
    <line x1="292" y1="90" x2="1400" y2="90" stroke="#e8ecf4"/>

    <!-- Course Info -->
    <rect x="324" y="20" width="50" height="50" rx="12" fill="#f5f3ff"/>
    <text x="349" y="50" class="font" font-size="18" font-weight="800" fill="#582be8" text-anchor="middle">01</text>
    <text x="390" y="42" class="font" font-size="15" font-weight="700" fill="#0f172a">Acute Heart Failure Decompensation: Early Biomarkers</text>
    <text x="390" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Code: SHF-MED-101 · 4 Lectures · 1 hr 45 min duration</text>

    <!-- Faculty -->
    <text x="730" y="42" class="font" font-size="13" font-weight="700" fill="#0f172a">Dr. Sarah Khan, FACC</text>
    <text x="730" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Clinical Cardiology · 3.5 CME</text>

    <!-- Progress -->
    <rect x="910" y="32" width="130" height="8" rx="4" fill="#eef2f9"/>
    <rect x="910" y="32" width="125" height="8" rx="4" fill="#10b981"/>
    <text x="910" y="58" class="font" font-size="12" font-weight="700" fill="#10b981">96% Watched (Passed)</text>

    <!-- Status -->
    <rect x="1100" y="30" width="94" height="26" rx="8" fill="#ecfdf5"/>
    <text x="1112" y="47" class="font" font-size="11" font-weight="700" fill="#065f46">CERTIFIED ✓</text>

    <!-- Action Button -->
    <rect x="1270" y="26" width="100" height="36" rx="8" fill="#f8f9fd" stroke="#e8ecf4" stroke-width="1"/>
    <text x="1320" y="49" class="font" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">Review</text>
  </g>

  <!-- Table Row 2 -->
  <g transform="translate(0, 298)">
    <rect x="292" y="0" width="1108" height="90" fill="#ffffff"/>
    <line x1="292" y1="90" x2="1400" y2="90" stroke="#e8ecf4"/>

    <!-- Course Info -->
    <rect x="324" y="20" width="50" height="50" rx="12" fill="#fff1f3"/>
    <text x="349" y="50" class="font" font-size="18" font-weight="800" fill="#ff4760" text-anchor="middle">02</text>
    <text x="390" y="42" class="font" font-size="15" font-weight="700" fill="#0f172a">STAND-HF IV Diuretic Protocols &amp; Natriuresis Guided Care</text>
    <text x="390" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Code: SHF-MED-102 · 5 Lectures · 2 hr 10 min duration</text>

    <!-- Faculty -->
    <text x="730" y="42" class="font" font-size="13" font-weight="700" fill="#0f172a">Dr. A. Siddiqui, FCPS</text>
    <text x="730" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Heart Failure Unit · 4.0 CME</text>

    <!-- Progress -->
    <rect x="910" y="32" width="130" height="8" rx="4" fill="#eef2f9"/>
    <rect x="910" y="32" width="96" height="8" rx="4" fill="#582be8"/>
    <text x="910" y="58" class="font" font-size="12" font-weight="700" fill="#582be8">74% Watched</text>

    <!-- Status -->
    <rect x="1100" y="30" width="94" height="26" rx="8" fill="#f5f3ff"/>
    <text x="1112" y="47" class="font" font-size="11" font-weight="700" fill="#582be8">IN PROGRESS</text>

    <!-- Action Button (Primary) -->
    <rect x="1270" y="26" width="100" height="36" rx="8" fill="#582be8"/>
    <text x="1320" y="49" class="font" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">Continue ▶</text>
  </g>

  <!-- Table Row 3 -->
  <g transform="translate(0, 388)">
    <rect x="292" y="0" width="1108" height="90" fill="#ffffff"/>
    <line x1="292" y1="90" x2="1400" y2="90" stroke="#e8ecf4"/>

    <!-- Course Info -->
    <rect x="324" y="20" width="50" height="50" rx="12" fill="#ecfdf5"/>
    <text x="349" y="50" class="font" font-size="18" font-weight="800" fill="#10b981" text-anchor="middle">03</text>
    <text x="390" y="42" class="font" font-size="15" font-weight="700" fill="#0f172a">Quadruple Therapy Sequencing: SGLT2i, ARNI, MRA, Beta-Blockers</text>
    <text x="390" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Code: SHF-MED-103 · 6 Lectures · 2 hr 40 min duration</text>

    <!-- Faculty -->
    <text x="730" y="42" class="font" font-size="13" font-weight="700" fill="#0f172a">Prof. M. Hashim, FRCP</text>
    <text x="730" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Academic Director · 4.5 CME</text>

    <!-- Progress -->
    <rect x="910" y="32" width="130" height="8" rx="4" fill="#eef2f9"/>
    <rect x="910" y="32" width="120" height="8" rx="4" fill="#10b981"/>
    <text x="910" y="58" class="font" font-size="12" font-weight="700" fill="#10b981">92% Watched (Passed)</text>

    <!-- Status -->
    <rect x="1100" y="30" width="94" height="26" rx="8" fill="#fef3c7"/>
    <text x="1108" y="47" class="font" font-size="11" font-weight="700" fill="#b45309">QUIZ READY</text>

    <!-- Action Button -->
    <rect x="1270" y="26" width="100" height="36" rx="8" fill="#582be8"/>
    <text x="1320" y="49" class="font" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">Take Quiz</text>
  </g>

  <!-- Table Row 4 -->
  <g transform="translate(0, 478)">
    <rect x="292" y="0" width="1108" height="90" fill="#ffffff"/>
    <line x1="292" y1="90" x2="1400" y2="90" stroke="#e8ecf4"/>

    <!-- Course Info -->
    <rect x="324" y="20" width="50" height="50" rx="12" fill="#f8f9fd" stroke="#e8ecf4"/>
    <text x="349" y="50" class="font" font-size="18" font-weight="800" fill="#64748b" text-anchor="middle">04</text>
    <text x="390" y="42" class="font" font-size="15" font-weight="700" fill="#0f172a">Cardiorenal Hemodynamics &amp; Renal Replacement Modalities</text>
    <text x="390" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Code: SHF-MED-104 · 3 Lectures · 1 hr 15 min duration</text>

    <!-- Faculty -->
    <text x="730" y="42" class="font" font-size="13" font-weight="700" fill="#0f172a">Dr. Tariq Masood, MD</text>
    <text x="730" y="62" class="font" font-size="12" font-weight="500" fill="#64748b">Nephrology Consult · 2.5 CME</text>

    <!-- Progress -->
    <rect x="910" y="32" width="130" height="8" rx="4" fill="#eef2f9"/>
    <text x="910" y="58" class="font" font-size="12" font-weight="600" fill="#64748b">0% Watched</text>

    <!-- Status -->
    <rect x="1100" y="30" width="94" height="26" rx="8" fill="#f8f9fd" stroke="#e8ecf4"/>
    <text x="1114" y="47" class="font" font-size="11" font-weight="700" fill="#64748b">ENROLLED</text>

    <!-- Action Button -->
    <rect x="1270" y="26" width="100" height="36" rx="8" fill="#ffffff" stroke="#582be8" stroke-width="1.5"/>
    <text x="1320" y="49" class="font" font-size="12" font-weight="700" fill="#582be8" text-anchor="middle">Start</text>
  </g>

  <!-- Table Pagination Footer (EduMate Standard) -->
  <g transform="translate(0, 580)">
    <text x="324" y="68" class="font" font-size="13" font-weight="500" fill="#64748b">Showing 1 to 4 of 8 protocols</text>
    <rect x="1230" y="46" width="36" height="36" rx="8" fill="#582be8"/>
    <text x="1248" y="69" class="font" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">1</text>
    <rect x="1274" y="46" width="36" height="36" rx="8" fill="#ffffff" stroke="#e8ecf4"/>
    <text x="1292" y="69" class="font" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">2</text>
    <rect x="1318" y="46" width="52" height="36" rx="8" fill="#ffffff" stroke="#e8ecf4"/>
    <text x="1344" y="69" class="font" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">Next ›</text>
  </g>
</svg>'''

files = [
    ("01_login_screen.svg", svg_login, "01_login_screen.png"),
    ("02_home_screen.svg", svg_home, "02_home_screen.png"),
    ("03_dashboard_screen.svg", svg_dashboard, "03_dashboard_screen.png"),
    ("04_courses_screen.svg", svg_courses, "04_courses_screen.png"),
]

for svg_name, svg_content, png_name in files:
    svg_path = os.path.join(OUTPUT_DIR, svg_name)
    png_path = os.path.join(OUTPUT_DIR, png_name)
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    # Render PNG using rsvg-convert
    cmd = ["rsvg-convert", "-w", "1440", "-h", "900", svg_path, "-o", png_path]
    subprocess.run(cmd, check=True)
    print(f"Generated: {png_name} (1440x900)")

print("All matched UI images generated successfully.")
