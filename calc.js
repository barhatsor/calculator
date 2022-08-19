
let calc = {
  
  el: document.querySelector('.calc'),
  result: document.querySelector('.calc .header .number'),
  buttons: {},
  
  symbols: {
    multiply: '×',
    divide: '÷',
    add: '+',
    subtract: '−',
    percent: '%',
    pi: 'π',
    e: 'e',
    root: '√',
    pow: ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹']
  },
  
  words: ['hyp', 'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh']
  
};


calc.buttons = calc.el.querySelectorAll('.button');

calc.buttons.forEach(button => {
    
  if (button.classList.contains('number')) {
    
    button.type = 'literal';
    button.title = button.textContent;
    
  } else if (button.classList.contains('text')) {
    
    button.type = 'function-brackets';
    button.title = button.textContent;
    
  } else {
    
    button.type = 'function';
    button.title = button.classList.value.replace('button', '').replaceAll(' ','');
    
  }
  
  
  button.addEventListener('click', () => {
    
    const result = calc.result;
    const symbols = calc.symbols;

    const resultText = result.textContent;
    
    result.focus();
    
    if (button.type === 'literal') {
      
      result.addText(button.title);
      
    } else if (button.type === 'function-brackets') {
      
      result.addText(button.title + '()');
      result.moveSel(-1);
      
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
         
        result.addText(symbols.percent);
        
      } else if (button.title === 'multiply') {
        
        result.addText(symbols.multiply);
        
      } else if (button.title === 'divide') {
        
        result.addText(symbols.divide);
        
      } else if (button.title === 'add') {
        
        result.addText(symbols.add);
        
      } else if (button.title === 'subtract') {
        
        result.addText(symbols.subtract);
        
      } else if (button.title === 'root2') {
        
        result.addText('2' + symbols.root);
        
      } else if (button.title === 'root3') {
        
        result.addText('3' + symbols.root);
        
      } else if (button.title === 'root') {
        
        result.addText(symbols.root);
        
      } else if (button.title === 'pow2') {
        
        result.addText(symbols.pow[2]);
        
      } else if (button.title === 'pow3') {
        
        result.addText(symbols.pow[3]);
        
      } else if (button.title === 'pow3') {
        
        button.classList.toggle('active');
        // toggle pow mode
        
      } else if (button.title === 'pi') {
         
        result.addText(symbols.pi);
        
      } else if (button.title === 'e') {
         
        result.addText(symbols.e);
        
      }
      
    }
        
  });
    
});


document.addEventListener('keydown', (e) => {
  
  const result = calc.result;
  const symbols = calc.symbols;
  const words = calc.words;
  
  if (!result.focused()) result.focus();
  
  if (e.key === 'Backspace' &&
      result.selCollapsed()) {
    
    if (result.afterSel(1) === ')') {
      
      result.removeText(1);

    }
    
    
    if (result.beforeSel(3) === 'NaN') {
      
      result.removeText(-2);
      
    } else {
      
      let wordBefore = result.beforeSel(4).slice(0, -1);
      
      if (words.includes(wordBefore)) {
      
        result.removeText(-3);
        
      } else {
      
        wordBefore = result.beforeSel(5).slice(0, -1);
      
        if (words.includes(wordBefore)) {
      
          result.removeText(-4);
      
        }
        
      }
      
    }
    
  } else if ((e.key === 'x' || e.key === 'X' ||
             e.key === '*') && !(e.metaKey || e.ctrlKey)) {
        
    e.preventDefault();
    result.removeText();
    result.addText(symbols.multiply);
    
  } else if (e.key === '/') {
    
    e.preventDefault();
    result.removeText();
    result.addText(symbols.divide);
    
  } else if (e.key === '-' || e.key === '–') {
    
    e.preventDefault();
    result.removeText();
    result.addText(symbols.subtract);
    
  } else if (result.beforeSel(3) === 'sqr' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-3);
    result.addText('2' + symbols.root);
    
  } else if (result.beforeSel(2) === 'sq' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-2);
    result.addText('2' + symbols.root);
    
  } else if (result.beforeSel(3) === 'roo' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-3);
    result.addText(symbols.root);
    
  } else if (result.beforeSel(1) === 'r' && e.key === 't') {
    
    e.preventDefault();
    result.removeText(-1);
    result.addText(symbols.root);
    
  } else if (result.beforeSel(1) === 'p' && e.key === 'i') {
    
    e.preventDefault();
    result.removeText(-1);
    result.addText(symbols.pi);
    
  } else if (e.key === '(') {
    
    if (!result.selCollapsed()) {
      
      e.preventDefault();
      
      const text = '(' + result.getSelText() + ')';
      result.removeText();
      
      result.addText(text);
      result.moveSel(-1);
      
    } else {
    
      result.addText(')');
      result.moveSel(-1);
      
    }
    
  } else if (e.key === 'C') {
    
    e.preventDefault();
    result.textContent = '';
    
  } else if (e.key === '=' || e.key === 'Enter') {
    
    e.preventDefault();
    
    // result
    
  }
  
});


