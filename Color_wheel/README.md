# Color Wheel

## Resumo do Projeto / Project Overview

Este projeto é uma aplicação web interativa de roda de cores HSV (Hue, Saturation, Value) que permite explorar cores, gerar paletas harmônicas e obter informações detalhadas sobre cores usando a API TheColorAPI.

This project is an interactive HSV (Hue, Saturation, Value) color wheel web application that allows you to explore colors, generate harmonious palettes, and get detailed color information using TheColorAPI.

---

## Arquivos principais / Main files

### `app.py`

- Em português:
  - `app.py` é o servidor Flask que serve a aplicação.
  - Ele importa `Flask`, `render_template` e `jsonify` do Flask, além de `requests` para fazer chamadas à API.
  - Possui uma rota `/` que renderiza a página inicial (`index.html`).
  - A rota `/color/<hexcolor>` recebe um código hexadecimal de cor e consulta a API TheColorAPI para obter informações detalhadas sobre a cor (nome, RGB, HSL, HSV, XYZ).
  - Retorna os dados em formato JSON para o JavaScript da página.

- In English:
  - `app.py` is the Flask server that serves the application.
  - It imports `Flask`, `render_template`, and `jsonify` from Flask, plus `requests` for API calls.
  - It has a `/` route that renders the homepage (`index.html`).
  - The `/color/<hexcolor>` route receives a hexadecimal color code and queries TheColorAPI for detailed color information (name, RGB, HSL, HSV, XYZ).
  - Returns the data in JSON format for the page's JavaScript.

### `templates/index.html`

- Em português:
  - `index.html` é o template HTML principal da aplicação.
  - Contém o canvas da roda de cores HSV, onde o usuário pode clicar para selecionar cores.
  - Inclui elementos para exibir informações da cor selecionada (nome, hex, RGB, HSL, HSV, XYZ).
  - Possui seções para paletas harmônicas (complementar, análoga, tríade, tetrádica, monocromática).
  - O CSS está embutido no `<style>` para estilizar a interface com fundo escuro e elementos modernos.
  - Carrega o arquivo `script.js` que controla a interação com a roda de cores.

- In English:
  - `index.html` is the main HTML template of the application.
  - Contains the HSV color wheel canvas where users can click to select colors.
  - Includes elements to display selected color information (name, hex, RGB, HSL, HSV, XYZ).
  - Has sections for harmonious palettes (complementary, analogous, triadic, tetradic, monochromatic).
  - CSS is embedded in `<style>` to style the interface with a dark background and modern elements.
  - Loads `script.js` which controls the color wheel interaction.

### `static/script.js`

- Em português:
  - `script.js` contém toda a lógica JavaScript para a interação com a roda de cores.
  - Desenha a roda de cores HSV no canvas usando gradientes radiais e cônicos.
  - Converte coordenadas do mouse em valores HSV e depois para RGB para exibir as cores.
  - Faz requisições AJAX para `/color/<hexcolor>` para obter informações detalhadas da cor selecionada.
  - Gera paletas harmônicas baseadas na cor selecionada (complementar, análoga, etc.).
  - Atualiza a interface em tempo real conforme o usuário move o mouse ou clica na roda.
  - Inclui tooltips que mostram informações da cor sob o cursor.

- In English:
  - `script.js` contains all the JavaScript logic for color wheel interaction.
  - Draws the HSV color wheel on the canvas using radial and conical gradients.
  - Converts mouse coordinates to HSV values and then to RGB for color display.
  - Makes AJAX requests to `/color/<hexcolor>` to get detailed information about the selected color.
  - Generates harmonious palettes based on the selected color (complementary, analogous, etc.).
  - Updates the interface in real-time as the user moves the mouse or clicks on the wheel.
  - Includes tooltips that show color information under the cursor.

### `static/style.css` (se existir)

- Em português:
  - O CSS está embutido no `index.html`, mas se houver um arquivo separado, ele define os estilos visuais.
  - Fundo escuro (#0b0b0b), fonte Inter do Google Fonts.
  - Layout flexível com roda de cores e sidebar.
  - Estilos para tooltips, paletas, informações de cor e elementos interativos.

- In English:
  - CSS is embedded in `index.html`, but if there's a separate file, it defines the visual styles.
  - Dark background (#0b0b0b), Inter font from Google Fonts.
  - Flexible layout with color wheel and sidebar.
  - Styles for tooltips, palettes, color information, and interactive elements.

---

## Como funciona a roda de cores / How the color wheel works

### Sistema HSV
- **Hue (Matiz)**: Representado pelo ângulo na roda (0-360°).
- **Saturation (Saturação)**: Distância do centro (0-100%).
- **Value (Valor)**: Controlado pelo slider separado (0-100%).

### Interação
1. O usuário move o mouse sobre a roda para ver cores em tempo real.
2. Clicar seleciona uma cor e carrega suas informações da API.
3. Paletas harmônicas são geradas automaticamente baseadas na cor selecionada.

### Paletas harmônicas
- **Complementar**: Cor oposta na roda.
- **Análoga**: Cores adjacentes (±30°).
- **Tríade**: Três cores equidistantes (120°).
- **Tetrádica**: Quatro cores em retângulo.
- **Monocromática**: Variações de saturação e valor da mesma matiz.

---

## Como rodar / How to run

- Em português:
  1. Abra o terminal na pasta `Color_wheel`.
  2. Ative o ambiente virtual:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
  3. Instale dependências se necessário:
     ```powershell
     pip install flask requests
     ```
  4. Rode:
     ```powershell
     python app.py
     ```
  5. Abra `http://127.0.0.1:5000` no navegador.

- In English:
  1. Open the terminal in the `Color_wheel` folder.
  2. Activate the virtual environment:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
  3. Install dependencies if needed:
     ```powershell
     pip install flask requests
     ```
  4. Run:
     ```powershell
     python app.py
     ```
  5. Open `http://127.0.0.1:5000` in your browser.

---

## Tecnologias usadas / Technologies used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **API**: TheColorAPI (https://www.thecolorapi.com/)
- **Banco de dados**: Nenhum (apenas API externa)
- **Outros**: Canvas API para desenhar a roda de cores

---

## Observações / Notes

- A aplicação requer conexão com a internet para consultar a API de cores.
- O canvas da roda é desenhado dinamicamente com gradientes.
- As paletas são calculadas matematicamente no JavaScript.
- O design é responsivo e funciona em dispositivos móveis.

- The application requires internet connection to query the color API.
- The wheel canvas is drawn dynamically with gradients.
- Palettes are calculated mathematically in JavaScript.
- The design is responsive and works on mobile devices.

---

## Agradecimento

- Em português: Obrigado por conferir este projeto. Este aplicativo foi feito por Ilkini/Matheus Lino.
- In English: Thank you for reviewing this project. This app was made by Ilkini/Matheus Lino.