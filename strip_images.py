with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "r") as f:
    content = f.read()

import re

# Remove the FaUtensils import just in case
content = re.sub(r'FaUtensils(?:,\s*)?|(?:\s*,\s*)?FaUtensils', '', content)
# Ensure there are no empty import clauses
content = re.sub(r'import \{ \}\s+from\s+"react-icons/[^"]+";\n?', '', content)

# Target the image block
img_block = r"""                  \{/\* Item image with fallback \*/\}
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 border-4 border-gray-800 bg-gray-800">
                    <img
                      src=\{.*?\}
                      alt=\{item\.name\}
                      className="w-full h-full object-cover"
                      onError=\{.*?\}
                    \/>
                  <\/div>"""
content = re.sub(img_block, '', content, flags=re.DOTALL)

# Target the FaUtensils icon inside the map
icon_block = r'<FaUtensils className="text-gray-500 shrink-0" size=\{12\} \/>'
content = re.sub(icon_block, '', content)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "w") as f:
    f.write(content)
