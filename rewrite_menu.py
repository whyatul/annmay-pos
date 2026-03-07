with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/pages/Menu.jsx", "r") as f:
    content = f.read()

import re

# Add useState and FaShoppingCart
content = re.sub(r'import React, \{ useEffect \} from "react";', 'import React, { useEffect, useState } from "react";\nimport { FaShoppingCart, FaTimes } from "react-icons/fa";', content)

# Change the component to use state
content = content.replace(
    'const Menu = () => {\n  useEffect(() => {\n    document.title = "Annamay | Menu";\n  }, []);\n\n  const customerData = useSelector(',
    'const Menu = () => {\n  const [isCartOpen, setIsCartOpen] = useState(true);\n  const cartData = useSelector((state) => state.cart) || [];\n  const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);\n\n  useEffect(() => {\n    document.title = "Annamay | Menu";\n  }, []);\n\n  const customerData = useSelector('
)

# Update the close button to actually close
content = content.replace(
    '<button className="w-8 h-8 rounded-full border border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600">×</button>',
    '<button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full border border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"><FaTimes size={14} /></button>'
)

# Conditionally render Cart side panel and floating button
cart_panel = r"""      \{/\* Right — Cart Panel \(Overlay or Side panel like reference\) \*/\}
      <div className="w-\[340px\] bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-\[-4px_0_15px_rgba\(0,0,0,0\.02\)\] z-20">"""
    
replacement = """      {/* Floating cart button when closed */}
      {!isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="absolute bottom-8 right-8 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-4 shadow-2xl flex items-center justify-center z-50 transition-all transform hover:scale-105"
        >
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#141414]">
              {totalItems}
            </span>
          )}
        </button>
      )}

      {/* Right — Cart Panel (Overlay or Side panel like reference) */}
      {isCartOpen && (
        <div className="w-[340px] bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-[-4px_0_15px_rgba(0,0,0,0.02)] z-20 transition-all duration-300">"""

content = re.sub(cart_panel, replacement, content)

content = content.replace(
    '        </div>\n      </div>\n    </section>',
    '        </div>\n      </div>\n      )}\n    </section>'
)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/pages/Menu.jsx", "w") as f:
    f.write(content)

