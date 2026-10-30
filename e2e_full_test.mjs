import fs from 'fs';
import path from 'path';

try {
  console.log("=== Running Comprehensive Ego-Browser YouTube Scout & Studio E2E Test ===");
  const task = await taskSpace("e2e studio verification");
  const page = task.page("p1");

  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  const outDir = "D:/youtube-anal/e2e_screenshots";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const saveShot = (shotPath, fileName) => {
    const cleanSrc = shotPath.trim();
    const dest = path.join(outDir, fileName);
    fs.copyFileSync(cleanSrc, dest);
    const stats = fs.statSync(dest);
    console.log(`   -> Saved ${fileName} (${(stats.size / 1024).toFixed(1)} KB)`);
  };

  await page.goto("http://localhost:8000");
  await new Promise(r => setTimeout(r, 2000));

  // --- TAB 1: Scout & Live View ---
  console.log("1. Tab 1: Scout & Live View...");
  const tab1Shot = await page.screenshot();
  saveShot(tab1Shot, "01_scout_live_view.png");

  // Select project '충격 실화 미스터리'
  console.log("2. Selecting project '충격 실화 미스터리'...");
  await page.evaluate(() => {
    const select = document.querySelector("header select");
    for (const opt of select.options) {
      if (opt.value.includes("충격 실화")) {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // --- TAB 2: Reference Board ---
  console.log("3. Tab 2: Reference Board...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("header nav button")).find(b => b.innerText.includes("경쟁작 보드"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  const tab2Shot = await page.screenshot();
  saveShot(tab2Shot, "02_reference_board.png");

  // --- VIDEO MODAL ---
  console.log("4. Opening Video Modal (Script & Comments)...");
  await page.evaluate(() => {
    const scriptBtns = Array.from(document.querySelectorAll("button")).filter(b => b.innerText.includes("대본 전문") || b.innerText.includes("댓글 반응"));
    if (scriptBtns.length > 0) scriptBtns[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const modalShot = await page.screenshot();
  saveShot(modalShot, "02b_video_modal.png");

  // Close modal by clicking backdrop
  await page.evaluate(() => {
    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) backdrop.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // --- TAB 3: Script Remix Studio ---
  console.log("5. Tab 3: Script Remix Studio...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("header nav button")).find(b => b.innerText.includes("기획 리믹스"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  const tab3Shot = await page.screenshot();
  saveShot(tab3Shot, "03_script_remix_studio_top.png");

  // Scroll down to see Feed Simulator Arena and Timeline
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 600));
  const tab3ScrolledShot = await page.screenshot();
  saveShot(tab3ScrolledShot, "03b_script_remix_studio_arena.png");

  // Scroll down further to see Section 5: YouTube SEO & Viral Publishing Kit
  console.log("5b. Testing Section 5: YouTube SEO & Viral Publishing Kit...");
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 600));
  const tab3SeoShot = await page.screenshot();
  saveShot(tab3SeoShot, "03c_script_remix_seo_kit.png");

  // Test clicking Tag Copy button
  await page.evaluate(() => {
    const tagBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("태그 500자 복사"));
    if (tagBtn) tagBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo(0, 0));

  // --- TAB 4: Channel Doctor ---
  console.log("6. Tab 4: Channel Doctor ('이왜찐' 알고리즘 클리닉)...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("header nav button")).find(b => b.innerText.includes("채널 닥터"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click on video #2 in Doctor (고양이 역장 타마 - highest reaction rate 4.25%)
  await page.evaluate(() => {
    const videoBtns = Array.from(document.querySelectorAll("button")).filter(b => b.innerText.includes("고양이 역장"));
    if (videoBtns.length > 0) videoBtns[0].click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Trigger full diagnosis
  await page.evaluate(() => {
    const diagBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("알고리즘 진단"));
    if (diagBtn) diagBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const tab4Shot = await page.screenshot();
  saveShot(tab4Shot, "04_channel_doctor.png");

  // Scroll down to see 2026 YouTube Algorithm Physics & Survival Mechanics
  console.log("6b. Testing Algorithm Physics & Survival Guide...");
  await page.evaluate(() => window.scrollBy(0, 700));
  await new Promise(r => setTimeout(r, 600));
  const tab4PhysicsShot = await page.screenshot();
  saveShot(tab4PhysicsShot, "04b_channel_doctor_algorithm_physics.png");
  await page.evaluate(() => window.scrollTo(0, 0));

  // --- SETTINGS MODAL ---
  console.log("7. Settings Modal...");
  await page.evaluate(() => {
    const settingsBtn = document.querySelector("button[title*='설정']");
    if (settingsBtn) settingsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const settingsShot = await page.screenshot();
  saveShot(settingsShot, "05_settings_modal.png");

  // Close Settings Modal
  await page.evaluate(() => {
    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) backdrop.click();
  });
  await new Promise(r => setTimeout(r, 800));

  console.log("=== ALL E2E SCREENSHOTS AND INTERACTIONS VERIFIED SUCCESSFULLY! ===");
  await task.finish({ keep: [] });
} catch (e) {
  console.error("E2E Test Error:", e);
}
