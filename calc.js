
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
    const resultNum = Number(result.textContent);
    
    result.focus();
    
    if (button.type == 'literal') {
      
      result.addText(button.title);
      
    } else {
      
      if (button.title === 'clear') {
        
        result.textContent = '';
        
      } else if (button.title === 'backspace') {
        
        if (result.afterSel(1) === ')') {
          
          result.removeText(1);
          
        }
        
        if (result.beforeSel(3) === 'NaN') {
          
          result.removeText(-2);
          
        }
        
        result.removeText(-1);
        
      } else if (button.title === 'brackets') {
        
        result.addText('()');
        result.moveSel(-1);
        
      } else if (button.title === 'percent') {
        
        if (!isNaN(resultNum)) {
        
          result.textContent = resultNum / 100;
          
        } else {
          
          result.textContent = 'NaN';
          
        }
        
        result.moveSelToEnd();
        
      }
      
    }
        
  });
    
});


calc.result.addEventListener('keydown', (e) => {
  
  if (e.key === 'Backspace' || e.keyCode === 8) {
  
    if (result.beforeSel(3) === 'NaN') {
      
      result.removeText(-2);
  
    }
    
  }
  
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


calc.result.beforeSel = (offset = null) => {
  
  const pos = calc.result.getSel();
  
  const resultText = calc.result.textContent;
  
  if (offset) {
    
    return resultText.slice(pos - offset, pos);
  
  } else {
    
    return resultText.slice(0, pos);
    
  }
  
}

calc.result.afterSel = (offset = null) => {
  
  const pos = calc.result.getSel();
  
  const resultText = calc.result.textContent;
  
  if (offset) {
  
    return resultText.slice(pos, pos + offset);
    
  } else {
    
    return resultText.slice(pos);
    
  }
    
}


calc.result.focused = () => {
  
  return document.activeElement === calc.result;
  
}

calc.result.selCollapsed = () => {
  
  if (calc.result.focused()) {
    
    return window.getSelection().isCollapsed;
    
  } else {
    
    return true;
    
  }
  
}


calc.result.addText = (text) => {
  
  const result = calc.result;
  const pos = calc.result.getSel();
  
  const resultText = result.beforeSel() + text + result.afterSel();
  calc.result.textContent = resultText;
  
  calc.result.setSel(pos + text.length);
  
}

calc.result.removeText = (charsToRemove = -1) => {
  
  if (calc.result.selCollapsed()) {
    
    const pos = calc.result.getSel();
    
    if (pos === 0) return;
    
    calc.result.setSel(pos, pos + charsToRemove);
    
  }
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();

}

