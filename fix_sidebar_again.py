with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/layout/Sidebar.jsx", "r") as f:
    content = f.read()

# Fix the broken map loop
broken_block = """      <div className="px-8 mb-6 mt-2">
        <nav className="flex flex-col gap-1.5">
          <button
              key={idx}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-gray-100 transition-all"
            >
              <div className="text-lg text-gray-400">{item.icon}</div>
              {item.label}
            </button>
          ))}
          <button
            onClick={() => logoutMutation.mutate()}"""

fixed_block = """      <div className="px-8 mb-6 mt-2">
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => logoutMutation.mutate()}"""

content = content.replace(broken_block, fixed_block)

# Remove the theme toggle div entirely
theme_toggle_start = content.find('<div className="mt-auto px-8 pb-8">')
aside_close = content.find('</aside>')

if theme_toggle_start != -1 and aside_close != -1:
    content = content[:theme_toggle_start] + content[aside_close:]

with open("/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/layout/Sidebar.jsx", "w") as f:
    f.write(content)
