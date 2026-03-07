import re

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/layout/Sidebar.jsx", "r") as f:
    content = f.read()

# 1. Remove generalItems definition
content = re.sub(r'const generalItems = \[\n  \{ path: "#", label: "Settings", icon: <MdSettings \/> \},\n  \{ path: "#", label: "Give Rating", icon: <FaStar \/> \},\n\];\n', '', content)

# 2. Remove General section rendering
general_rendering = r"""          <h2 className="text-\[10px\] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3">General</h2>
          \{generalItems\.map\(\(item\) => \(
            <button
              key=\{item\.label\}
              className="flex items-center gap-3 px-4 py-2\.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-gray-100 transition-all"
            >
              <div className="text-lg text-gray-400">
                \{item\.icon\}
              </div>
              \{item\.label\}
            </button>
          \)\)\}"""
content = re.sub(general_rendering, '', content)

# 3. Remove Theme Toggle section
theme_toggle = r"""      <div className="px-6 pb-6 mt-4">
        <div className="bg-gray-800 p-1\.5 rounded-2xl flex relative">
          <button 
            onClick=\{.*\}
            className=\{.*\}
          >
            <HiOutlineLightBulb size=\{14\}\/> Light
          </button>
          <button 
            onClick=\{.*\}
            className=\{.*\}
          >
            <HiMoon size=\{14\}\/> Dark
          </button>
        </div>
      </div>"""
content = re.sub(theme_toggle, '', content, flags=re.DOTALL)

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/layout/Sidebar.jsx", "w") as f:
    f.write(content)
