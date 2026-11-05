// Contact form validation and browser-local storage
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const key = 'nova-contact-submissions';
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const consent = document.getElementById('consent');
  const counter = document.getElementById('charCount');
  const setError = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  message.addEventListener('input', () => { if (counter) counter.textContent = `${message.value.length} / 2000`; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const values = {name:name.value.trim(), email:email.value.trim(), message:message.value.trim()};
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email);
    [['name',values.name.length >= 2,'Enter at least 2 characters.'],
     ['email',emailOK,'Enter a valid email address.'],
     ['message',values.message.length >= 10,'Enter at least 10 characters.']].forEach(([field,ok,error]) => {
       const input = document.getElementById(field);
       input.classList.toggle('invalid',!ok);
       setError(field+'Error',ok?'':error);
       if (!ok) valid = false;
     });
    setError('consentError',consent.checked?'':'Please confirm your details.');
    if (!consent.checked) valid = false;
    if (!valid) return;
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const records = Array.isArray(existing) ? existing : [];
      records.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2),...values,createdAt:new Date().toISOString()});
      localStorage.setItem(key,JSON.stringify(records));
      form.reset();
      if (counter) counter.textContent = '0 / 2000';
      showToast('Message saved successfully!');
    } catch { showToast('Could not save. Check browser storage settings.'); }
  });
  [name,email,message].forEach(input => input.addEventListener('input',()=>input.classList.remove('invalid')));
})();
