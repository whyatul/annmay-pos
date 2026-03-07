with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "r") as f:
    text = f.read()

# Add import
if 'FaUtensils' not in text:
    text = text.replace('import { FaPlus, FaCheck, FaSearch } from "react-icons/fa";',
                        'import { FaPlus, FaCheck, FaSearch, FaUtensils } from "react-icons/fa";')

# Add icon
old_block = """                  <div className="flex-1 w-full">
                    <h3 className="text-gray-100 text-base font-bold leading-snug line-clamp-2 px-2">
                       {item.name}
                    </h3>
                  </div>"""

new_block = """                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-center gap-2 px-2">
                      <FaUtensils className="text-gray-500 shrink-0" size={12} />
                      <h3 className="text-gray-100 text-base font-bold leading-snug line-clamp-2">
                         {item.name}
                      </h3>
                    </div>
                  </div>"""

text = text.replace(old_block, new_block)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "w") as f:
    f.write(text)
