import time
from datetime import datetime

from selenium.webdriver import Keys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from job_offer import JobOffer
from models_to_db import insert_job, insert_company, getJobByLink, insert_tech, insert_job_tech
from company import Company
from technology import Tech
from job_tech import JobTech


portal_empleo = list()
cargos = list()
empresas = list()
ubicaciones = list()
salarios = list()
jornadas = list()
contratos = list()
beneficios = list()
cualificaciones = list()
descripciones = list()


def scraping_indeed(options, keywords):
    # Adding argument to disable the AutomationControlled flag
    options.add_argument("--disable-blink-features=AutomationControlled")

    # Exclude the collection of enable-automation switches
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    # Turn-off userAutomationExtension
    options.add_experimental_option("useAutomationExtension", False)

    # Setting the driver path and requesting a page
    driver = webdriver.Chrome(options=options)

    # Changing the property of the navigator value for webdriver to undefined
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    time.sleep(2)
    driver.get("https://es.indeed.com/")
    time.sleep(4)

    # REALIZAMOS LA BÚSQUEDA
    input_search = driver.find_element(By.XPATH,
                                       "/html/body//div[contains(@id, 'jobsearch-Main')]//div[contains(@class, 'yosegi-InlineWhatWhere-searchBox')]/div[1]//input")
    input_search.send_keys(keywords[0])
    time.sleep(2)
    input_search.send_keys(Keys.ENTER)

    time.sleep(25)

    # OBTENEMOS LOS RESULTADOS
    portal_empleo_list = list()
    link_list = list()
    cargo_list = list()
    experiencia_list = list()
    fecha_list = list()
    empresa_list = list()
    empresa_link_list = list()
    ubicacion_list = list()
    salario_list = list()
    contrato_list = list()
    requisitos_list = list()
    descripcion_list = list()

    list_provisional_link = list()

    # ----- HACEMOS SCROLL HASTA ABAJO PARA CARGAR TODA LA INFORMACIÓN -----

    # element = driver.find_element_by_id("my-id")

    # actions = ActionChains(driver)
    # actions.move_to_element(element).perform()

    # driver.execute_script("arguments[0].scrollIntoView();", element)
    last_page = False
    contador = 1
    while last_page != True:
        time.sleep(2)

        listado = driver.find_elements(By.XPATH, "/html/body/main/div/div[1]/div/div/div[5]/div[1]/div[5]/div/ul/li")
        print('número de ofertas: ', len(listado))

        for li in listado:

            try:
                print('\n---- OFERTA: ', contador, '----')
                """print(li.text)
                driver.execute_script("arguments[0].scrollIntoView();", li)
                time.sleep(2)
                li.click()
                time.sleep(4)
                contador += 1"""

                driver.execute_script("arguments[0].scrollIntoView();", li)
                time.sleep(1)
                provisional_link = li.find_element(By.XPATH, ".//a").get_attribute('href')
                print(provisional_link,'\n')
                list_provisional_link.append(provisional_link)

                contador += 1

            except:
                print('NO ES UNA OFERTA')

        navigation = driver.find_element(By.XPATH, ".//nav[@role = 'navigation']")
        pages = navigation.find_elements(By.XPATH, "./div")

        next_page = pages[len(pages) - 1]

        try:
            next = next_page.find_element(By.XPATH, "./a").get_attribute('href')
            driver.get(next)
            time.sleep(6)
        except:
            last_page = True
            print('No more pages')


    # titulos.append(li.find_element(By.XPATH, "./h2[contains(@class, 'jobTitle')]"))
    print('lista de links: ', len(list_provisional_link))
    for li in list_provisional_link:
        driver.get(li)
        time.sleep(4)
        divMain = WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.XPATH, ".//div[@role = 'main']")))
        link = driver.current_url
        link_list.append(link)

        divMain = driver.find_element(By.XPATH, ".//div[@role = 'main']//div[contains(@class, 'jobsearch-JobComponent')]")

        title = divMain.find_element(By.XPATH, './/h1').text
        cargo_list.append(title)

        portal_empleo_list = list()
        link_list = list()
        experiencia_list = list()
        fecha_list = list()
        empresa_list = list()
        empresa_link_list = list()
        ubicacion_list = list()
        salario_list = list()
        contrato_list = list()
        requisitos_list = list()
        descripcion_list = list()



