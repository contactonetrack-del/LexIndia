const puppeteer = require('puppeteer');
(async()=>{
  try {
    const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('http://localhost:3001');
    await page.setViewport({width:1200,height:800});
    await page.screenshot({path:'C:/temp/lex.png',fullPage:true});
    const descs = await page.$$eval('section:nth-of-type(3) p', els =>
      els.map(e => ({ text: e.innerText, width: e.clientWidth, parentWidth: e.parentElement.clientWidth }))
    );
    console.log(descs);

    const computed = await page.evaluate(() => {
      const root = window.getComputedStyle(document.documentElement);
      const rootFont = root.fontSize;
      const spacingXs = root.getPropertyValue('--spacing-xs');
      const ps = Array.from(document.querySelectorAll('section:nth-of-type(3) p'));
      const details = ps.map(p => {
        const s = window.getComputedStyle(p);
        const local = p.style.getPropertyValue('--spacing-xs');
        return {
          text: p.innerText,
          width: p.clientWidth,
          localSpacingXs: local,
          display: s.display,
          fontSize: s.fontSize,
          whiteSpace: s.whiteSpace,
          overflowWrap: s.overflowWrap,
          wordBreak: s.wordBreak,
          maxWidth: s.maxWidth,
          minWidth: s.minWidth,
          flex: s.flex,
          alignSelf: s.alignSelf,
          transform: s.transform,
          zoom: s.zoom
        };
      });
      return { rootFont, spacingXs, details };
    });
    console.log('computed', computed);

    const rules = await page.evaluate(() => {
      const matches = [];
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule.cssText && rule.cssText.includes('max-width')) {
              matches.push(rule.cssText);
            }
          }
        } catch(e) {
          // cross-origin
        }
      }
      return matches.slice(0,20);
    });
    console.log('max-width rules', rules);

    const inlineInfo = await page.evaluate(() => {
      const p = document.querySelector('section:nth-of-type(3) p');
      return { inlineMaxWidth: p.style.maxWidth, className: p.className };
    });
    console.log('inline info', inlineInfo);
    await browser.close();
  } catch(e){console.error(e);process.exit(1);}
})();