document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const fullname = document.getElementById('fullname');
  const age = document.getElementById('age');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const fileInput = document.getElementById('fileInput');
  const message = document.getElementById('message');
  const messageCounter = document.getElementById('messageCounter');
  const filePreview = document.getElementById('filePreview');
  const formMessage = document.getElementById('formMessage');

  const allowedExt = ['pdf','jpg','jpeg'];


  function setError(el, msg) {
    const container = el.closest('label') || el.parentElement;
    const error = container && container.querySelector('.error-message');
    if (error) error.textContent = msg;
  }

  function clearError(el) {
    const container = el.closest('label') || el.parentElement;
    const error = container && container.querySelector('.error-message');
    if (error) error.textContent = '';
  }

  function setStatus(text, type='success'){
    formMessage.textContent = text;
    formMessage.classList.remove('success','error');
    formMessage.classList.add(type);
  }

  function clearStatus(){ formMessage.textContent = ''; formMessage.classList.remove('success','error'); }

  // Clear a field's error as user types/corrects
  [fullname, age, email, password, confirmPassword, fileInput, message].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => { clearError(el); clearStatus(); });
  });

  // Character counter for the message textarea
  const MAX_MESSAGE = 500;
  function updateMessageCounter(){
    if (!message || !messageCounter) return;
    const len = message.value.length;
    messageCounter.textContent = `${len} / ${MAX_MESSAGE}`;
    if (len > MAX_MESSAGE) {
      messageCounter.classList.add('warn');
      setError(message, `Le message ne doit pas dépasser ${MAX_MESSAGE} caractères`);
    } else if (len > (MAX_MESSAGE - 50)) {
      messageCounter.classList.add('warn');
      clearError(message);
    } else {
      messageCounter.classList.remove('warn');
      clearError(message);
    }
  }

  if (message){
    // initialize counter
    updateMessageCounter();
    message.addEventListener('input', () => {
      if (message.value.length > MAX_MESSAGE) message.value = message.value.slice(0, MAX_MESSAGE);
      updateMessageCounter();
    });
  }

  // File preview + validation
  fileInput && fileInput.addEventListener('change', () => {
    filePreview.innerHTML = '';
    clearError(fileInput);
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    const name = f.name || '';
    const ext = name.split('.').pop().toLowerCase();
    if (!allowedExt.includes(ext)) {
      setError(fileInput, 'Type de fichier non autorisé. Seuls .pdf, .jpg, .jpeg sont acceptés');
      fileInput.value = '';
      return;
    }

  
    if (f.size > 5 * 1024 * 1024) {
      setError(fileInput, 'Fichier trop volumineux (max 5MB).');
      fileInput.value = '';
      return;
    }

   
    if (ext === 'jpg' || ext === 'jpeg'){
      const img = document.createElement('img');
      img.alt = name;
      filePreview.appendChild(img);
      const reader = new FileReader();
      reader.onload = e => { img.src = e.target.result; };
      reader.readAsDataURL(f);
      const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = name;
      filePreview.appendChild(meta);
    } else if (ext === 'pdf'){
      const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `PDF — ${name}`;
      filePreview.appendChild(meta);
    }
  });

  
  function isEmail(v){
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v);
  }

  form && form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    clearStatus();
    let valid = true;

    const fName = fullname.value.trim();
    if (fName.length < 2) { setError(fullname, 'Nom trop court'); valid = false; }

    const a = parseInt(age.value, 10);
    if (!a || a < 18) { setError(age, 'Vous devez être âgé·e de 18 ans ou plus.'); valid = false; }

    const mail = email.value.trim();
    if (!isEmail(mail)) { setError(email, 'Veuillez entrer une adresse email valide'); valid = false; }

    const pass = password.value;
    if (pass.length < 6) { setError(password, 'Le mot de passe doit contenir au moins 6 caractères'); valid = false; }

    const confirm = confirmPassword.value;
    if (confirm !== pass) { setError(confirmPassword, 'Les mots de passe ne correspondent pas'); valid = false; }

    const f = fileInput.files && fileInput.files[0];
    if (f){
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (!allowedExt.includes(ext)) { setError(fileInput, 'Format non autorisé'); valid = false; }
      if (f.size > 5 * 1024 * 1024){ setError(fileInput, 'Fichier trop volumineux (max 5MB)'); valid = false; }
    }

    if (!valid){ setStatus('Le formulaire contient des erreurs. Corrigez les champs indiqués.', 'error'); return; }

  
    setStatus('Merci — votre message a été envoyé (simulation). Nous vous répondrons bientôt.', 'success');

    form.reset();
    filePreview.innerHTML = '';
    setTimeout(() => { clearStatus(); }, 5500);
  });
});