// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Add a simple animation to the welcome message
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.opacity = '0';
        setTimeout(() => {
            heading.style.transition = 'opacity 1s ease-in';
            heading.style.opacity = '1';
        }, 100);
    }

    // Calculator functionality
    initCalculator();
    
    // Dropdown functionality
    initDropdown();
});

function initCalculator() {
    const display = document.getElementById('display');
    if (!display) return; // Exit if not on calculator page
    
    const buttons = document.querySelectorAll('.calculator-buttons button');
    let currentInput = '';
    let previousInput = '';
    let operation = null;

    // Add ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
        
        button.addEventListener('click', () => {
            // Add button press animation
            button.classList.add('button-press');
            setTimeout(() => button.classList.remove('button-press'), 200);

            if (button.classList.contains('number')) {
                currentInput += button.textContent;
                updateDisplay();
            }
            else if (button.classList.contains('operator')) {
                if (currentInput !== '') {
                    if (previousInput !== '') {
                        calculate();
                    }
                    operation = button.textContent;
                    previousInput = currentInput;
                    currentInput = '';
                    updateDisplay();
                }
            }
            else if (button.classList.contains('equals')) {
                calculate();
            }
            else if (button.classList.contains('clear')) {
                clear();
            }
            else if (button.classList.contains('delete')) {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            }
        });
    });

    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    function updateDisplay() {
        display.classList.add('update');
        if (previousInput && operation) {
            display.value = previousInput + ' ' + operation + ' ' + currentInput;
        } else {
            display.value = currentInput;
        }
        setTimeout(() => display.classList.remove('update'), 100);
    }

    function calculate() {
        if (previousInput !== '' && currentInput !== '') {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);

            switch(operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                default:
                    return;
            }

            currentInput = result.toString();
            operation = null;
            previousInput = '';
            updateDisplay();
        }
    }

    function clear() {
        currentInput = '';
        previousInput = '';
        operation = null;
        display.value = '';
    }

    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Call on load
}

function initDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdown) {
        // Handle hover for desktop
        userDropdown.addEventListener('mouseenter', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'block';
            }
        });

        userDropdown.addEventListener('mouseleave', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Handle click for mobile
        userDropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const dropdownMenu = this.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = 
                        dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    e.stopPropagation();
                }
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });
    }
} 