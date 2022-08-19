
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
        
        result.removeText(-1);
        
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

  const selection = window.getSelection();
  const pos = selection.baseOffset;
    
  calc.result.setSel(pos + charsToMove);

}

calc.result.moveSelToEnd = () => {
  
  calc.result.setSel(calc.result.textContent.length);
  
}


calc.result.addText = (text) => {
    
  if (document.activeElement !== calc.result) {
    
    calc.result.focus();
    //calc.result.moveSelToEnd();
        
  }
  

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  selection.collapseToEnd();
  
}

calc.result.removeText = (charsToRemove = -1) => {

  if (document.activeElement !== calc.result) {
    
    calc.result.focus();
    //calc.result.moveSelToEnd();
        
  }


  const selection = window.getSelection();
  const pos = selection.baseOffset;

  calc.result.setSel(pos, pos + charsToRemove);
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
}

