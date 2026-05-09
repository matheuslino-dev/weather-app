# Weather App

## Resumo do Projeto / Project Overview

Este projeto é um aplicativo simples de previsão do tempo feito com Flask e OpenWeatherMap. Ele permite que você digite uma cidade, estado e país, e exibe o clima atual dessa localização.

This project is a simple weather forecast app built with Flask and the OpenWeatherMap API. It lets you enter a city, state, and country and shows the current weather for that location.

---

## Arquivos principais / Main files

### `app.py`

- Em português:
  - `app.py` é o servidor Flask.
  - Ele importa `Flask`, `render_template` e `request` do Flask.
  - Importa a função `main` do arquivo `weather.py` como `get_weather`.
  - Possui uma rota `/` que aceita `GET` e `POST`.
  - No `GET`, renderiza a página inicial sem dados.
  - No `POST`, lê os valores do formulário (`cityName`, `stateName`, `countryName`) e chama `get_weather(...)`.
  - Se a API não encontrar a cidade, define a mensagem de erro `City not found...`.
  - Por fim, renderiza `index.html` enviando `data` e `error`.

- In English:
  - `app.py` is the Flask server.
  - It imports `Flask`, `render_template`, and `request` from Flask.
  - It imports the `main` function from `weather.py` as `get_weather`.
  - It has a `/` route that accepts both `GET` and `POST`.
  - On `GET`, it renders the homepage with no data.
  - On `POST`, it reads the form values (`cityName`, `stateName`, `countryName`) and calls `get_weather(...)`.
  - If the API does not find the city, it sets an error message.
  - Finally, it renders `index.html` passing `data` and `error`.

### `weather.py`

- Em português:
  - `weather.py` contém a lógica que consulta a API do OpenWeatherMap.
  - Ele importa `requests` para fazer requisições HTTP.
  - Usa `python-dotenv` para carregar variáveis de ambiente do arquivo `.env`.
  - Lê a chave da API com `os.getenv('API_KEY')`.
  - Define um `@dataclass` chamado `WeatherData` para guardar `main`, `description`, `icon`, `temperature` e `timezone`.
  - A função `get_lat_lon(...)` chama o endpoint de geocodificação do OpenWeatherMap e retorna latitude e longitude.
  - Se a resposta da API estiver vazia, retorna `None`.
  - A função `get_current_weather(...)` chama o endpoint de clima atual usando `lat` e `lon`.
  - Constrói um objeto `WeatherData` com os dados retornados.
  - A função `main(...)` usa `get_lat_lon(...)` e `get_current_weather(...)` para retornar os dados do tempo.

- In English:
  - `weather.py` contains the logic that queries the OpenWeatherMap API.
  - It imports `requests` for HTTP requests.
  - It uses `python-dotenv` to load environment variables from the `.env` file.
  - It reads the API key with `os.getenv('API_KEY')`.
  - It defines a `@dataclass` named `WeatherData` to store `main`, `description`, `icon`, `temperature`, and `timezone`.
  - The function `get_lat_lon(...)` calls the OpenWeatherMap geocoding endpoint and returns latitude and longitude.
  - If the API response is empty, it returns `None`.
  - The function `get_current_weather(...)` calls the current weather endpoint using `lat` and `lon`.
  - It builds a `WeatherData` object with the returned data.
  - The function `main(...)` uses `get_lat_lon(...)` and `get_current_weather(...)` to return the weather data.

### `templates/index.html`

- Em português:
  - `index.html` é o modelo HTML usado pelo Flask.
  - Ele contém o formulário para digitar cidade, estado e país.
  - Os campos do formulário são enviados via `POST` para `/`.
  - Se `error` existir, exibe uma mensagem de erro.
  - Se `data` existir, mostra o clima com `main`, `description`, `icon` e `temperature`.
  - O ícone do tempo é carregado pelo URL `openweathermap.org/img/wn/...`.

- In English:
  - `index.html` is the HTML template used by Flask.
  - It contains the form to enter city, state, and country.
  - The form fields are sent via `POST` to `/`.
  - If `error` exists, it displays an error message.
  - If `data` exists, it shows the weather with `main`, `description`, `icon`, and `temperature`.
  - The weather icon is loaded from `openweathermap.org/img/wn/...`.

### `.env`

- Em português:
  - O arquivo `.env` guarda a chave secreta da API.
  - Ele não deve ser enviado para o GitHub se contiver segredos.
  - Um exemplo de conteúdo:
    ```env
    API_KEY=sua_chave_do_openweathermap
    ```

- In English:
  - The `.env` file stores the secret API key.
  - It should not be pushed to GitHub if it contains secrets.
  - Example contents:
    ```env
    API_KEY=your_openweathermap_key
    ```

---

## Como rodar / How to run

- Em português:
  1. Abra o terminal na pasta `weather-app`.
  2. Ative o ambiente virtual:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
  3. Instale dependências se necessário:
     ```powershell
     python -m pip install flask requests python-dotenv
     ```
  4. Crie o arquivo `.env` com sua chave da API.
  5. Rode:
     ```powershell
     python app.py
     ```
  6. Abra `http://127.0.0.1:5000` no navegador.

- In English:
  1. Open the terminal in the `weather-app` folder.
  2. Activate the virtual environment:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
  3. Install dependencies if needed:
     ```powershell
     python -m pip install flask requests python-dotenv
     ```
  4. Create the `.env` file with your API key.
  5. Run:
     ```powershell
     python app.py
     ```
  6. Open `http://127.0.0.1:5000` in your browser.

---

## Observações / Notes

- O `venv` é o ambiente virtual e não deve ser editado diretamente.
- O arquivo `app.py` apenas recebe dados do formulário e chama `weather.py`.
- A lógica de consulta à API está em `weather.py`.
- O design e a apresentação estão em `templates/index.html`.

- `venv` is the virtual environment and should not be edited directly.
- `app.py` only receives form data and calls `weather.py`.
- The API query logic is in `weather.py`.
- The design and presentation are in `templates/index.html`.


## Agradecimento

- Em português: Obrigado por conferir este projeto. Este aplicativo foi feito por Ilkini/Matheus Lino.
- In English: Thank you for reviewing this project. This app was made by Ilkini/Matheus Lino.
