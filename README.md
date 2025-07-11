# { Sernik.JS }
### Super duper fajny framework xD
***Ani troche upośledzony, a ludzie którzy go pisali totalnie byli trzeźwi ciałem i umysłem. ~ Tak było***

<img width="299" height="258" alt="image" src="https://github.com/user-attachments/assets/08882080-8986-4d80-8d7d-4b30796bb130" />

---

# "Ale co to kurwa jest?" - (spis treści + FAQ)

## W Skład Sernik.JS wchodzi:
---
## { Sernik Engine }
### **`render.js`** 
- Oryginalny sernikowy silnik do templatkowania strony, \
  zawiera takie bajery jak: `${templatki}`, \
  oraz pliki.json w których można je zdefiniować. (Shocking! I know xD)
### **`assets/*`**
- Różne tego typu rzeczy xD
### **`data/*`**
- To co wyżej xD z tym że w data/ są pliki.json, ze zmiennymi.
### **`templates/*`**
- Różne fragmenty strony typu head.html / footer.html które mogą zostać wstrzyknięte w całości do DOM xD
  
## { ??? }
- Jak coś wymyśle to dodam xD

---

# Example
### `index.html`
```html
<head id="head"></head>
<body>
  <h1>Welcome to ${title}</h1>
  <p>Maintained by ${team[0].name}</p>

  <div id="footer"></div>
  <script src="/render.js"></script>
</body>
```
### `config.json`
```json
{
  "title": "Szmelc.INC",
  "description": "Entropy awaits",
  "css": "/assets/style.css",
  "js": "/assets/main.js",
  "footerText": "© 2025 Szmelc.INC"
}
```
### `template/head.html`
```html
<title>${title}</title>
<link rel="stylesheet" href="${css}">
<script src="${js}" defer></script>
<meta name="description" content="${description}">
```
