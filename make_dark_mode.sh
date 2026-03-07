#!/bin/bash
DIR="/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src"

# Replace general backgrounds
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/bg-white/bg-gray-900/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/bg-\[#f5f6f8\]/bg-[#141414]/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/bg-\[#f8f9fa\]/bg-gray-800/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/bg-gray-50/bg-gray-800/g' {} +

# Replace text colors
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/text-gray-900/text-gray-100/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/text-gray-800/text-gray-200/g' {} +

# Replace borders
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/border-gray-100/border-gray-800/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/border-gray-200/border-gray-700/g' {} +

# Hover states
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/hover:bg-gray-50/hover:bg-gray-700/g' {} +
find $DIR -type f -name "*.jsx" -exec sed -i -e 's/hover:bg-gray-100/hover:bg-gray-700/g' {} +
