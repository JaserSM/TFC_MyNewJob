#!/usr/bin/env python
from selenium.webdriver.chrome.options import Options
from metodos_scraping import scraping_infoempleo, scraping_tecnoempleo
import os


absolute_path = os.path.dirname(__file__)
relative_path_2 = 'configs/ConfigScraping.txt'
configScraping = os.path.join(absolute_path, relative_path_2)

def visibility():
    VISIBLE = False
    vis = False
    with open(configScraping) as archivo:
        for linea in archivo:
            l = linea.replace('\n', '')
            #print(l)
            if vis == True:
                if l.casefold() == '-true'.casefold():
                    VISIBLE = True
                else:
                    VISIBLE = False

            if l == '# visible:':
                vis = True
            elif l != '# visible:' and l != '':
                vis = False
    return VISIBLE

def keywords():
    KEYWORDS = []
    words = False
    with open(configScraping) as archivo:
        for linea in archivo:
            l = linea.replace('\n', '')
            if words == True:
                KEYWORDS.append(l.replace('-', ''))
            if l == '# words:':
                words = True
    return KEYWORDS

VISIBLE = visibility()
KEYWORDS = keywords()
print('VISIBILITY: ', VISIBLE)
print('KEYWORDS: ', KEYWORDS)

options = Options()

if VISIBLE:
    options.add_argument("start-maximized")
else:
    #options.add_experimental_option('detach', True)
    options.add_argument('--headless') # ACTIVAR PARA NO VER EL PROCESO DE SCRAPING


print(KEYWORDS)

if len(KEYWORDS)>0:

    #scraping_indeed(options, KEYWORDS)
    try:
        scraping_infoempleo(options, KEYWORDS)
    except Exception as ex:
        print(ex)

    try:
        scraping_tecnoempleo(options, KEYWORDS)
    except Exception as ex:
        print(ex)
    #scraping_infojobs(options, KEYWORDS)


