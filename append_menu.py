import re

with open("pos-backend/scripts/seedDatabase.js", "r") as f:
    content = f.read()

# 1. Add categories
new_categories = [
    '{ name: "Shakes" }',
    '{ name: "Smoothies" }',
    '{ name: "Mocktails" }',
    '{ name: "Mojito & Iced Tea" }',
    '{ name: "Hot Beverage" }',
    '{ name: "Soup" }',
    '{ name: "Salad" }',
    '{ name: "Raita" }',
    '{ name: "Burger" }'
]

cat_insert_pos = content.find('  ];\n  await Category.bulkCreate(cats);')
if cat_insert_pos != -1:
    content = content[:cat_insert_pos] + "    " + ",\n    ".join(new_categories) + ",\n" + content[cat_insert_pos:]

# 2. Add menu items
new_items_script = """
    // ── Shakes ──
    { name: "Strawberry Shake", price: 149, categoryId: c["Shakes"], isVeg: true, preparationTime: 5 },
    { name: "Vanilla Shake", price: 149, categoryId: c["Shakes"], isVeg: true, preparationTime: 5 },
    { name: "Cold Coffee", price: 149, categoryId: c["Shakes"], isVeg: true, preparationTime: 5 },
    { name: "Oreo Shake", price: 169, categoryId: c["Shakes"], isVeg: true, preparationTime: 8 },
    { name: "Kitkat Shake", price: 169, categoryId: c["Shakes"], isVeg: true, preparationTime: 8 },
    { name: "Ferrero Shake", price: 169, categoryId: c["Shakes"], isVeg: true, preparationTime: 8 },
    { name: "Brownie Shake", price: 169, categoryId: c["Shakes"], isVeg: true, preparationTime: 8 },
    { name: "Banana Shake", price: 149, categoryId: c["Shakes"], isVeg: true, preparationTime: 5 },

    // ── Smoothies ──
    { name: "Banana Smoothie", price: 149, categoryId: c["Smoothies"], isVeg: true, preparationTime: 5 },
    { name: "Blueberry Smoothie", price: 149, categoryId: c["Smoothies"], isVeg: true, preparationTime: 5 },
    { name: "Strawberry Smoothie", price: 149, categoryId: c["Smoothies"], isVeg: true, preparationTime: 5 },
    { name: "Kiwi Smoothie", price: 149, categoryId: c["Smoothies"], isVeg: true, preparationTime: 5 },
    { name: "Pineapple Smoothie", price: 149, categoryId: c["Smoothies"], isVeg: true, preparationTime: 5 },

    // ── Mocktails ──
    { name: "Aerated Drinks", price: 49, categoryId: c["Mocktails"], isVeg: true, preparationTime: 2 },
    { name: "Canned Soft Drink", price: 79, categoryId: c["Mocktails"], isVeg: true, preparationTime: 2 },
    { name: "Fresh Lime Soda", price: 119, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },
    { name: "Bar Refresher", price: 159, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },
    { name: "Sea Breeze", price: 159, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },
    { name: "Floating Honeymoon", price: 159, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },
    { name: "French Kiss", price: 159, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },
    { name: "Guava Mary", price: 159, categoryId: c["Mocktails"], isVeg: true, preparationTime: 5 },

    // ── Mojito & Iced Tea ──
    { name: "Lemon Mojito", price: 139, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },
    { name: "Green Apple Mojito", price: 139, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },
    { name: "Cola Mojito", price: 139, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },
    { name: "Masala Coke / Sprite", price: 99, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },
    { name: "Lemon Iced Tea", price: 149, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },
    { name: "Peach Iced Tea", price: 149, categoryId: c["Mojito & Iced Tea"], isVeg: true, preparationTime: 5 },

    // ── Hot Beverage ──
    { name: "Tea", price: 49, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },
    { name: "Masala Tea", price: 59, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },
    { name: "Hot Coffee", price: 79, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },
    { name: "Black Coffee", price: 69, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },
    { name: "Black Tea", price: 49, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },
    { name: "Hot Chocolate Milk", price: 99, categoryId: c["Hot Beverage"], isVeg: true, preparationTime: 5 },

    // ── Soup ──
    { name: "Veg Manchow Soup", price: 99, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },
    { name: "Hot & Sour Soup", price: 119, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },
    { name: "Sweet Corn Soup", price: 99, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },
    { name: "Lemon Coriander Soup", price: 129, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },
    { name: "Cream Of Mushroom Soup", price: 149, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },
    { name: "Cream Of Tomato Soup", price: 139, categoryId: c["Soup"], isVeg: true, preparationTime: 10 },

    // ── Salad ──
    { name: "Green Salad", price: 79, categoryId: c["Salad"], isVeg: true, preparationTime: 5 },
    { name: "Aloo Chat", price: 99, categoryId: c["Salad"], isVeg: true, preparationTime: 8 },
    { name: "Greek Salad", price: 129, categoryId: c["Salad"], isVeg: true, preparationTime: 10 },
    { name: "Chana Chat", price: 99, categoryId: c["Salad"], isVeg: true, preparationTime: 8 },
    { name: "Crispy Noodle Salad", price: 129, categoryId: c["Salad"], isVeg: true, preparationTime: 10 },
    { name: "Kachumber Salad", price: 129, categoryId: c["Salad"], isVeg: true, preparationTime: 8 },

    // ── Raita ──
    { name: "Mix Veg Raita", price: 99, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Boondi Raita", price: 99, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Cucumber Raita", price: 99, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Mint Raita", price: 99, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Pineapple Raita", price: 129, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Fruit Raita", price: 129, categoryId: c["Raita"], isVeg: true, preparationTime: 5 },
    { name: "Plain Curd", price: 89, categoryId: c["Raita"], isVeg: true, preparationTime: 2 },

    // ── Burger ──
    { name: "Aloo Tikki Burger", price: 99, categoryId: c["Burger"], isVeg: true, preparationTime: 10 },
    { name: "Aloo Tikki Cheese Burger", price: 109, categoryId: c["Burger"], isVeg: true, preparationTime: 10 },
    { name: "Veg Double Cheese Burger", price: 129, categoryId: c["Burger"], isVeg: true, preparationTime: 10 },
    { name: "Grilled Paneer Burger", price: 159, categoryId: c["Burger"], isVeg: true, preparationTime: 12 },
    { name: "Double Open Burger", price: 179, categoryId: c["Burger"], isVeg: true, preparationTime: 15 },

    // ── Sandwiches (Additional) ──
    { name: "Corn Cheese Grilled Sandwich", price: 179, categoryId: c["Sandwiches"], isVeg: true, preparationTime: 10 },
    { name: "Paneer Tikka Grilled Sandwich", price: 199, categoryId: c["Sandwiches"], isVeg: true, preparationTime: 12 },
    { name: "English Grilled Veg Sandwich", price: 199, categoryId: c["Sandwiches"], isVeg: true, preparationTime: 10 },

"""

item_insert_pos = content.find('// ── Sandwiches ──')
if item_insert_pos != -1:
    content = content[:item_insert_pos] + new_items_script + content[item_insert_pos:]

with open("pos-backend/scripts/seedDatabase.js", "w") as f:
    f.write(content)

