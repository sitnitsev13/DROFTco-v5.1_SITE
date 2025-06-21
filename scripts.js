let currentCarouselIndex = 0;
let carouselInterval;
const carouselImages = [
    'https://via.placeholder.com/600x400/ddd/333?text=Бытовка+1',
    'https://via.placeholder.com/600x400/ccc/333?text=Бытовка+2',
    'https://via.placeholder.com/600x400/bbb/333?text=Бытовка+3',
    'https://via.placeholder.com/600x400/aaa/333?text=Бытовка+4'
];

function toggleMenu() {
    const nav = document.getElementById('navbarNav');
    nav.classList.toggle('active');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    document.getElementById('navbarNav').classList.remove('active');
}

function showProductPage(type, category) {
    const productPage = document.getElementById('productTemplate');
    const title = document.getElementById('productTitle');
    const description = document.getElementById('productDescription');
    const typeText = type === 'stationary' ? 'Стационарная' : 'Мобильная';
    const categoryText = {
        'residential': 'жилая',
        'warehouse': 'складская',
        'kitchen': 'кухонная',
        'office': 'офисная'
    }[category];
    title.textContent = `${typeText} ${categoryText} бытовка`;
    description.textContent = `Качественная ${typeText.toLowerCase()} ${categoryText} бытовка от проверенных производителей.`;
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    productPage.style.display = 'block';
    startCarousel();
    document.getElementById('navbarNav').classList.remove('active');
}

function startCarousel() {
    clearInterval(carouselInterval);
    currentCarouselIndex = 0;
    updateCarousel();
    carouselInterval = setInterval(() => {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
        updateCarousel();
    }, 5000);
}

function updateCarousel() {
    const img = document.getElementById('carouselImg');
    const dots = document.querySelectorAll('.carousel-dot');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = carouselImages[currentCarouselIndex];
        img.style.opacity = '1';
    }, 250);
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentCarouselIndex));
}

function setCarouselImage(index) {
    currentCarouselIndex = index;
    updateCarousel();
}

function showDeliveryInfo(type) {
    const details = document.getElementById('deliveryDetails');
    const local = document.getElementById('localDelivery');
    const russia = document.getElementById('russiaDelivery');
    const promptContainer = document.getElementById('deliveryPromptContainer');
    details.style.display = 'block';
    promptContainer.style.display = 'none';
    local.style.display = type === 'local' ? 'block' : 'none';
    russia.style.display = type === 'russia' ? 'block' : 'none';
}

function handleMobileDropdown(event, menuId) {
    event.preventDefault();
    const menu = document.getElementById(menuId);
    const otherMenuId = menuId === 'stationaryMenu' ? 'mobileMenu' : 'stationaryMenu';
    const otherMenu = document.getElementById(otherMenuId);
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
    } else {
        otherMenu.classList.remove('active');
        menu.classList.add('active');
    }
}

if (window.innerWidth <= 770) {
    const stationaryBtn = document.getElementById('stationaryBtn');
    const mobileBtn = document.getElementById('mobileBtn');
    stationaryBtn.addEventListener('click', (e) => handleMobileDropdown(e, 'stationaryMenu'));
    mobileBtn.addEventListener('click', (e) => handleMobileDropdown(e, 'mobileMenu'));
}

document.addEventListener('click', function(event) {
    if (window.innerWidth <= 770) {
        const menus = document.querySelectorAll('.dropdown-content');
        const buttons = document.querySelectorAll('.category-button');
        let isButtonClick = Array.from(buttons).some(button => button.contains(event.target));
        if (!isButtonClick) {
            menus.forEach(menu => menu.classList.remove('active'));
        }
    }
});

function togglePartnerForm() {
    const button = document.querySelector('.partner-button');
    const form = document.querySelector('.partner-form');
    const section = document.querySelector('.partner-section');
    const isActive = form.classList.contains('active');

    if (!isActive) {
        section.classList.add('expanded');
        button.classList.add('active');
        setTimeout(() => {
            form.classList.add('active');
        }, 100);
    } else {
        form.classList.remove('active');
        setTimeout(() => {
            button.classList.remove('active');
            section.classList.remove('expanded');
        }, 500);
    }
}

function checkFormFields() {
    const city = document.getElementById('partnerCity').value.trim();
    const address = document.getElementById('partnerAddress').value.trim();
    const contacts = document.getElementById('partnerContacts').value.trim();
    const submitButton = document.getElementById('submitPartnerForm');
    submitButton.disabled = !(city && address && contacts);
}

const form = document.getElementById("partnerForm");

async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById("partnerFormStatus");
    const data = new FormData(event.target);
    document.body.style.pointerEvents = 'none';
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'flex';
    const overlayContent = document.createElement('div');
    overlayContent.className = 'overlay-content';
    overlayContent.innerHTML = 'ВАША ЗАЯВКА ПРИНЯТА!<br>Наша Команда свяжется с Вами в кратчайшее время!';
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);

    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.style.pointerEvents = 'auto';
                window.location.reload(); // Надёжная перезагрузка
            }, 4000);
        } else {
            const errorData = await response.json();
            status.innerHTML = errorData.errors ? errorData.errors.map(error => error.message).join(", ") : "Ой! Произошла ошибка при отправке формы";
            status.style.display = 'block';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.style.pointerEvents = 'auto';
            }, 4000);
        }
    } catch (error) {
        status.innerHTML = "Ой! Произошла ошибка при отправке формы";
        status.style.display = 'block';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.pointerEvents = 'auto';
        }, 4000);
    }
}

form.addEventListener("submit", handleSubmit);

document.querySelectorAll('.partner-form input').forEach(input => {
    input.addEventListener('input', checkFormFields);
});