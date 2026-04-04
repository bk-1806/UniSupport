import os
import re
import string

RAW_DIR = "raw_data"
PROCESSED_FILE = "processed_knowledge.txt"

def normalize_text(text: str) -> str:
    """Lowercase and strip punctuation for smart deduplication."""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_text(text: str, max_size: int = 500) -> list[str]:
    """Split text into chunks by paragraphs or fixed size if too long."""
    paragraphs = text.split('\n\n')
    chunks = []
    
    for p in paragraphs:
        # Basic clean up of empty strings and newlines
        p = re.sub(r'\s+', ' ', p).strip()
        if not p:
            continue
            
        # If paragraph is unusually long, split it by words
        if len(p) > max_size:
            words = p.split()
            current_chunk = []
            current_len = 0
            for word in words:
                current_chunk.append(word)
                current_len += len(word) + 1
                if current_len >= max_size:
                    chunks.append(" ".join(current_chunk))
                    current_chunk = []
                    current_len = 0
            if current_chunk:
                chunks.append(" ".join(current_chunk))
        else:
            chunks.append(p)
            
    return chunks

def process():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    raw_path = os.path.join(current_dir, RAW_DIR)
    processed_path = os.path.join(current_dir, PROCESSED_FILE)
    
    if not os.path.exists(raw_path):
        os.makedirs(raw_path)
        print(f"Created {raw_path}. Please add .txt files.")
        return

    all_chunks = []
    
    # Read files
    for filename in os.listdir(raw_path):
        if filename.endswith(".txt"):
            filepath = os.path.join(raw_path, filename)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                # Split and clean chunks
                chunks = chunk_text(content)
                all_chunks.extend(chunks)
                
    # Deduplicate smartly using normalized hash matching
    seen_hashes = set()
    unique_chunks = []
    
    for chunk in all_chunks:
        norm = normalize_text(chunk)
        if norm and norm not in seen_hashes:
            seen_hashes.add(norm)
            unique_chunks.append(chunk)
            
    # Write to processed file joined by double newline
    with open(processed_path, 'w', encoding='utf-8') as f:
        f.write("\n\n".join(unique_chunks))
        
    print(f"Processed {len(all_chunks)} chunks down to {len(unique_chunks)} unique chunks.")
    print(f"Saved optimized knowledge to {processed_path}")

if __name__ == "__main__":
    process()
