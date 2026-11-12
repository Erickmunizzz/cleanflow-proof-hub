export async function preparePhoto(file) {
 if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw Error('Choose a JPG, PNG or WebP photo. Convert HEIC photos to JPG first.');
 if(file.size>25*1024*1024) throw Error('Choose a photo smaller than 25 MB.');
 const url=URL.createObjectURL(file);
 try {
  const image=new Image(); image.src=url; await image.decode();
  const scale=Math.min(1,2048/Math.max(image.width,image.height));
  const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.85));
  if(!blob)throw Error('Unable to process photo. Please try another image.');return blob;
 } finally {URL.revokeObjectURL(url);}
}
export async function readTag(signal) {
 if(!window.isSecureContext||!('NDEFReader' in window))throw Error('NFC is not supported in this browser. Use GPS check-in instead.');
 const reader=new window.NDEFReader();await reader.scan({signal});
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('No NFC tag detected. Try again or use GPS.')),20000);
  const done=(fn,value)=>{clearTimeout(timer);fn(value)};
  signal.addEventListener('abort',()=>done(reject,Error('NFC scan cancelled.')),{once:true});
  reader.onreadingerror=()=>done(reject,Error('Unable to read tag. Hold your phone closer.'));
  reader.onreading=e=>{const record=e.message.records.find(r=>r.recordType==='text'||r.recordType==='url');if(record)done(resolve,new TextDecoder(record.encoding||'utf-8').decode(record.data).trim());else done(reject,Error('This tag has no supported site code.'));};
 });
}
export async function readQr(signal){
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.BarcodeDetector)throw Error('QR scanning is unavailable in this browser. Use NFC or GPS check-in.');
 const formats=await window.BarcodeDetector.getSupportedFormats();if(!formats.includes('qr_code'))throw Error('QR scanning is unavailable. Use NFC or GPS check-in.');
 const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});
 const video=document.createElement('video');video.muted=true;video.playsInline=true;video.srcObject=stream;video.style.cssText='position:fixed;inset:20% 5%;width:90%;height:50%;object-fit:cover;z-index:150;background:black;border-radius:20px';document.body.append(video);
 try{await video.play();const detector=new window.BarcodeDetector({formats:['qr_code']}),until=Date.now()+20000;while(Date.now()<until){if(signal.aborted)throw Error('Scan cancelled.');const codes=await detector.detect(video);if(codes[0]?.rawValue)return codes[0].rawValue.trim();await new Promise(r=>setTimeout(r,200));}throw Error('No QR code detected. Please try again.');}finally{stream.getTracks().forEach(t=>t.stop());video.remove();}
}
