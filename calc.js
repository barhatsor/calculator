
let calc = {
  el: document.querySelector('.calc'),
  result: document.querySelector('.calc .header .number'),
  buttons: {}
};

calc.buttons = calc.el.querySelectorAll('.button');

calc.buttons.forEach(button => {
    
  if (button.classList.contains('number') ||
      button.classList.contains('text')) {
    
    button.type = 'literal';
    button.title = button.textContent;
    
  } else {
    
    button.type = 'function';
    button.title = button.classList.value.replace('button', '');
    
  }
  
  
  button.addEventListener('click', () => {
    
    calc.focusEndOf(result);
    
    if (button.type == 'literal') {
      
      calc.result.textContent += button.title;
      
    }
    
  });
    
});


calc.focusEndOf = (el) => {
  
  let range = el.createTextRange();
  range.collapse(false);
  range.select();
  
}

