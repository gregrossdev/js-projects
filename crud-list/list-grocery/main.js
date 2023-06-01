/*==Properties*/
const grocery = document.getElementById("grocery");
const groceryForm = document.querySelector(".grocery-form");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
const alert = document.querySelector(".alert");

let editElement;
let editFlag = false;
let editID = "";

/**/

/*==Listeners*/
groceryForm.addEventListener("submit", addItem);
clearBtn.addEventListener("click", destroyAll);
window.addEventListener("DOMContentLoaded", setupItems);

/**/

/*==Functions*/
// CRUD operations
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value !== "" && !editFlag) {
        const articleEl = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        articleEl.setAttributeNode(attr);
        articleEl.classList.add("grocery-item");
        articleEl.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

        const deleteBtn = articleEl.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = articleEl.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);


        groceryList.appendChild(articleEl);
        displayAlert("item added to the list", "success");
        groceryContainer.classList.add("show-container");
        addToLocalStorage(id, value);
        resetForm();
    }
    else if (value !== "" && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editID, value);
        resetForm();
    }
    else {
        displayAlert("please enter value", "danger");
    }
}
function editItem(e) {
    const el = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = el.dataset.id;
    submitBtn.textContent = "edit";
}
function deleteItem(e) {
    const el = e.currentTarget.parentElement.parentElement;
    const id = el.dataset.id;

    groceryList.removeChild(el);

    if (groceryList.children.length === 0) {
        groceryContainer.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");

    resetForm();
    removeFromLocalStorage(id);
}
function destroyAll() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
        items.forEach(function (item) {
            groceryList.removeChild(item);
        });
    }
    groceryContainer.classList.remove("show-container");
    displayAlert("empty list", "danger");
    resetForm();
    localStorage.removeItem("list");
}


// Database
function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

// Util
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}
function resetForm() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// App Setup
function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
        groceryContainer.classList.add("show-container");
    }
}
function createListItem(id, value) {
    const el = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    el.setAttributeNode(attr);
    el.classList.add("grocery-item");
    el.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

    const deleteBtn = el.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = el.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    groceryList.appendChild(el);
}

/**/