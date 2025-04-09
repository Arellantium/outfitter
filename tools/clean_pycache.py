import os

def delete_pycache(root_dir="."):
    count = 0
    for root, dirs, files in os.walk(root_dir):
        for d in dirs:
            if d == "__pycache__":
                full_path = os.path.join(root, d)
                print(f"🧹 Rimuovo {full_path}")
                try:
                    os.system(f'rmdir /s /q "{full_path}"')
                except:
                    pass
                count += 1
    print(f"\n✅ Puliti {count} __pycache__")

if __name__ == "__main__":
    delete_pycache()
