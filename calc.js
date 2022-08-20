
let calc = {
  
  el: document.querySelector('.calc'),
  result: document.querySelector('.calc .header .number'),
  buttons: {},
  
  parser: {},
  
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  
  symbols: {
    multiply: '×',
    divide: '÷',
    add: '+',
    subtract: '-',
    percent: '%',
    dot: '.',
    pi: 'π',
    e: 'e',
    root: '√',
    comma: ',',
    factorial: '!',
    pow: ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹']
  },
  
  words: ['hyp', 'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'ln', 'log10', 'rand'],
  
  powMode: false
  
};



calc.parser.parse = (formula) => {
  
  const parser = calc.parser;
  const numbers = calc.numbers;
  const symbols = calc.symbols;
  const words = calc.words;
  
  formula = formula.replaceAll(' ', '');


  const root = parser.find(symbols.root, formula);
  
  root.forEach(rootIndex => {
    
    let rootStrength = parser.findNumberBefore(rootIndex, formula);
    if (!rootStrength) rootStrength = 2;
    
    let rootValue = parser.findNumberAfter(rootIndex, formula);
    if (!rootValue) return 'NaN';

    formula = parser.remove(-rootStrength.length, rootIndex, formula);    
    formula = parser.remove(symbols.root.length + rootValue.length, rootIndex, formula);
    
    formula = parser.insert('Math.pow(' + rootValue + ',1/' + rootStrength + ')', rootIndex, formula);
    
  });
  

  /*
  symbols.pow.forEach((symbol, index) => {
    
    formula = formula.replaceAll(symbol, index + 'pow');
    
  });
  */
  
  
  words.forEach(word => {
    
    if (word === 'hyp') {
      
      formula = formula.replaceAll(word, 'Math.hypot');
      
    } else if (word === 'ln') {
      
      formula = formula.replaceAll(word, 'Math.log');
      
    } else if (word === 'rand') {
      
      formula = formula.replaceAll(word, 'Math.random');
      
    } else {
    
      formula = formula.replaceAll(word, 'Math.' + word);
      
    }
    
  });
  
  
  formula = formula.replaceAll(symbols.multiply, '*');
  formula = formula.replaceAll(symbols.divide, '/');
  formula = formula.replaceAll(symbols.percent, '/100');
  formula = formula.replaceAll(symbols.pi, 'Math.PI');
  formula = formula.replaceAll(symbols.e, 'Math.E');
  
  
  console.log(formula);
  return formula;

}


calc.parser.find = (searchStr, sourceStr) => {
  
  return [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
  
}

calc.parser.insert = (subStr, index, str) => {
  
  return str.slice(0, index) + subStr + str.slice(index);
  
}

calc.parser.remove = (offset, index, str) => {
  
  if (offset > 0) {
  
    str = str.slice(0, index) + str.slice(index + offset);
    
  } else {
    
    str = str.slice(0, index + offset) + str.slice(index);
    
  }
  
  return str;
    
}


calc.parser.findNumberBefore = (index, str) => {
  
  const parser = calc.parser;
  const allowedChars = parser.allowedChars();
  
  let number = '';
  
  for (let i = index - 1; i >= 0; i--) {

    const char = str[i];

    if (!allowedChars.includes(char) &&
        !parser.wordBefore(i, str)) break;

    number += char;

  }
  
  if (number === '') return null;
  
  return number;
  
}

calc.parser.findNumberAfter = (index, str) => {
  
  const allowedChars = calc.parser.allowedChars();
  
  let number = '';

  for (let i = index - 1; i < str.length; i++) {

    const char = str[i];

    if (!allowedChars.includes(char) &&
        !parser.wordBefore(i, str)) break;

    number += char;

  }
  
  if (number === '') return null;
  
  return number;
  
}


calc.parser.wordBefore = (index, str) => {
  
  const words = calc.words;
  
  let subStr = str.slice(index - 4, index - 1);
  
  if (words.includes(subStr)) return true;
  
  subStr = str.slice(index - 5, index - 1);
  
  if (words.includes(subStr)) return true;
  
  return false;
  
}


calc.parser.factorial = (n) => {
  
  let res = 1;

  for (let i = 2; i <= n; i++) {
    res = res * i;
  }
  
  return res;
  
}


calc.parser.allowedChars = () => {
  
  let allowedChars = Object.values(calc.symbols);
  allowedChars.pop();
  
  allowedChars = [...calc.numbers, ...calc.symbols.pow, ...allowedChars];
  
  return allowedChars;
  
}


calc.parser.run = (formula) => {
  
  let result = NaN;
  
  try {
    
    result = eval(formula);
    result = Number(result);
    
  } catch(e) {}
  
  return result;
  
}


calc.calculate = () => {
  
  let formula = calc.result.textContent;
  
  formula = calc.parser.parse(formula);
  
  const result = calc.parser.run(formula);
  
  calc.result.textContent = result;
  calc.result.moveSelToEnd();
  
}



calc.buttons = calc.el.querySelectorAll('.button');

calc.buttons.forEach(button => {
    
  if (button.classList.contains('number')) {
    
    button.type = 'literal';
    button.name = button.textContent;
    
  } else if (button.classList.contains('text')) {
    
    button.type = 'function-brackets';
    button.name = button.textContent;
    
  } else {
    
    button.type = 'function';
    button.name = button.classList.value.replace('button', '').replace('hide-on-shift', '').replace('show-on-shift', '').replaceAll(' ','');
    
  }
  
  
  button.addEventListener('click', () => {
    
    const result = calc.result;
    const symbols = calc.symbols;
    const words = calc.words;
    
    result.focus();
    
    
    if (button.classList.contains('show-on-shift')) {
      
      calc.el.classList.remove('shift');
      
    }
    
    
    if (button.type === 'literal') {
      
      if (!calc.powMode || !symbols.pow[button.name]) {
        
        result.addText(button.name);
        
      } else {
        
        result.addText(symbols.pow[button.name]);
        
      }
      
    } else if (button.type === 'function-brackets') {
      
      result.addText(button.name + '()');
      result.moveSel(-1);
      
    } else {
      
      if (button.name === 'clear') {
        
        result.textContent = '';
        
      } else if (button.name === 'backspace') {
        
        if (result.beforeSel(1) === '(' &&
            result.afterSel(1) === ')') {
          
          result.moveSel(1);
          result.removeText(-1);
            
        }
        
        
        if (result.beforeSel(3) === 'NaN') {
          
          result.removeText(-2);
          
        } else if (result.beforeSel(2) === 'ln') {
          
          result.removeText(-1);
          
        } else if (result.beforeSel(5) === 'log10') {
          
          result.removeText(-4);
          
        } else {
          
          let wordBefore = result.beforeSel(3);
          
          if (words.includes(wordBefore)) {
          
            result.removeText(-2);
            
          } else {
          
            wordBefore = result.beforeSel(4);
          
            if (words.includes(wordBefore)) {
          
              result.removeText(-3);
          
            }
            
          }
          
        }
        
        
        result.removeText(-1);
        
      } else if (button.name === 'brackets') {
        
        result.addText('()');
        result.moveSel(-1);
        
      } else if (button.name === 'percent') {
         
        result.addText(symbols.percent);
        
      } else if (button.name === 'dot') {
         
        result.addText(symbols.dot);
        
      } else if (button.name === 'multiply') {
        
        result.addText(symbols.multiply);
        
      } else if (button.name === 'divide') {
        
        result.addText(symbols.divide);
        
      } else if (button.name === 'add') {
        
        result.addText(symbols.add);
        
      } else if (button.name === 'subtract') {
        
        result.addText(symbols.subtract);
        
      } else if (button.name === 'root2') {
        
        result.addText('2' + symbols.root);
        
      } else if (button.name === 'root3') {
        
        result.addText('3' + symbols.root);
        
      } else if (button.name === 'root') {
        
        result.addText(symbols.root);
        
      } else if (button.name === 'pow2') {
        
        result.addText(symbols.pow[2]);
        
      } else if (button.name === 'pow3') {
        
        result.addText(symbols.pow[3]);
        
      } else if (button.name === 'pow') {
        
        calc.powMode = !calc.powMode;
        button.classList.toggle('active');
        
      } else if (button.name === 'pi') {
         
        result.addText(symbols.pi);
        
      } else if (button.name === 'e') {
         
        result.addText(symbols.e);
        
      } else if (button.name === 'comma') {
         
        result.addText(symbols.comma);
        
      } else if (button.name === 'factorial') {
         
        result.addText(symbols.factorial);
        
      } else if (button.name === 'shift') {
         
        calc.el.classList.toggle('shift');
        
      } else if (button.name === 'equals') {
        
        calc.calculate();
        
      }
      
    }
        
  });
    
});


document.addEventListener('keydown', (e) => {
  
  const result = calc.result;
  const symbols = calc.symbols;
  const words = calc.words;
  
  if (!result.focused()) result.focus();
  
  
  if (e.key !== 'Alt') {
    
    calc.el.classList.remove('shift');
    
  } else {
    
    calc.el.classList.add('shift');
    
  }
  
  
  if (!calc.powMode || !symbols.pow[e.key]) {
    
    if (e.key === 'Backspace' &&
        result.selCollapsed()) {
      
      if (result.beforeSel(1) === '(' &&
          result.afterSel(1) === ')') {
          
        result.moveSel(1);
        result.removeText(-1);
          
      }
      
      
      if (result.beforeSel(3) === 'NaN') {
        
        result.removeText(-2);
        
      } else if (result.beforeSel(2) === 'ln') {
          
        result.removeText(-1);
          
      } else if (result.beforeSel(5) === 'log10') {
          
        result.removeText(-4);
          
      } else {
        
        let wordBefore = result.beforeSel(3);
        
        if (words.includes(wordBefore)) {
        
          result.removeText(-2);
          
        } else {
        
          wordBefore = result.beforeSel(4);
        
          if (words.includes(wordBefore)) {
        
            result.removeText(-3);
        
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
      
    } else if (e.key === '–') {
      
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
      
    } else if (result.beforeSel(2) === 'po' && e.key === 'w') {
      
      e.preventDefault();
      result.removeText(-2);
      
      calc.powMode = !calc.powMode;
      calc.el.querySelector('.button.pow').classList.toggle('active');
      
    } else if (result.beforeSel(1) === 'p' && e.key === 'w') {
      
      e.preventDefault();
      result.removeText(-1);
      
      calc.powMode = !calc.powMode;
      calc.el.querySelector('.button.pow').classList.toggle('active');
      
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
      
      calc.calculate();
      
    }
    
  } else {
    
    e.preventDefault();
    
    result.addText(symbols.pow[e.key]);

  }
  
});


document.addEventListener('keyup', (e) => {

  if (e.key === 'Alt') {

    calc.el.classList.remove('shift');

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

