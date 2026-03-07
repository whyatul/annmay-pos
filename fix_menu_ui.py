import re

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "r") as f:
    text = f.read()

# Pattern to replace the entire div containing these dummy buttons
pattern = r'<div className="flex items-center gap-6 text-gray-500 font-medium text-sm">.*?</div>'

# We replace it with nothing, just completely remove the div block
text = re.sub(pattern, '', text, flags=re.DOTALL)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "w") as f:
    f.write(text)

