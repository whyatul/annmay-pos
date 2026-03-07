import re

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "r") as f:
    content = f.read()

old_block = """                  {/* Item image if available */}
                  {item.image ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 border-4 border-gray-50">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-800 mb-4 flex items-center justify-center text-3xl">
                       🍔
                    </div>
                  )}"""

new_block = """                  {/* Item image with fallback */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 border-4 border-gray-800 bg-gray-800">
                    <img
                      src={item.image ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${item.image}` : `https://loremflickr.com/150/150/food?lock=${item.id}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (!e.target.dataset.failed) {
                          e.target.dataset.failed = true;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=f59e0b`;
                        }
                      }}
                    />
                  </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
else:
    print("Block not found!")

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/menu/MenuContainer.jsx", "w") as f:
    f.write(content)
