# Wybierz bazowy obraz, np. Python 3
FROM python:3.8

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki z bieżącego katalogu do katalogu roboczego w kontenerze
COPY ./requirements.txt /app

# Zainstaluj zależności (jeśli potrzebujesz)
RUN pip install -r requirements.txt

# Polecenie, które zostanie wykonane, gdy kontener zostanie uruchomiony
CMD ["pytest", "/app/test.py"]
