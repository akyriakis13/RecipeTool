function openTab(tabName) {
    let i, tabContent, tabButton;

    // Hide tab content and deactivate tab buttons
    tabContent = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }
    tabButton = document.getElementsByClassName('tab-button');
    for (i = 0; i < tabButton.length; i++) {
        tabButton[i].classList.remove('active');
    }

    // Show selected tab content and activate selected tab button
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Open search tab default
document.getElementById('search').style.display = 'block';
document.getElementsByClassName('tab-button')[0].classList.add('active');