def scraping_tecnoempleo(options, keywords):
    str_salary = None
    ubicacion = None
    contrato = None
    experiencia = None
    for WORD in keywords:
        driver = webdriver.Chrome(options=options)
        driver.get("https://www.tecnoempleo.com/")

        jobs = list()

        portal_empleo_list = list()
        link_list = list()
        cargo_list = list()
        experiencia_list = list()
        fecha_list = list()
        empresa_list = list()
        empresa_link_list = list()
        ubicacion_list = list()
        salario_list = list()
        contrato_list = list()
        requisitos_list = list()
        descripcion_list = list()

        # REALIZAMOS LA BÚSQUEDA
        input_search = driver.find_element(By.XPATH,
                                           "/html/body/div[@id = 'wrapper']/section[1]/div[@class = 'container']/form//input")
        # print(input_search.text)
        time.sleep(1)
        input_search.send_keys(WORD)
        time.sleep(2)
        input_search.send_keys(Keys.ENTER)
        time.sleep(2)

        # OBTENEMOS LOS RESULTADOS
        container = driver.find_element(By.XPATH,
                                        "/html/body/div[@id = 'wrapper']/div[@class = 'bg-light']/div[@class = 'container']/div[@class = 'row']/div[2]")
        listado = container.find_elements(By.XPATH, "./a")
        print('número de ofertas: ', len(listado))
        contador = 1
        time.sleep(2)

        for li in listado:
            oferta = container.find_element(By.XPATH,
                                            "./div[contains(@class, 'p-2 border-bottom py-3')][{}]".format(contador))

            try:
                print('\n---- OFERTA: ', contador, '----')
                contador += 1
                print(li.get_attribute('id'))
                driver.execute_script("arguments[0].scrollIntoView();", li)
                time.sleep(2)

                link = oferta.find_element(By.XPATH,
                                           "./div[contains(@class, 'row')]/div[3]/h3/a").get_attribute('href')
                print('--> LINK OFERTA: ', link)
                link = link.split('www.tecnoempleo.com/')[1]
                link_list.append(link)

                cargo = oferta.find_element(By.XPATH,
                                            "./div[contains(@class, 'row')]/div/h3").text
                print('--> CARGO: ', cargo)
                cargo_list.append(cargo)

                empresa = oferta.find_element(By.XPATH,
                                              "./div[contains(@class, 'row')]/div[3]/a").text
                print('--> EMPRESA: ', empresa)
                empresa_list.append(empresa)

                empresa_link = oferta.find_element(By.XPATH,
                                                   "./div[contains(@class, 'row')]/div[3]/a").get_attribute('href')
                print('--> EMPRESA LINK: ', empresa_link)
                empresa_link_list.append(empresa_link)

                info_lateral = oferta.find_element(By.XPATH, "./div[contains(@class, 'row')]/div[4]").text

                fecha = info_lateral.split('\n')[0]
                fecha = fecha.split(' ')[0]
                print('--> FECHA: ', fecha)
                fecha_list.append(fecha)

                año = int(fecha.split('/')[2])
                mes = int(fecha.split('/')[1])
                dia = int(fecha.split('/')[0])
                print('offer_date(',año,'-',mes,'-',dia,')')

                company = Company(name=empresa)
                print(company)
                company_id = insert_company(company)

                job = JobOffer(link=link, web=2, company=company_id, position=cargo, offer_date=datetime(año, mes, dia))
                print(job)
                insert_job(job)

            except Exception as ex:
                print(ex)
                print('NO ES UNA OFERTA')

        for link in link_list:
            job = getJobByLink(link)
            url = 'https://www.tecnoempleo.com/' + job.link

            driver.get(url)
            time.sleep(4)
            WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.XPATH, ".//div[@class = 'container']")))

            datos_principales = driver.find_element(By.XPATH, ".//div[@class = 'container']//div[@class = 'row col-border']/div[2]")
            print(datos_principales.text)

            experience = 0
            datos_principales = datos_principales.find_elements(By.XPATH, ".//ul/li")
            for data in datos_principales:
                str_salary = None
                ubicacion = None
                contrato = None
                experiencia = None
                try:
                    _span = data.find_element(By.XPATH, "./span[2]").text
                    if _span == 'Ubicación':
                        ubicacion = data.find_element(By.XPATH, "./span[1]").text
                        print(' --- UBICACIÓN: ', ubicacion)

                    if _span == 'Experiencia':
                        experiencia = data.find_element(By.XPATH, "./span[1]").text
                        experiencia = experiencia.replace(' ', '')
                        print(experiencia)
                        for s in experiencia:
                            if s.isdigit():
                                experience = s
                                break
                        print(' --- EXPERIENCIA: ', experience)

                    if _span == 'Salario':
                        salario = data.find_element(By.XPATH, "./span[1]").text
                        salario = salario.replace(' ', '')
                        str_salary = ''
                        print(salario)
                        for s in salario:
                            #print(s)
                            if s.isdigit():
                                #print(s)
                                str_salary += str(s)
                            if s == '-':
                                #print(s)
                                str_salary += '-'
                        print(' --- SALARIO: ', str_salary)

                    if _span == 'Tipo contrato':
                        contrato = data.find_element(By.XPATH, "./span[1]").text
                        print(' --- CONTRATO: ', contrato)
                except:
                    print(' --- TECHS ')
                    try:
                        techs = data.find_elements(By.XPATH, "./span/a")
                        for tech in techs:
                            tecnologia = Tech(name=tech.text)
                            id_tech = insert_tech(tecnologia)
                            job_tech = JobTech(offer_id=job.id , tech_id=id_tech)
                            insert_job_tech(job_tech)
                    except:
                        pass
            descripcion = driver.find_element(By.XPATH, ".//div[@class = 'container']//div[@itemprop = 'description']")
            descripcion = descripcion.find_element(By.XPATH, "./p").text


            job.position = job.position
            job.offer_date = job.offer_date
            job.scraping_date = datetime.now()
            if str_salary != None:
                job.salary = str_salary
            if ubicacion != None:
                job.location = ubicacion
            if contrato != None:
                job.contract = contrato
            if experiencia != None:
                job.experience = experience
            if descripcion != None:
                job.description = descripcion
            insert_job(job)
            time.sleep(2)


