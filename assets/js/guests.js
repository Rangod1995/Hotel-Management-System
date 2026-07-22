// guests.js
(function () {

  let guests = HotelUtils.getData(
    HotelUtils.STORAGE_KEYS.guests,
    [
      {
        id: "GST001",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1 555-1234",
        address: "New York",
        idType: "Passport",
        idNumber: "A1234567"
      },
      {
        id: "GST002",
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah@example.com",
        phone: "+1 555-5678",
        address: "Los Angeles",
        idType: "National ID",
        idNumber: "NID009812"
      }
    ]
  );

  let editingGuest = null;

  const guestsGrid = document.getElementById("guestsGrid");
  const modal = document.getElementById("guestModal");
  const form = document.getElementById("guestForm");
  const addButton = document.getElementById("addGuestBtn");
  const searchInput = document.querySelector(".header-search input");
  const closeButton = modal.querySelector(".modal-close");

  if (
    !guestsGrid ||
    !modal ||
    !form
  ) return;

  const firstNameInput = form.querySelectorAll("input")[0];
  const lastNameInput = form.querySelectorAll("input")[1];
  const emailInput = form.querySelectorAll("input")[2];
  const phoneInput = form.querySelectorAll("input")[3];
  const addressInput = form.querySelectorAll("input")[4];
  const idTypeSelect = form.querySelector("select");
  const idNumberInput = form.querySelectorAll("input")[5];

  addButton.addEventListener("click", () => {

    editingGuest = null;

    form.reset();

    modal.querySelector("h2").textContent = "Add Guest";

    HotelUtils.openModal(modal);

  });

  closeButton.addEventListener("click", () => {

    HotelUtils.closeModal(modal);

  });

  modal.addEventListener("click", (event) => {

    if (event.target === modal) {

      HotelUtils.closeModal(modal);

    }

  });

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      HotelUtils.closeModal(modal);

    }

  });

  searchInput.addEventListener("input", renderGuests);

  form.addEventListener("submit", saveGuest);

  guestsGrid.addEventListener("click", handleGuestActions);

  renderGuests();
    function renderGuests() {

    let filteredGuests = [...guests];

    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword) {

      filteredGuests = filteredGuests.filter(guest => {

        return (
          guest.firstName.toLowerCase().includes(keyword) ||
          guest.lastName.toLowerCase().includes(keyword) ||
          guest.email.toLowerCase().includes(keyword) ||
          guest.phone.toLowerCase().includes(keyword) ||
          guest.id.toLowerCase().includes(keyword)
        );

      });

    }

    if (!filteredGuests.length) {

      guestsGrid.innerHTML = `
        <div class="stat-card">
          <h3>No guests found.</h3>
        </div>
      `;

      updateGuestStats(0);

      return;

    }

    guestsGrid.innerHTML = filteredGuests.map(guest => {

      const initials =
        guest.firstName.charAt(0).toUpperCase() +
        guest.lastName.charAt(0).toUpperCase();

      return `
        <div class="guest-card" data-id="${guest.id}">

          <div class="guest-header">

            <div class="guest-avatar">
              ${initials}
            </div>

            <div class="guest-info">

              <h3>${guest.firstName} ${guest.lastName}</h3>

              <p>${guest.id}</p>

            </div>

          </div>

          <div class="guest-body">

            <p>
              <i class="fas fa-envelope"></i>
              ${guest.email}
            </p>

            <p>
              <i class="fas fa-phone"></i>
              ${guest.phone}
            </p>

            <p>
              <i class="fas fa-location-dot"></i>
              ${guest.address || "No address"}
            </p>

            <p>
              <i class="fas fa-id-card"></i>
              ${guest.idType} :
              ${guest.idNumber}
            </p>

          </div>

          <div class="guest-actions">

            <button
              class="btn-secondary"
              data-action="edit">
              Edit
            </button>

            <button
              class="btn-secondary"
              data-action="delete">
              Delete
            </button>

          </div>

        </div>
      `;

    }).join("");

    updateGuestStats(filteredGuests.length);

  }

  function handleGuestActions(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const card = button.closest(".guest-card");

    if (!card) return;

    const id = card.dataset.id;

    const guest = guests.find(item => item.id === id);

    if (!guest) return;

    const action = button.dataset.action;

    if (action === "edit") {

      editGuest(guest);

      return;

    }

    if (action === "delete") {

      if (!HotelUtils.confirmAction("Delete this guest?")) {

        return;

      }

      guests = guests.filter(item => item.id !== id);

      HotelUtils.saveData(
        HotelUtils.STORAGE_KEYS.guests,
        guests
      );

      HotelUtils.showToast("Guest deleted successfully.");

      renderGuests();

    }

  }

  function updateGuestStats(total) {

    const values = document.querySelectorAll(".stat-value");

    if (values.length >= 4) {

      values[0].textContent = total;
      values[1].textContent = total;
      values[2].textContent = Math.max(1, Math.floor(total / 4));
      values[3].textContent =
        total === 0
          ? "0%"
          : Math.min(100, Math.floor((total / (total + 5)) * 100)) + "%";

    }

  }
    function saveGuest(event) {

    event.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const idType = idTypeSelect.value;
    const idNumber = idNumberInput.value.trim();

    if (
      HotelUtils.isEmpty(firstName) ||
      HotelUtils.isEmpty(lastName) ||
      HotelUtils.isEmpty(email) ||
      HotelUtils.isEmpty(phone)
    ) {

      HotelUtils.showToast("Please complete all required fields.");

      return;

    }

    if (!HotelUtils.validateEmail(email)) {

      HotelUtils.showToast("Please enter a valid email address.");

      return;

    }

    if (!HotelUtils.validatePhone(phone)) {

      HotelUtils.showToast("Please enter a valid phone number.");

      return;

    }

    const guestData = {

      id: editingGuest
        ? editingGuest.id
        : HotelUtils.generateId("GST"),

      firstName,

      lastName,

      email,

      phone,

      address,

      idType,

      idNumber

    };

    if (editingGuest) {

      const index = guests.findIndex(
        guest => guest.id === editingGuest.id
      );

      if (index !== -1) {

        guests[index] = guestData;

      }

      HotelUtils.showToast("Guest updated successfully.");

    } else {

      guests.push(guestData);

      HotelUtils.showToast("Guest added successfully.");

    }

    HotelUtils.saveData(
      HotelUtils.STORAGE_KEYS.guests,
      guests
    );

    form.reset();

    editingGuest = null;

    modal.querySelector("h2").textContent = "Add Guest";

    HotelUtils.closeModal(modal);

    renderGuests();

  }

  function editGuest(guest) {

    editingGuest = guest;

    firstNameInput.value = guest.firstName;
    lastNameInput.value = guest.lastName;
    emailInput.value = guest.email;
    phoneInput.value = guest.phone;
    addressInput.value = guest.address;
    idTypeSelect.value = guest.idType;
    idNumberInput.value = guest.idNumber;

    modal.querySelector("h2").textContent = "Edit Guest";

    HotelUtils.openModal(modal);

  }

})();