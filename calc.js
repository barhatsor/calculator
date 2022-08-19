
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
    button.title = button.classList.value.replace('button', '').replaceAll(' ','');
    
  }
  
  
  button.addEventListener('click', () => {
    
    const result = calc.result;
    
    if (button.type == 'literal') {
      
      result.textContent += button.title;
      
    } else {
      
      if (button.title === 'clear') {
        
        result.textContent = '';
        
      } else if (button.title === 'backspace') {
        
        result.textContent = result.textContent.slice(0,-1);
        
      } else if (button.title === 'brackets') {
        
        result.textContent = result.textContent + '(';

      }
      
    }
    
    calc.focusEndOf(result);
    
    if (button.title === 'brackets') {
      
      result.textContent = result.textContent + ')';
    
    }
    
  });
    
});


calc.focusEndOf = (el) => {

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(el);
  selection.removeAllRanges();
  selection.addRange(range);
  selection.collapseToEnd();

}

