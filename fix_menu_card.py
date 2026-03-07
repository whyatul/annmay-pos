import re

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "r") as f:
    text = f.read()

# First, add the icon import
import_pattern = r'(import \{.*? FaSearch .*?\} from "react-icons/fa";)'
import_replacement = r'import { FaPlus, FaCheck, FaSearch, FaUtensils } from "react-icons/fa";'
text = re.sub(r'import \{ FaPlus, FaCheck, FaSearch \} from "react-icons/fa";', import_replacement, text)

# Second, add the icon to the card Title area
card_pattern = r"""                  <div className="flex-1 w-full">
                    <h3 className="text-gray-100 text-base font-bold leading-snug line-clamp-2 px-2">
                       \{item\.name\}
                    </h3>
                  </div>"""

card_replacement = """                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-center gap-2 px-2">
                      <FaUtensils className="text-gray-600 shrink-0" size={12} />
                      <h3 className="text-gray-100 text-base font-bold leading-snug line-clamp-2">
                         {item.name}
                      </h3>
                    </div>
                  </div>"""

text = text.replace(card_pattern, card_replacement)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "w") as f:
    f.write(text)

