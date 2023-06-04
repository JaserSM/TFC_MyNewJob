from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
import os

absolute_path = os.path.dirname(__file__)
relative_path_1 = 'configs/ConfigDB.txt'
configDB = os.path.join(absolute_path, relative_path_1)

def user():
    USER = ''
    contador = 1
    with open(configDB) as archivo:
        for linea in archivo:
            if contador == 1:
                USER = linea.replace('\n','')
            contador += 1
    return USER

def password():
    PASSWORD = ''
    contador = 1
    with open(configDB) as archivo:
        for linea in archivo:
            if contador == 2:
                PASSWORD = linea
            contador += 1
    return PASSWORD

USER = user()
PASSWORD = password()
print('USER: ', USER)
print('PASSWORD: ', PASSWORD)

engine=create_engine("postgresql+psycopg2://" + USER + ":" + PASSWORD + "@localhost/job_offers",
                     echo=False)
Base=declarative_base()

SessionLocal=sessionmaker(bind=engine)