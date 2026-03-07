import re

menu_file = "pos-customer/src/pages/Menu.jsx"
with open(menu_file, "r") as f:
    menu_content = f.read()

# Replace url with just getting all items instead of based on tableNo
menu_content = menu_content.replace(
    '`${import.meta.env.VITE_URL}/api/v1/menuItem/get-all-menuItems`',
    '`${import.meta.env.VITE_URL}/api/v1/menuItem`'
)
menu_content = menu_content.replace(
    '`${import.meta.env.VITE_URL}/api/v1/menuItem/customer/menu`',
    '`${import.meta.env.VITE_URL}/api/v1/menuItem`'
)

# Replace url params based request
menu_content = re.sub(r'axios\.get\(.*?,\s*\{.*?params:\s*\{\s*tableNo.*?\}.*?\}\)', r'axios.get(`${import.meta.env.VITE_URL}/api/v1/menuItem`)', menu_content, flags=re.DOTALL)

with open(menu_file, "w") as f:
    f.write(menu_content)

print("fixed menu 2")
