let enterBtn = document.getElementById("enter");
let createItem = document.getElementById("createItem");
let list = document.querySelector("ul");


enterBtn.addEventListener("click", addListAfterClick);
createItem.addEventListener("keypress", addListAfterKeypress);
window.addEventListener("DOMContentLoaded", init);

// **LOCAL STORAGE**
function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function addToLocalStorage(id, value) {
    const todoItem = { id, value };
    let items = getLocalStorage();
    items.push(todoItem);
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(item => {
        if(item.id === id)
            item.value = value;
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(item => {
        if(item.id !== id)
            return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}



function inputLength() {
    return createItem.value.length;
}

function reset() {
    createItem.value = "";
}

function addListAfterClick() {
    if (inputLength() > 0)
        createListItem();
}

function addListAfterKeypress(e) {
    if(inputLength() > 0 && e.which === 13)
        createListItem();
}


// Main functionality
function init() {
    let items = getLocalStorage();
    if(items.length > 0)
        items.forEach(item => {
            createListItem(item.id, item.value);
        })
}



function createListItem(id, value) {
    value = createItem.value;
    id = new Date().getTime().toString();
    if( value !== "") {
        const todoElement = document.createElement("li");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        todoElement.setAttributeNode(attr);
        todoElement.appendChild(document.createTextNode(createItem.value));
        todoElement.addEventListener("click", complete);
        function complete() {
            todoElement.classList.toggle("done");
        }

        todoElement.addEventListener("click", deleteListItem)
        function deleteListItem() {
            todoElement.classList.add("delete");
        }

        list.appendChild(todoElement);
        addToLocalStorage(id, value);
        reset()
    }
}



