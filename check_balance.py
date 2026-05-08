import re
import sys

def check_balance(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove comments
    content = re.sub(r'//.*|/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Remove strings
    content = re.sub(r'".*?"|\'.*?\'|`.*?`', '', content, flags=re.DOTALL)

    stack = []
    ternaries = 0
    for i, char in enumerate(content):
        if char == '{': stack.append(('{', i))
        if char == '}':
            if stack and stack[-1][0] == '{': stack.pop()
        if char == '(': stack.append(('(', i))
        if char == ')':
            if stack and stack[-1][0] == '(': stack.pop()
        
        if char == '?':
            # Check if it's a ternary or optional chaining
            if i + 1 < len(content) and content[i+1] in ['.', '(', '[']:
                continue
            ternaries += 1
        if char == ':':
            # Check if it's inside an object or a type (hard to do perfectly)
            # But usually ternaries are inside ( ) or { }
            if ternaries > 0:
                ternaries -= 1
    
    print(f"Brace/Paren stack size: {len(stack)}")
    print(f"Unclosed ternaries: {ternaries}")

if __name__ == "__main__":
    check_balance(sys.argv[1])
