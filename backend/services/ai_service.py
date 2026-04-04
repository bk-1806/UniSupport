"""
ai_service.py
-------------
Integration of the AI answer module using the true RAG pipeline.
"""
from services.rag.query import get_answer as rag_get_answer

def get_answer(query: str) -> dict:
    """
    Return a domain-specific answer and a list of policy sources for the given query,
    powered by the RAG pipeline.

    Returns:
        {
            "answer": str,
            "sources": List[str]
        }
    """
    return rag_get_answer(query)
