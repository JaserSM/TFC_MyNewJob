const fs = require('fs')

const PATH = './resources/app/scraping_1/configs/ConfigScraping.txt'
const PATH_DB = './resources/app/scraping_1/configs/ConfigDB.txt'
let visible = false
const btnSave = document.getElementById('btn_config_scraping_save')
const browserSwitch = document.getElementById('browser_switch')
const positions_editor = document.getElementById('positions_editor')
const userInput = document.getElementById('user_input')
const passwordInput = document.getElementById('password_input')
const btnSaveDB = document.getElementById('btn_config_db_save')

let positions_list = []
let config_data = ''

readConfigScraping(PATH)
readConfigDB(PATH_DB)

btnSave.addEventListener('click', () => {
  writeConfigScrapingData(PATH) 
})
btnSaveDB.addEventListener('click', () => {
  writeConfigDBData(PATH_DB) 
})

function readConfigScraping(path) {
  let str_positions = ''
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    let data_list = data.split('\n')
    let linea = 1
    
    for (const data of data_list) {
      console.log(linea + ' - ' + data)
      let word = data.split('-')[1]
      if (linea == 2) {
        console.log(word)
        if (word == 'true') {
          visible = true
        } else if (word == 'false') {
          visible = false
        } else {
          console.log('ERROR READING config.txt')
        }
      }
      if (linea > 4) {
        console.log(word)
        if (word != undefined) {
          positions_list.push(word)
        }
      }
      linea += 1
    }
    console.log(visible)
    if (visible == true){
      browserSwitch.toggled = true
    } else {
      browserSwitch.toggled = false
    }

    let lengthList = positions_list.length
    let cont = 1
    for (const word of positions_list) {
      if (cont == lengthList) {
        str_positions += word
      } else {
        str_positions += word + ', '
      }
      cont += 1
    }
    positions_editor.value = str_positions
  })
}
function readConfigDB(pathDB) {
  fs.readFile(pathDB, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    let data_list = data.split('\n')
    let linea = 1
    
    for (const data of data_list) {
      console.log(data)
      if (linea == 1) {
        userInput.value = data
      }
      if (linea == 2) {
        passwordInput.value = data
      }
      linea += 1
    }
  })
}


function writeConfigScrapingData(path) {
  config_data = ''
  if (browserSwitch.toggled == true){
    visible = true
  } else {
    visible = false
  }
  config_data += '# visible:\n' + '-' + visible.toString() + '\n\n' + '# words:' + '\n'
  let str = positions_editor.value
  let words = str.split(',')
  for (const word of words) {
    let finalWord = word 
    let primeraLetra = true
    for (const letra of word) {
      if (primeraLetra == true) {
        if (letra == ' ') {
          finalWord = finalWord.slice(1)
        } else {
          primeraLetra = false
        }
      }
    }
    if (word != '') {
      config_data += '-' + finalWord + '\n'
    }
  }
  fs.writeFile(path, config_data, function(err) {
    if (err) {
      return console.log(err);
    }
  
    console.log("The file was successfully updated");
  })
}
function writeConfigDBData(path) {
  config_data = ''
  let user = userInput.value
  let password = passwordInput.value

  config_data += user +'\n' + password

  fs.writeFile(path, config_data, function(err) {
    if (err) {
      return console.log(err);
    }
  
    console.log("The file was successfully updated");
  })
}


