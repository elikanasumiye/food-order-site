function switchTab(event, tab) {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tabBtn => tabBtn.classList.remove('active'));

    const selectedForm = document.getElementById(tab + '-form');
    if (selectedForm) {
        selectedForm.classList.add('active');
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

