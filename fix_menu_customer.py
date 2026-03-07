import re

menu_file = "pos-customer/src/pages/Menu.jsx"
with open(menu_file, "r") as f:
    menu_content = f.read()

# Replace url with just getting all items instead of based on tableNo
menu_content = menu_content.replace(
    '`${import.meta.env.VITE_URL}/api/v1/menuItem/customer/menu`',
    '`${import.meta.env.VITE_URL}/api/v1/menuItem/get-all-menuItems`'
)

# And make sure generic categories are loaded correctly
# We might need to ensure elegant styling.
# The user asked: "make it look elegant". 

with open(menu_file, "w") as f:
    f.write(menu_content)

print("fixed menu")
