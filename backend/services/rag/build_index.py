import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from load_data import load_documents, split_documents

def build_index():
    docs = load_documents()
    chunks = split_documents(docs)

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = FAISS.from_documents(chunks, embeddings)

    current_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(current_dir, "faiss_index")
    db.save_local(index_path)
    print("FAISS index created at", index_path)

if __name__ == "__main__":
    build_index()