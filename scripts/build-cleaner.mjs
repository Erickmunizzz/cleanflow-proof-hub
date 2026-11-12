import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const url=process.env.VITE_SUPABASE_URL||'https://eymkowczlmbrfxlxcwdm.supabase.co';
const key=process.env.VITE_SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_MQz1s2hIcpM-w83-akFCPA_TJDDgYjG';
if(!url.startsWith('https://')||!key.startsWith('sb_publishable_'))throw Error('Expected HTTPS Supabase URL and public publishable key');
execFileSync('npx',['--yes','esbuild@0.25.12','cleaner/src/app.js','--bundle','--loader:.png=dataurl','--define:CLEANER_SUPABASE_URL='+JSON.stringify(url),'--define:CLEANER_SUPABASE_KEY='+JSON.stringify(key),'--minify','--format=iife','--outfile=cleaner/bundle.js'],{stdio:'inherit'});
const css=readFileSync('cleaner/styles.css','utf8'),js=readFileSync('cleaner/bundle.js','utf8').replaceAll('</script','<\\/script');
const html=`<!doctype html><html lang="en-GB" translate="no"><head><meta charset="UTF-8"><meta name="google" content="notranslate"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>CleanMa</title><link rel="icon" href="/cleanma-logo.png" type="image/png"><style>${css}</style><script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};window.va('beforeSend',function(e){e.url=location.origin+'/';return e});</script><script defer src="/_vercel/insights/script.js"></script><script defer src="/_vercel/speed-insights/script.js"></script></head><body><div id="root"></div><script>${js}</script></body></html>`;
writeFileSync('public/cleaner.html',html);mkdirSync('cleaner/netlify',{recursive:true});writeFileSync('cleaner/netlify/index.html',html);
