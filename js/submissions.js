// Submissions dashboard: search, delete, clear and CSV export
(() => {
  const key='nova-contact-submissions';
  const list=document.getElementById('submissionList');
  const count=document.getElementById('submissionCount');
  const search=document.getElementById('searchSubmissions');
  const exportBtn=document.getElementById('exportBtn');
  const clearBtn=document.getElementById('clearBtn');
  if (!list) return;
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch{return []}};
  let records=read();
  const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  function render(){
    count.textContent=records.length;
    const q=search.value.trim().toLowerCase();
    const filtered=records.filter(r=>[r.name,r.email,r.message].some(v=>String(v||'').toLowerCase().includes(q)));
    list.replaceChildren();
    if(!filtered.length){
      const empty=node('div','empty');
      empty.append(node('h3','',records.length?'No matching submissions':'No submissions yet'));
      empty.append(node('p','muted',records.length?'Try another search term.':'Messages sent through the contact form will appear here.'));
      list.append(empty);return;
    }
    filtered.forEach(r=>{
      const card=node('article','submission');
      const body=node('div');
      body.append(node('h3','',r.name||'Unnamed'));
      body.append(node('small','',r.email||'No email'));
      body.append(node('p','',r.message||''));
      const d=new Date(r.createdAt);
      body.append(node('small','',Number.isNaN(d.getTime())?'Date unavailable':d.toLocaleString()));
      const del=node('button','btn danger','Delete');
      del.type='button';
      del.addEventListener('click',()=>{
        if(!confirm('Delete this submission?'))return;
        records=records.filter(x=>x.id!==r.id);
        localStorage.setItem(key,JSON.stringify(records));render();showToast('Submission deleted.');
      });
      card.append(body,del);list.append(card);
    });
  }
  search.addEventListener('input',render);
  clearBtn.addEventListener('click',()=>{
    if(!records.length){showToast('There are no submissions.');return;}
    if(!confirm('Delete all saved submissions? This cannot be undone.'))return;
    records=[];localStorage.setItem(key,'[]');render();showToast('All submissions cleared.');
  });
  exportBtn.addEventListener('click',()=>{
    if(!records.length){showToast('Nothing to export.');return;}
    const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const rows=[['Name','Email','Message','Submitted at'],...records.map(r=>[r.name,r.email,r.message,r.createdAt])];
    const csv='\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='nova-submissions.csv';a.click();URL.revokeObjectURL(url);
  });
  render();
})();
