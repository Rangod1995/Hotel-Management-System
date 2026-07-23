// utils.js
(function (window) {
  "use strict";

  const STORAGE_KEYS = {
    rooms: "hotel_rooms",
    bookings: "hotel_bookings",
    guests: "hotel_guests"
  };

  const HotelUtils = {};

  /* ==========================
     LOCAL STORAGE
  ========================== */

  HotelUtils.getData = function (key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  };

  HotelUtils.saveData = function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  };

  HotelUtils.STORAGE_KEYS = STORAGE_KEYS;

  /* ==========================
     RANDOM ID
  ========================== */

  HotelUtils.generateId = function (prefix = "ID") {
    return (
      prefix +
      "-" +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 999)
    );
  };

  /* ==========================
     DATE
  ========================== */

  HotelUtils.formatDate = function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  HotelUtils.today = function () {
    return new Date().toISOString().split("T")[0];
  };

  /* ==========================
     CURRENCY
  ========================== */

  HotelUtils.formatCurrency = function (amount) {
    return "$" + Number(amount).toFixed(2);
  };

  /* ==========================
     TOAST NOTIFICATION
  ========================== */

  HotelUtils.showToast = function (message) {

    let toast = document.querySelector(".hotel-toast");

    if (toast) {
      toast.remove();
    }

    toast = document.createElement("div");
    toast.className = "hotel-toast";
    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 50);

    setTimeout(() => {

      toast.classList.remove("show");

      setTimeout(() => {

        if (toast.parentNode) {
          toast.remove();
        }

      }, 300);

    }, 2500);

  };

  /* ==========================
     CONFIRM DIALOG
  ========================== */

  HotelUtils.confirmAction = function (message) {
    return window.confirm(message);
  };

  /* ==========================
     VALIDATION
  ========================== */

  HotelUtils.isEmpty = function (value) {
    return value === null ||
      value === undefined ||
      value.toString().trim() === "";
  };

  HotelUtils.validateEmail = function (email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  };

  HotelUtils.validatePhone = function (phone) {

    return /^[0-9+\-\s()]{7,20}$/.test(phone);

  };

  /* ==========================
     MODAL
  ========================== */

  HotelUtils.openModal = function (modal) {

    if (!modal) return;

    modal.style.display = "flex";

  };

  HotelUtils.closeModal = function (modal) {

    if (!modal) return;

    modal.style.display = "none";

  };

  /* ==========================
     SEARCH
  ========================== */

  HotelUtils.search = function (array, keyword, fields) {

    if (!keyword) return array;

    keyword = keyword.toLowerCase();

    return array.filter(item => {

      return fields.some(field => {

        return String(item[field] || "")
          .toLowerCase()
          .includes(keyword);

      });

    });

  };
    /* ==========================
     SORTING
  ========================== */

  HotelUtils.sortBy = function (array, field, direction = "asc") {

    return [...array].sort((a, b) => {

      if (typeof a[field] === "number") {
        return direction === "asc"
          ? a[field] - b[field]
          : b[field] - a[field];
      }

      const first = String(a[field] || "").toLowerCase();
      const second = String(b[field] || "").toLowerCase();

      return direction === "asc"
        ? first.localeCompare(second)
        : second.localeCompare(first);

    });

  };

  /* ==========================
     BOOKING CALCULATIONS
  ========================== */

  HotelUtils.calculateNights = function (checkIn, checkOut) {

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = end - start;

    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);

  };

  HotelUtils.calculateAmount = function (pricePerNight, checkIn, checkOut) {

    return HotelUtils.calculateNights(checkIn, checkOut) * Number(pricePerNight);

  };

  /* ==========================
     ROOM HELPERS
  ========================== */

  HotelUtils.findRoom = function (rooms, roomNumber) {

    return rooms.find(room => room.number == roomNumber);

  };

  HotelUtils.roomAvailable = function (rooms, roomNumber) {

    const room = HotelUtils.findRoom(rooms, roomNumber);

    return room && room.status === "available";

  };

  /* ==========================
     GUEST HELPERS
  ========================== */

  HotelUtils.fullName = function (guest) {

    if (!guest) return "";

    return `${guest.firstName} ${guest.lastName}`;

  };

  /* ==========================
     SAMPLE DATA
  ========================== */

  HotelUtils.seedData = function () {

    if (!localStorage.getItem(STORAGE_KEYS.rooms)) {

      HotelUtils.saveData(STORAGE_KEYS.rooms, [
        {
          number: "101",
          type: "Standard",
          guests: 2,
          price: 120,
          status: "available"
        },
        {
          number: "201",
          type: "Deluxe",
          guests: 3,
          price: 180,
          status: "occupied"
        },
        {
          number: "301",
          type: "Executive",
          guests: 4,
          price: 250,
          status: "available"
        }
      ]);

    }

    if (!localStorage.getItem(STORAGE_KEYS.guests)) {

      HotelUtils.saveData(STORAGE_KEYS.guests, [
        {
          id: "GST001",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 555-2222"
        },
        {
          id: "GST002",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah@example.com",
          phone: "+1 555-3344"
        }
      ]);

    }

    if (!localStorage.getItem(STORAGE_KEYS.bookings)) {

      HotelUtils.saveData(STORAGE_KEYS.bookings, []);

    }

  };

  /* ==========================
     TOAST CSS
  ========================== */

  if (!document.getElementById("hotel-utils-style")) {

    const style = document.createElement("style");

    style.id = "hotel-utils-style";

    style.textContent = `

.hotel-toast{
position:fixed;
right:20px;
bottom:20px;
background:#111827;
color:#fff;
padding:14px 18px;
border-radius:10px;
font-size:14px;
font-weight:500;
box-shadow:0 10px 25px rgba(0,0,0,.2);
opacity:0;
transform:translateY(20px);
transition:.3s;
z-index:99999;
}

.hotel-toast.show{
opacity:1;
transform:translateY(0);
}

`;

    document.head.appendChild(style);

  }

  /* ==========================
     INITIALIZE
  ========================== */

  HotelUtils.seedData();

  window.HotelUtils = HotelUtils;

})(window);

  /* ==========================
     SORT
  ========================== */                             


