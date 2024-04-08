const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closecheoutBtn = document.getElementById("close-modal-bnt");
const cartcount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ARIR MODAL do carrinho
cartBtn.addEventListener("click", function () {
  updateCardModal();
  cartModal.style.display = "flex";
});

// FECHAR MODAL
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// FECHAR MODAL
closecheoutBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  //   console.log(event.target);
  let parentButton = event.target.closest(".add-to-cart-bnt");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addtoCart(name, price);
    // adicionar no carrinho
  }
});

// função para adiconar no carrinho

function addtoCart(name, price) {
  const existingItem = cart.find((item) => item.name == name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCardModal();
}

// atualizar carrinho
function updateCardModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartitemelement = document.createElement("div");
    cartitemelement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartitemelement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
        <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
        </button>

    </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartitemelement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartcount.innerHTML = cart.length;
}

// funçao remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name"); // pega o nome do produto que foi clicado no botão de remover

    removeFromCart(name);
  }
});

function removeFromCart(name) {
  let index = cart.findIndex((item) => item.name === name);
  // Se o produto for encontrado no array, ele é removido
  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1); // Removendo o item do array usando splice
    }

    updateCardModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantopen();
  if (!isOpen) {
    Toastify({
      text: "Ops o Restaurante esta fechado!",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500"); // Corrigido "boder" para "border"
    return;
  }

  // enviar pedido pelo WhatsApp
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");

  const mensagem = encodeURIComponent(cartItems);
  const phone = "33991569087";

  window.open(
    `https://wa.me/${phone}/?text=${mensagem} Endereço: ${addressInput.value}`,
    "_blank"
  );

  // Limpar o carrinho e atualizar o modal
  cart = [];
  updateCardModal();
});

// vericar se esta aberto
function checkRestaurantopen() {
  const data = new Date();
  const hora = data.getHours();

  return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span");
const status = document.getElementById("status-loja");
const isOpen = checkRestaurantopen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
  status.innerHTML = "Aberto";
  status.style.color = "green";
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
  status.innerHTML = "Fechado";
  status.style.color = "red"; // "red" deve ser minúsculo
}
