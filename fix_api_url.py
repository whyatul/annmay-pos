import os 
menu_path = "pos-customer/src/pages/Menu.jsx"
with open(menu_path, "r") as f:
    text = f.read()

text = text.replace("http://localhost:8000/api/v1", "http://localhost:8000/api")
with open(menu_path, "w") as f:
    f.write(text)

