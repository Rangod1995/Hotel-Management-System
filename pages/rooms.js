(function () {
  const initialRooms = [
    {
      number: "101",
      type: "Deluxe Suite",
      guests: 2,
      amenities: ["Wi-Fi", "Ocean View"],
      price: 180,
      status: "available",
      description: "Premium suite overlooking the city skyline."
    },
    {
      number: "205",
      type: "Executive",
      guests: 3,
      amenities: ["Smart TV", "Mini Bar"],
      price: 240,
      status: "occupied",
      description: "Executive room with lounge access and premium amenities."
    },
    {
      number: "312",
      type: "Standard",
      guests: 2,
      amenities: ["Air Conditioning"],
      price: 125,
      status: "maintenance",
      description: "Currently under maintenance and awaiting inspection."
    }
  ];

  let rooms = [...initialRooms];
  let editingRoomNumber = null;

  const roomGrid = document.getElementById("roomsGrid");
  const searchInput = document.getElementById("searchRooms");
  const toolbarSelects = Array.from(document.querySelectorAll(".toolbar select"));
  const addRoomButton = document.querySelector(".top-actions .btn-primary");
  const modal = document.getElementById("roomModal");
  const modalContent = modal ? modal.querySelector(".modal-content") : null;
  const modalTitle = modal ? modal.querySelector("h2") : null;
  const form = modal ? modal.querySelector("form") : null;

  if (!roomGrid || !modal || !form || !modalContent || !modalTitle) {
    return;
  }

  const formElements = Array.from(form.elements || []);
  const roomNumberInput = formElements.find((element) => element.tagName === "INPUT" && element.type === "text");
  const roomTypeSelect = formElements.find((element) => element.tagName === "SELECT");
  const priceInput = formElements.filter((element) => element.tagName === "INPUT" && element.type === "number")[0];
  const capacityInput = formElements.filter((element) => element.tagName === "INPUT" && element.type === "number")[1];
  const descriptionInput = formElements.find((element) => element.tagName === "TEXTAREA");

  if (!roomNumberInput || !roomTypeSelect || !priceInput || !capacityInput || !descriptionInput) {
    return;
  }

  ensureToastStyles();
  addModalCloseButton();

  addRoomButton?.addEventListener("click", () => {
    editingRoomNumber = null;
    resetForm();
    modalTitle.textContent = "Add New Room";
    openModal();
  });

  searchInput?.addEventListener("input", renderRooms);
  toolbarSelects.forEach((select) => select.addEventListener("change", renderRooms));

  form.addEventListener("submit", handleFormSubmit);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  roomGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const card = event.target.closest(".room-card");
    if (!card) {
      return;
    }

    const roomNumber = card.getAttribute("data-room-number");
    const room = rooms.find((item) => item.number === roomNumber);
    if (!room) {
      return;
    }

    const action = button.getAttribute("data-action");

    if (action === "details") {
      showToast(`${room.type} • ${room.guests} guests • $${room.price}/night`);
      return;
    }

    if (action === "edit") {
      editingRoomNumber = room.number;
      fillForm(room);
      modalTitle.textContent = `Edit Room ${room.number}`;
      openModal();
      return;
    }

    toggleRoomStatus(room);
  });

  renderRooms();

  function renderRooms() {
    const filteredRooms = getFilteredRooms();

    if (!filteredRooms.length) {
      roomGrid.innerHTML = "<div class=\"stat-card\" style=\"grid-column: 1 / -1;\">No rooms match the current filters.</div>";
      return;
    }

    roomGrid.innerHTML = filteredRooms
      .map((room) => {
        const badgeClass = room.status === "occupied" ? "occupied" : room.status === "maintenance" ? "maintenance" : "available";
        const badgeLabel = room.status.charAt(0).toUpperCase() + room.status.slice(1);
        const actionLabel = room.status === "available" ? "Book" : room.status === "occupied" ? "Check Out" : "Repair";
        const primaryClass = room.status === "available" ? "btn-primary" : "btn-secondary";

        return `
          <article class="room-card" data-room-number="${room.number}">
            <div class="room-image">
              <i class="fas fa-bed"></i>
              <span class="badge ${badgeClass}">${badgeLabel}</span>
            </div>
            <div class="room-body">
              <h2>Room ${room.number}</h2>
              <p class="type">${room.type}</p>
              <div class="meta">
                <span><i class="fas fa-user"></i>${room.guests} Guests</span>
                <span><i class="fas fa-tag"></i>${room.amenities.join(", ")}</span>
              </div>
              <div class="price">$${room.price} <small>/night</small></div>
              <div class="actions">
                <button class="btn-secondary" data-action="details">Details</button>
                <button class="btn-secondary" data-action="edit">Edit</button>
                <button class="${primaryClass}" data-action="toggle-status">${actionLabel}</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function getFilteredRooms() {
    const query = searchInput?.value.trim().toLowerCase() || "";
    const statusValue = toolbarSelects[0]?.value || "all";
    const typeValue = toolbarSelects[1]?.value || "all";
    const sortValue = toolbarSelects[2]?.value || "number";

    let filtered = [...rooms];

    if (query) {
      filtered = filtered.filter((room) => {
        return [room.number, room.type, room.description, room.amenities.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }

    if (statusValue !== "all") {
      filtered = filtered.filter((room) => room.status === statusValue);
    }

    if (typeValue !== "all") {
      filtered = filtered.filter((room) => room.type.toLowerCase() === typeValue.toLowerCase());
    }

    switch (sortValue) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        filtered.sort((a, b) => Number(a.number) - Number(b.number));
        break;
    }

    return filtered;
  }

  function toggleRoomStatus(room) {
    room.status = room.status === "available" ? "occupied" : "available";
    showToast(`Room ${room.number} is now ${room.status}.`);
    renderRooms();
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const roomNumber = roomNumberInput.value.trim();
    const type = roomTypeSelect.value.trim();
    const price = Number(priceInput.value);
    const capacity = Number(capacityInput.value);
    const description = descriptionInput.value.trim();

    if (!roomNumber || !type || !price || !capacity || !description) {
      showToast("Please complete every field before saving.");
      return;
    }

    const payload = {
      number: roomNumber,
      type,
      guests: capacity,
      amenities: ["Newly Added"],
      price,
      status: "available",
      description
    };

    if (editingRoomNumber) {
      const index = rooms.findIndex((room) => room.number === editingRoomNumber);
      if (index >= 0) {
        rooms[index] = { ...rooms[index], ...payload, number: editingRoomNumber };
      }
    } else {
      rooms.push(payload);
    }

    resetForm();
    closeModal();
    renderRooms();
    showToast(editingRoomNumber ? `Room ${editingRoomNumber} updated.` : `Room ${roomNumber} added.`);
    editingRoomNumber = null;
  }

  function fillForm(room) {
    roomNumberInput.value = room.number;
    roomTypeSelect.value = room.type;
    priceInput.value = room.price;
    capacityInput.value = room.guests;
    descriptionInput.value = room.description;
  }

  function resetForm() {
    form.reset();
    roomNumberInput.value = "";
    roomTypeSelect.value = "Standard";
    priceInput.value = "";
    capacityInput.value = "";
    descriptionInput.value = "";
  }

  function openModal() {
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
    resetForm();
    editingRoomNumber = null;
    modalTitle.textContent = "Add New Room";
  }

  function addModalCloseButton() {
    if (modalContent.querySelector(".modal-close")) {
      return;
    }

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "modal-close btn-secondary";
    closeButton.innerHTML = '<i class="fas fa-times"></i> Close';
    closeButton.addEventListener("click", closeModal);
    modalContent.appendChild(closeButton);
  }

  function ensureToastStyles() {
    if (document.getElementById("room-toast-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "room-toast-styles";
    style.textContent = `
      .room-toast {
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: #111827;
        color: #fff;
        padding: 12px 16px;
        border-radius: 10px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.18);
        z-index: 1000;
        max-width: 280px;
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message) {
    const existingToast = document.querySelector(".room-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "room-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 2200);
  }
})();
