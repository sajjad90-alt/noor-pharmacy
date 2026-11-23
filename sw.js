const V='noor-v3';
const FILES=['./','index.html','manifest.json','bg.jpg','ic-call.png','ic-cart.png','ic-cosmetics.png','ic-delivery.png','ic-meds.png','ic-search.png','ic-wa.png','ic-home.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put('index.html',c))}return res}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res.ok)c.put(u.pathname,res.clone());return res}).catch(()=>null);
    return hit||net.then(res=>res||new Response('',{status:504}));
  }));
});
