import os
import re

def final_cleanup():
    root_dir = "/Users/alisherrakhmanov134/Desktop/jaryq/laundromat-wp/"
    
    files_to_update = [
        "faq.html", "personal-data.html", "services.html", "location.html", 
        "tips.html", "instructions.html", "tips-details.html", "404.html", 
        "contact.html", "privacy-policy.html", "index.html",
        "el/index.html", "el/personal-data.html", "el/faq.html", "el/services.html", 
        "el/location.html", "el/tips.html", "el/instructions.html", "el/404.html", 
        "el/tips-details.html", "el/privacy-policy.html", "el/contact.html"
    ]

    for file_path in files_to_update:
        full_path = os.path.join(root_dir, file_path)
        if not os.path.exists(full_path):
            continue
            
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # 2. Process mobile menu links
        start_tag = '<div id="mobile-menu"'
        if start_tag in content:
            start_idx = content.find(start_tag)
            
            # Find end of mobile-menu
            depth = 0
            end_idx = -1
            div_pattern = re.compile(r'<(/?div)(\s|>)', re.IGNORECASE)
            for match in div_pattern.finditer(content, start_idx):
                tag = match.group(1).lower()
                if tag == 'div': depth += 1
                elif tag == '/div': depth -= 1
                if depth == 0:
                    end_idx = match.end()
                    break
            
            if end_idx != -1:
                menu_content = content[start_idx:end_idx]
                
                def fix_link(match):
                    tag = match.group(0)
                    if 'tel:' in tag or 'mailto:' in tag:
                        # Normalize classes
                        class_match = re.search(r'class="([^"]*)"', tag)
                        if class_match:
                            classes = set(class_match.group(1).split())
                            # Remove existing color and size classes to avoid duplicates
                            classes = {c for c in classes if not c.startswith('text-') or c == 'text-sm'}
                            # Add back the correct size and the important brand color
                            classes.add('text-[24px]')
                            classes.add('text-brand!')
                            
                            new_class_attr = f'class="{" ".join(sorted(classes))}"'
                            tag = tag.replace(class_match.group(0), new_class_attr)
                        else:
                            tag = tag.replace('<a ', '<a class="text-[24px] text-brand!" ')
                    return tag

                a_tag_pattern = re.compile(r'<a[^>]*>', re.IGNORECASE | re.DOTALL)
                new_menu_content = a_tag_pattern.sub(fix_link, menu_content)
                content = content[:start_idx] + new_menu_content + content[end_idx:]

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Restored font-size and boosted color in {file_path}")

if __name__ == "__main__":
    final_cleanup()
