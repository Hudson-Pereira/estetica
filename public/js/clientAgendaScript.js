(function () {
  const listEl = document.getElementById("agendaList");
  const sentinelEl = document.getElementById("agendaScrollSentinel");
  const loadingHintEl = document.getElementById("agendaLoadingHint");
  const emptyStateEl = document.getElementById("agendaEmptyState");
  const dataEl = document.getElementById("agendaData");
  const templateEl = document.getElementById("agendaCardTemplate");

  if (!listEl || !sentinelEl || !dataEl || !templateEl) return;

  let agenda = [];
  try {
    agenda = JSON.parse(dataEl.textContent || "[]");
  } catch (error) {
    agenda = [];
  }

  const CHUNK_SIZE = 12;
  let nextIndex = 0;
  let isLoading = false;

  function toPtBrDate(value) {
    if (typeof value !== "string") return "";
    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!iso) return value;
    return `${iso[3]}/${iso[2]}/${iso[1]}`;
  }

  function setNameInteractions(nameEl, tooltipEl, fullName) {
    nameEl.textContent = fullName || "-";
    tooltipEl.textContent = fullName || "-";
    nameEl.setAttribute("title", fullName || "-");

    let pointerActive = false;
    nameEl.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") {
        pointerActive = true;
        nameEl.classList.add("is-open");
      }
    });

    const closeTouch = () => {
      if (!pointerActive) return;
      pointerActive = false;
      nameEl.classList.remove("is-open");
    };

    nameEl.addEventListener("pointerup", closeTouch);
    nameEl.addEventListener("pointercancel", closeTouch);
    nameEl.addEventListener("pointerleave", closeTouch);
    nameEl.addEventListener("blur", () => nameEl.classList.remove("is-open"));
  }

  function renderChunk() {
    if (isLoading) return;
    isLoading = true;
    loadingHintEl.hidden = false;

    const end = Math.min(nextIndex + CHUNK_SIZE, agenda.length);
    const fragment = document.createDocumentFragment();

    for (let i = nextIndex; i < end; i += 1) {
      const item = agenda[i];
      const card = templateEl.content.firstElementChild.cloneNode(true);
      const nameEl = card.querySelector(".agenda-name");
      const tooltipEl = card.querySelector(".agenda-name-tooltip");
      const dateEl = card.querySelector(".agenda-date");
      const timeEl = card.querySelector(".agenda-time");

      setNameInteractions(nameEl, tooltipEl, item.nome);
      dateEl.textContent = toPtBrDate(item.data);
      timeEl.textContent = item.hora || "";

      fragment.appendChild(card);
    }

    listEl.appendChild(fragment);
    nextIndex = end;
    loadingHintEl.hidden = true;
    isLoading = false;

    if (nextIndex >= agenda.length) {
      observer.disconnect();
      sentinelEl.hidden = true;
    }
  }

  emptyStateEl.hidden = agenda.length !== 0;
  if (agenda.length === 0) {
    sentinelEl.hidden = true;
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) renderChunk();
      });
    },
    {
      root: null,
      rootMargin: "220px 0px",
      threshold: 0.01,
    }
  );

  renderChunk();
  observer.observe(sentinelEl);
})();
