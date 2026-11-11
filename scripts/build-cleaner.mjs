import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
execFileSync('npx',['--yes','esbuild@0.25.12','cleaner/src/app.js','--bundle','--minify','--format=iife','--outfile=cleaner/bundle.js'],{stdio:'inherit'});
const css=readFileSync('cleaner/styles.css','utf8'),js=readFileSync('cleaner/bundle.js','utf8').replaceAll('</script','<\\/script');
const html=`<!doctype html><html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>CleanMa — Cleaner</title><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
writeFileSync('public/cleaner.html',html);mkdirSync('cleaner/netlify',{recursive:true});writeFileSync('cleaner/netlify/index.html',html);
