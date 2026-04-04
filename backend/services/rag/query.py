import os
from dotenv import load_dotenv

load_dotenv()

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# ── Knowledge base ── loaded once at startup ──────────────────────────────────
current_dir = os.path.dirname(os.path.abspath(__file__))
processed_knowledge_path = os.path.join(current_dir, "..", "..", "rag", "processed_knowledge.txt")

global_knowledge = ""
if os.path.exists(processed_knowledge_path):
    with open(processed_knowledge_path, "r", encoding="utf-8") as f:
        global_knowledge = f.read()[:4000]

# ── LLM + chain ── built once at startup (avoids re-instantiation per request) ─
_llm = ChatGroq(
    model_name="llama-3.1-8b-instant",
    api_key=os.environ.get("GROQ_API_KEY"),
    max_tokens=200,
    temperature=0.1
)

_prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are a university support AI. "
        "Use ONLY the provided context to answer. "
        "Be concise and direct. "
        "If the answer is not in the context, respond with exactly: Needs Review"
    )),
    ("human", "CONTEXT:\n{cleaned_knowledge}\n\nQUERY:\n{user_query}")
])

_chain = _prompt | _llm | StrOutputParser()

# ─────────────────────────────────────────────────────────────────────────────

def get_answer(query: str) -> dict:
    answer = _chain.invoke({
        "cleaned_knowledge": global_knowledge,
        "user_query": query
    })

    return {
        "answer": answer,
        "sources": ["processed_knowledge.txt"] if global_knowledge else []
    }