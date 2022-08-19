
let calc = {
  
  el: document.querySelector('.calc'),
  result: document.querySelector('.calc .header .number'),
  buttons: {},
  
  symbols: {
    multiply: '×',
    divide: '÷',
    add: '+',
    subtract: '−',
    pi: 'π',
    e: 'e',
    root: '√',
    pow: ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹']
  },
  
  words: ['NaN', 'hyp', 'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh']
  
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
        
      } else if (button.title === 'multiply') {
        
        result.addText('×');
        
      } else if (button.title === 'divide') {
        
        result.addText('/');
        
      } else if (button.title === 'add') {
        
        result.addText('+');
        
      } else if (button.title === 'subtract') {
        
        result.addText('-');
        
      }
      
    }
        
  });
    
});


document.addEventListener('keydown', (e) => {
  
  const result = calc.result;
  const symbols = calc.symbols;
  const words = calc.words;
  
  if (!result.focused()) result.focus();
  
  if (e.key === 'Backspace') {
  
    if (result.afterSel(1) === ')') {
    
      result.removeText(1);

    }
    
    
    let wordBefore = result.beforeSel(3);
    
    if (words.includes(wordBefore)) {
      
      result.removeText(-2);
      
    } else {
    
      wordBefore = result.beforeSel(4);
      
      if (words.includes(wordBefore)) {
        
        result.removeText(-3);
        
      }
      
    }
    
  } else if ((e.key === 'x' || e.key === 'X' ||
             e.key === '*') && !(e.metaKey || e.ctrlKey)) {
        
    e.preventDefault();
    result.addText(symbols.multiply);
    
  } else if (e.key === '/') {
    
    e.preventDefault();
    result.addText(symbols.divide);
    
  } else if (e.key === '-' || e.key === '–') {
    
    e.preventDefault();
    result.addText(symbols.subtract);
    
  } else if (result.beforeSel(4) === 'sqr' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-3);
    result.addText('2' + symbols.root);
    
  } else if (result.beforeSel(4) === 'roo' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-3);
    result.addText(symbols.root);
    
  } else if (e.key === '(') {
    
    result.addText(')');
    result.moveSel(-1);
    
  } else if (e.key === '=' || e.key === 'Enter') {
    
    e.preventDefault();
    
    // result
    
  }
  
});


document.addEventListener('paste', (e) => {

  e.preventDefault();
  
  let text = e.clipboardData.getData('text');
  text = text.replaceAll('\n','').replaceAll('\r','');

  calc.result.addText(text);

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



calc.result.setAttribute('contenteditable', 'plaintext-only');
calc.result.setAttribute('spellcheck', 'false');
calc.result.setAttribute('autocorrect', 'off');
calc.result.setAttribute('autocomplete', 'off');
calc.result.setAttribute('aria-autocomplete', 'list');
calc.result.setAttribute('autocapitalize', 'off');
calc.result.setAttribute('data-gramm', 'false');
calc.result.setAttribute('enterkeyhint', 'enter');