def scraping_infoempleo(options, keywords):
    portal_empleo_list = list()
    link_list = list()
    cargo_list = list()
    experiencia_list = list()
    fecha_list = list()
    empresa_list = list()
    empresa_link_list = list()
    ubicacion_list = list()
    salario_list = list()
    contrato_list = list()
    requisitos_list = list()
    descripcion_list = list()


    driver = webdriver.Chrome(options=options)
    driver.get("https://www.infoempleo.com/")
    time.sleep(6)
    # REALIZAMOS LA BÚSQUEDA
    input_search = driver.find_element(By.XPATH,
                                       "/html/body//div[@class='header-rest']//input[@name='search']")
    input_search.send_keys(keywords[0])
    time.sleep(4)
    input_search.send_keys(Keys.ENTER)
    time.sleep(6)

    # botonCookies
    driver.find_element(By.XPATH,
                        "/html/body//div[@id='onetrust-button-group']//button[@id='onetrust-accept-btn-handler']").click()

    time.sleep(2)
    # mensaje recibir ofertas
    try:
        driver.find_element(By.XPATH,
                            "/html/body//div[@id='lightbox-wrapper']//span[@class='close']").click()
    except:
        pass

    time.sleep(2)
    container = driver.find_element(By.XPATH, "/html/body//div[@class='sticky-container sticky']")
    time.sleep(1)

    lista_ofertas = container.find_elements(By.XPATH, "./ul/li")
    time.sleep(1)

    contador = 1
    for oferta in lista_ofertas:
        time.sleep(2)
        try:
            print('\n---- OFERTA: ', contador, '----')
            print(oferta.text)
            print('UBICACIÓN: ', oferta.text.split('\n')[2])
            ubicacion = oferta.text.split('\n')[2]
            contador += 1
            print(oferta.get_attribute('id'))
            driver.execute_script("arguments[0].scrollIntoView();", oferta)
            #time.sleep(1)
            title = oferta.find_element(By.XPATH, "./h2[@class='title']")

            print(title.text)
            cargo_list.append(title.text)
            #time.sleep(1)

            link = title.find_element(By.XPATH, "./a").get_attribute('href')
            print(link)
            link_list.append(link)
            #time.sleep(1)
            link = link.split('infoempleo.com/ofertasdetrabajo/')[1]
            print(link)

            empresa = oferta.find_element(By.XPATH, "./p[@class='block']").text
            print(empresa)
            #time.sleep(1)

            company = Company(name=empresa)
            print(company)
            company_id = insert_company(company)
            #time.sleep(1)

            myDate = datetime.now()
            print(myDate)
            #time.sleep(1)

            horas = oferta.find_element(By.XPATH, "./p[@class='block'][2]").text
            print(horas)
            #time.sleep(1)
            horas = horas.split(' ')[1]
            print(horas)

            """myDate = datetime.now()
            result = (myDate.hour - int(horas))
            if 0 > result > (-24):
                myDate = myDate.replace(day=(myDate.day - 1))
            elif -24 > result > (-48):
                myDate = myDate.replace(day=(myDate.day - 2))
            elif -48 > result > (-72):
                myDate = myDate.replace(day=(myDate.day - 3))
            else:
                myDate = myDate.replace(day=(myDate.day - 4))"""

            myDate = datetime.now()
            if int(horas) > myDate.hour:
                newHoras = int(horas) - myDate.hour
                contador_dias = 1
                while newHoras >= 24:
                    newHoras -= 24
                    contador_dias += 1
                HoraFinal = 24 - newHoras
                myDate = myDate.replace(hour=HoraFinal)
                myDate = myDate.replace(day=(myDate.day - contador_dias))
            else:
                myDate = myDate.replace(hour=(myDate.hour - int(horas)))
                
            print(myDate)
            time.sleep(1)

            job = JobOffer(link=link, web=1, company=company_id, position=title.text, offer_date=myDate, location=ubicacion)
            print(job)
            insert_job(job)
        except Exception as ex:
            print(ex)

    time.sleep(6)
    for link in link_list:
        experiencia = None
        descripcion = None
        salario = ''
        contrato = None

        driver.get(link)
        time.sleep(6)

        print('\n OFERTA:')
        ul_list = driver.find_elements(By.XPATH, "//div[@class='offer-excerpt']/ul")

        cont = 1
        for ul in ul_list:
            li_list = ul.find_elements(By.XPATH, "./li")

            for li in li_list:
                h3 = li.find_element(By.XPATH, "./h3").text
                print(h3)
                p = li.find_element(By.XPATH, "./p").text
                print(p)
                if h3 == 'Experiencia':
                    for c in p:
                        if c.isdigit():
                            experiencia = int(c)
                            break
                elif h3 == 'Salario':
                    digitos = False
                    for _s in p:
                        print(_s)
                        if _s.isdigit():
                            salario += str(_s)
                            digitos = True
                        else:
                            if _s != '.' and digitos == True:
                                break
                    print(' --- SALARIO: ', salario)
                elif h3 == 'Contrato':
                    contrato = p

        descripcion = driver.find_element(By.XPATH, "//div[@class='offer']").text
        print(descripcion)

        url = link.split('infoempleo.com/ofertasdetrabajo/')[1]
        job = getJobByLink(url)

        if salario != None and salario != '':
            job.salary = salario
        if contrato != None:
            job.contract = contrato
        if experiencia != None:
            job.experience = experiencia
        if descripcion != None:
            job.description = descripcion

        print(job)
        insert_job(job)
        time.sleep(2)


    # OBTENEMOS LOS RESULTADOS


def scraping_infojobs(options, keywords):
    driver = webdriver.Chrome(options=options)
    driver.get("https://www.infojobs.net/")
    time.sleep(40)
    # REALIZAMOS LA BÚSQUEDA
    input_search = driver.find_element(By.XPATH,
                                       "/html/body//div[contains(@class, 'search-bar-main')]//input[@id='palabra']")
    input_search.send_keys(keywords[0])
    time.sleep(4)
    input_search.send_keys(Keys.ENTER)
    time.sleep(1)
    input_search.send_keys(Keys.ENTER)
    time.sleep(6000)

    # OBTENEMOS LOS RESULTADOS
