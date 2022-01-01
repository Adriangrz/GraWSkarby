const msgContainer = document.querySelector('.page-main__message-container');
export function displayError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `<p class="text-center m-0">${message}</p>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    msgContainer.appendChild(alert);
}
