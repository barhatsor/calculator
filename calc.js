
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
      
      result.addText(button.title);
      
    } else {
      
      if (button.title === 'clear') {
        
        result.textContent = '';
        result.focus();
        
      } else if (button.title === 'backspace') {
        
        result.removeText(1);
        
      } else if (button.title === 'brackets') {
        
        result.addText('()');
        result.moveSel(-1);
        
      }
      
    }
    
  });
    
});


calc.result.getSel = () => {

  const selection = window.getSelection();
  const pos = selection.baseOffset;
  
  return pos;

}

calc.result.setSel = (startPos, endPos = startPos) => {

  const selection = window.getSelection();
  const resultNode = calc.result.childNodes[0];
  
  selection.setBaseAndExtent(resultNode, startPos, resultNode, endPos);

}


calc.result.moveSel = (charsToMove) => {

  const pos = calc.result.getSel();
    
  calc.result.setSel(pos + charsToMove);

}

calc.result.moveSelToEnd = () => {
  
  calc.result.setSel(calc.result.textContent.length);
  
}


calc.result.focused = () => {
  
  return document.activeElement === calc.result;
  
}


calc.result.addText = (text) => {
    
  if (!calc.result.focused()) calc.result.focus();
  
  const pos = calc.result.getSel();
  
  const resultText = calc.result.textContent;
  
  calc.result.textContent = resultText.slice(0, pos) + text + resultText.slice(pos);
  
  calc.result.setSel(pos + text.length);
  
}

calc.result.removeText = (charsToRemove = 1) => {

  if (!calc.result.focused()) calc.result.focus();

  const pos = calc.result.getSel();
  
  calc.result.setSel(pos, pos - charsToRemove);
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
}

