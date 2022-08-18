
let calc = {
  el: document.querySelector('.calc'),
  result: document.querySelector('.calc .header .number'),
  buttons: {}
};

calc.buttons = calc.el.querySelectorAll('.buttons');

calc.buttons.forEach(button => {
    
  if (button.classList.contains('number') ||
      button.classList.contains('text')) {
    
    button.type = 'literal';
    button.name = button.textContent;
    
  } else {
    
    button.type = 'function';
    button.name = button.classList.value.replace('button', '');
    
  }
  
  
  button.addEventListener('click', () => {
    
    if (button.type == 'literal') {
      
      result.textContent += button.name;
      
    }
    
  });
    
});

