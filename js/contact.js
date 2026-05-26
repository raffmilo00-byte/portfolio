(function () {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  if (!form || !statusEl) return;

  const config = window.EMAILJS_CONFIG || {};
  const isEmailJsReady =
    config.PUBLIC_KEY && config.SERVICE_ID && config.TEMPLATE_ID;

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#f87171" : "";
  }

  function buildMailto() {
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const oggetto = form.oggetto.value.trim();
    const messaggio = form.messaggio.value.trim();
    const subject = encodeURIComponent(oggetto || "Contatto dal portfolio");
    const body = encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\n${messaggio}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }

  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    if (!isEmailJsReady) {
      setStatus(
        "EmailJS non configurato: si apre il client email. Completa js/emailjs-config.js per invio diretto dal sito.",
        false
      );
      window.location.href = buildMailto();
      return;
    }

    if (typeof emailjs === "undefined") {
      setStatus("Errore di caricamento EmailJS. Ricarica la pagina.", true);
      return;
    }

    setStatus("Invio in corso…", false);
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    emailjs
      .init({ publicKey: config.PUBLIC_KEY })
      .then(function () {
        return emailjs.sendForm(
          config.SERVICE_ID,
          config.TEMPLATE_ID,
          form
        );
      })
      .then(function () {
        setStatus("Messaggio inviato. Grazie!", false);
        form.reset();
      })
      .catch(function () {
        setStatus(
          "Invio non riuscito. Riprova più tardi o usa il link email nel messaggio di errore.",
          true
        );
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
