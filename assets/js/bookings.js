// bookings.js
(function () {

  let bookings = HotelUtils.getData(
    HotelUtils.STORAGE_KEYS.bookings,
    [
      {
        id: "BK001",
        guest: "John Doe",
        email: "john@example.com",
        phone: "+1 555-1234",
        room: "101 - Standard",
        checkIn: "2026-07-23",
        checkOut: "2026-07-26",
        guests: 2,
        amount: 360,
        status: "confirmed"
      },
      {
        id: "BK002",
        guest: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+1 555-5678",
        room: "201 - Deluxe",
        checkIn: "2026-07-24",
        checkOut: "2026-07-28",
        guests: 3,
        amount: 720,
        status: "checked-in"
      }
    ]
  );

  let editingBooking = null;
  let activeTab = "all";

  const tableBody = document.getElementById("bookingsTableBody");
  const modal = document.getElementById("bookingModal");
  const form = document.getElementById("bookingForm");
  const addButton = document.getElementById("addBookingBtn");
  const searchInput = document.querySelector(".header-search input");
  const tabs = document.querySelectorAll(".tab-btn");
  const closeButton = modal.querySelector(".modal-close");

  if (
    !tableBody ||
    !modal ||
    !form
  ) return;

  const guestNameInput = form.querySelectorAll("input")[0];
  const emailInput = form.querySelectorAll("input")[1];
  const phoneInput = form.querySelectorAll("input")[2];
  const roomSelect = form.querySelector("select");
  const checkInInput = form.querySelectorAll("input")[3];
  const checkOutInput = form.querySelectorAll("input")[4];
  const guestsInput = form.querySelectorAll("input")[5];

  addButton.addEventListener("click", () => {

    editingBooking = null;

    form.reset();

    modal.querySelector("h2").textContent = "New Booking";

    HotelUtils.openModal(modal);

  });

  closeButton.addEventListener("click", () => {

    HotelUtils.closeModal(modal);

  });

  modal.addEventListener("click", e => {

    if (e.target === modal) {

      HotelUtils.closeModal(modal);

    }

  });

  document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

      HotelUtils.closeModal(modal);

    }

  });

  searchInput.addEventListener("input", renderBookings);

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      tabs.forEach(btn => btn.classList.remove("active"));

      tab.classList.add("active");

      activeTab = tab.dataset.tab;

      renderBookings();

    });

  });

  form.addEventListener("submit", saveBooking);

  tableBody.addEventListener("click", handleTableActions);

  renderBookings();
    function renderBookings() {

    let filtered = [...bookings];

    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword) {

      filtered = filtered.filter(booking => {

        return (
          booking.id.toLowerCase().includes(keyword) ||
          booking.guest.toLowerCase().includes(keyword) ||
          booking.email.toLowerCase().includes(keyword) ||
          booking.room.toLowerCase().includes(keyword)
        );

      });

    }

    if (activeTab !== "all") {

      filtered = filtered.filter(booking => {

        return booking.status === activeTab;

      });

    }

    if (!filtered.length) {

      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:30px;">
            No bookings found.
          </td>
        </tr>
      `;

      return;

    }

    tableBody.innerHTML = filtered.map(booking => {

      return `
        <tr data-id="${booking.id}">

          <td>${booking.id}</td>

          <td>
            <strong>${booking.guest}</strong><br>
            <small>${booking.email}</small>
          </td>

          <td>${booking.room}</td>

          <td>${HotelUtils.formatDate(booking.checkIn)}</td>

          <td>${HotelUtils.formatDate(booking.checkOut)}</td>

          <td>
            <span class="status-badge ${booking.status}">
              ${booking.status}
            </span>
          </td>

          <td>${HotelUtils.formatCurrency(booking.amount)}</td>

          <td>

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

            ${
              booking.status === "confirmed"
              ? `
                <button
                  class="btn-primary"
                  data-action="checkin">
                  Check In
                </button>
              `
              : booking.status === "checked-in"
              ? `
                <button
                  class="btn-primary"
                  data-action="checkout">
                  Check Out
                </button>
              `
              : ""
            }

          </td>

        </tr>
      `;

    }).join("");

  }

  function handleTableActions(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const row = button.closest("tr");

    const id = row.dataset.id;

    const booking = bookings.find(item => item.id === id);

    if (!booking) return;

    const action = button.dataset.action;

    if (action === "edit") {

      editBooking(booking);

      return;

    }

    if (action === "delete") {

      if (!HotelUtils.confirmAction("Delete this booking?")) {

        return;

      }

      bookings = bookings.filter(item => item.id !== id);

      HotelUtils.saveData(
        HotelUtils.STORAGE_KEYS.bookings,
        bookings
      );

      HotelUtils.showToast("Booking deleted.");

      renderBookings();

      return;

    }

    if (action === "checkin") {

      booking.status = "checked-in";

      HotelUtils.saveData(
        HotelUtils.STORAGE_KEYS.bookings,
        bookings
      );

      HotelUtils.showToast("Guest checked in.");

      renderBookings();

      return;

    }

    if (action === "checkout") {

      booking.status = "completed";

      HotelUtils.saveData(
        HotelUtils.STORAGE_KEYS.bookings,
        bookings
      );

      HotelUtils.showToast("Guest checked out.");

      renderBookings();

      return;

    }

  }
    function saveBooking(event) {

    event.preventDefault();

    const guest = guestNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const room = roomSelect.value;
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const guestCount = Number(guestsInput.value);

    if (
      HotelUtils.isEmpty(guest) ||
      HotelUtils.isEmpty(email) ||
      HotelUtils.isEmpty(phone) ||
      HotelUtils.isEmpty(room) ||
      HotelUtils.isEmpty(checkIn) ||
      HotelUtils.isEmpty(checkOut)
    ) {

      HotelUtils.showToast("Please complete every field.");

      return;

    }

    if (!HotelUtils.validateEmail(email)) {

      HotelUtils.showToast("Invalid email address.");

      return;

    }

    if (!HotelUtils.validatePhone(phone)) {

      HotelUtils.showToast("Invalid phone number.");

      return;

    }

    if (new Date(checkOut) <= new Date(checkIn)) {

      HotelUtils.showToast("Check-out date must be after check-in.");

      return;

    }

    const rooms = HotelUtils.getData(
      HotelUtils.STORAGE_KEYS.rooms,
      []
    );

    const roomNumber = room.split("-")[0].trim();

    const roomInfo = rooms.find(r => r.number === roomNumber);

    const nightlyRate = roomInfo ? Number(roomInfo.price) : 100;

    const amount = HotelUtils.calculateAmount(
      nightlyRate,
      checkIn,
      checkOut
    );

    const bookingData = {

      id: editingBooking
        ? editingBooking.id
        : HotelUtils.generateId("BK"),

      guest,

      email,

      phone,

      room,

      checkIn,

      checkOut,

      guests: guestCount,

      amount,

      status: editingBooking
        ? editingBooking.status
        : "confirmed"

    };

    if (editingBooking) {

      const index = bookings.findIndex(item => item.id === editingBooking.id);

      bookings[index] = bookingData;

      HotelUtils.showToast("Booking updated successfully.");

    } else {

      bookings.push(bookingData);

      HotelUtils.showToast("Booking created successfully.");

    }

    HotelUtils.saveData(
      HotelUtils.STORAGE_KEYS.bookings,
      bookings
    );

    form.reset();

    editingBooking = null;

    modal.querySelector("h2").textContent = "New Booking";

    HotelUtils.closeModal(modal);

    renderBookings();

  }

  function editBooking(booking) {

    editingBooking = booking;

    guestNameInput.value = booking.guest;

    emailInput.value = booking.email;

    phoneInput.value = booking.phone;

    roomSelect.value = booking.room;

    checkInInput.value = booking.checkIn;

    checkOutInput.value = booking.checkOut;

    guestsInput.value = booking.guests;

    modal.querySelector("h2").textContent = "Edit Booking";

    HotelUtils.openModal(modal);

  }

})();