document.addEventListener('paste', (e) => {

  e.preventDefault();
  
  let text = e.clipboardData.getData('text');
  text = text.replaceAll('\n','').replaceAll('\r','');
  
  const symbols = calc.symbols;
  
  text = text.replaceAll('*', symbols.multiply);
  text = text.replaceAll('x', symbols.multiply);
  text = text.replaceAll('X', symbols.multiply);
  text = text.replaceAll('/', symbols.multiply);
  text = text.replaceAll('-', symbols.subtract);
  text = text.replaceAll('–', symbols.subtract);
  text = text.replaceAll('=', '');

  calc.result.addText(text);

});


calc.result.getSel = () => {

  const selection = window.getSelection();
  let start = selection.baseOffset;
  let end = selection.extentOffset;
  
  if (start > end) {
    
    let tempStart = start;
    start = end;
    end = tempStart;
    
  }
  
  return [start, end];

}

calc.result.setSel = (startPos, endPos = startPos) => {

  const selection = window.getSelection();
  const resultNode = calc.result.childNodes[0];
  
  selection.setBaseAndExtent(resultNode, startPos, resultNode, endPos);

}


calc.result.moveSel = (charsToMove) => {

  const [, pos] = calc.result.getSel();
    
  calc.result.setSel(pos + charsToMove);

}

calc.result.moveSelToEnd = () => {
  
  calc.result.setSel(calc.result.textContent.length);
  
}


calc.result.beforeSel = (offset = null) => {
  
  const [pos] = calc.result.getSel();
  
  const resultText = calc.result.textContent;
  
  if (offset) {
    
    return resultText.slice(pos - offset, pos);
  
  } else {
    
    return resultText.slice(0, pos);
    
  }
  
}

calc.result.afterSel = (offset = null) => {
  
  const [, pos] = calc.result.getSel();
  
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
  const [, pos] = calc.result.getSel();
  
  const resultText = result.beforeSel() + text + result.afterSel();
  calc.result.textContent = resultText;
  
  calc.result.setSel(pos + text.length);
  
}

calc.result.removeText = (charsToRemove) => {
  
  const selection = window.getSelection();
  
  if (!calc.result.selCollapsed()) {
    
    let range = selection.getRangeAt(0);
    range.deleteContents();
    
  }
  
  if (charsToRemove) {
    
    const [pos] = calc.result.getSel();
    
    if (pos === 0) return;
    
    calc.result.setSel(pos, pos + charsToRemove);
    
  }
  
  let range = selection.getRangeAt(0);
  range.deleteContents();

}

calc.result.getSelText = () => {

  const selection = window.getSelection();
  const text = selection.toString();
  
  return text;

}



calc.result.setAttribute('contenteditable', 'plaintext-only');
calc.result.setAttribute('spellcheck', 'false');
calc.result.setAttribute('autocorrect', 'off');
calc.result.setAttribute('autocomplete', 'off');
calc.result.setAttribute('aria-autocomplete', 'list');
calc.result.setAttribute('autocapitalize', 'off');
calc.result.setAttribute('data-gramm', 'false');
calc.result.setAttribute('enterkeyhint', 'enter');

