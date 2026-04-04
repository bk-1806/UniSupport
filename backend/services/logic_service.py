"""
logic_service.py
----------------
All business logic for processing a student query:
intent detection, emotion detection, priority assignment,
confidence scoring, decision, recommended action, explanation, and status.
"""

from typing import Dict, Any

# ── Keyword Sets (extend these to improve detection coverage) ─────────────────

INTENT_KEYWORDS: Dict[str, list] = {
    "attendance": ["attendance", "class", "absent", "missed"],
    "medical":    ["medical", "sick", "doctor", "health", "hospital"],
    "academic":   ["exam", "test", "grade", "result", "score"],
    "finance":    ["fee", "payment", "scholarship", "money", "tuition"],
}

EMOTION_KEYWORDS: Dict[str, list] = {
    "urgent":     ["urgent", "emergency", "immediately", "asap", "help"],
    "concerned":  ["worried", "anxious", "concerned", "scared", "nervous"],
    "frustrated": ["bad", "wrong", "annoyed", "terrible", "frustrated"],
}

# ── Lookup Tables ─────────────────────────────────────────────────────────────

DECISIONS: Dict[str, str] = {
    "attendance": "Eligible for attendance exemption review",
    "medical":    "Eligible for medical exception under the Student Welfare Policy",
    "academic":   "Eligible to submit a formal grade re-evaluation request",
    "finance":    "Eligible to apply for fee deferment or scholarship assistance",
    "unknown":    "Unable to determine eligibility — requires manual assessment",
}

ACTIONS: Dict[str, str] = {
    "attendance": "Contact your class coordinator and submit an attendance regularisation form",
    "medical":    "Submit a valid medical certificate to the Academic Office within 7 days",
    "academic":   "Log in to the student portal and raise a grade review request",
    "finance":    "Visit the Finance Office or apply online through the scholarship portal",
    "unknown":    "Please visit the Student Helpdesk with your student ID for personalised guidance",
}

EXPLANATIONS: Dict[str, str] = {
    "attendance": (
        "University policy requires all students to maintain a minimum of 75% attendance per module. "
        "Students who have missed classes due to a documented valid reason — such as illness, a family "
        "emergency, or an official university commitment — may apply for an exemption. "
        "This case has been reviewed against that policy."
    ),
    "medical": (
        "Under the Student Welfare Policy, students with a verified medical condition are eligible to "
        "apply for attendance exemptions or assignment extensions. A certificate issued by a registered "
        "medical practitioner is required before the Academic Office can process the application."
    ),
    "academic": (
        "The Academic Regulations grant students the right to request a formal re-evaluation of their "
        "grades. Requests must be submitted within 7 days of the result being published. "
        "The Examination Office aims to complete all reviews within 14 working days."
    ),
    "finance": (
        "Students experiencing financial hardship may apply for a fee deferment or explore "
        "scholarship and bursary options through the Finance Office. All applications are assessed "
        "individually, and decisions are communicated within 10 working days."
    ),
    "unknown": (
        "The system was unable to identify a clear topic from the query provided. "
        "In line with our escalation protocol, this case has been forwarded to a human advisor "
        "to ensure the student receives accurate, policy-compliant guidance."
    ),
}

# ── Core Detection Functions ───────────────────────────────────────────────────

def detect_intent(query: str) -> str:
    """Classify the query into a known intent category, or return 'unknown'."""
    q = query.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(word in q for word in keywords):
            return intent
    return "unknown"


def detect_emotion(query: str) -> str:
    """Infer the student's emotional tone from keyword signals."""
    q = query.lower()
    for emotion, keywords in EMOTION_KEYWORDS.items():
        if any(word in q for word in keywords):
            return emotion
    return "neutral"


def assign_priority(intent: str, emotion: str) -> str:
    """Assign a case priority based on intent criticality and emotional urgency."""
    if emotion == "urgent" or intent == "medical":
        return "high"
    if emotion in ("concerned", "frustrated") or intent == "finance":
        return "medium"
    return "low"


def calculate_confidence(query: str, intent: str) -> str:
    """
    Estimate answer confidence as a percentage string.
    A known intent and a longer, more descriptive query yield higher confidence.
    """
    words = query.split()
    score = 0.5
    if intent != "unknown":
        score += 0.3
    if len(words) > 5:
        score += 0.1
    if len(words) > 10:
        score += 0.1
    return f"{min(score, 1.0) * 100:.0f}%"


def resolve_status(intent: str, priority: str) -> str:
    """
    Determine whether the case can be resolved automatically or needs escalation.
    Medical and attendance cases always escalate for human verification.
    """
    needs_escalation = intent in ("medical", "attendance", "unknown") or priority == "high"
    return "escalated" if needs_escalation else "resolved"

# ── Master Processor ──────────────────────────────────────────────────────────

def process_query_logic(query: str) -> Dict[str, Any]:
    """
    Run all logic on the student query and return a flat dict of enriched fields.
    This is the single entry point used by the /ask route.
    """
    intent   = detect_intent(query)
    emotion  = detect_emotion(query)
    priority = assign_priority(intent, emotion)

    # Use a human-friendly label for the unknown case
    intent_label = intent if intent != "unknown" else "Needs manual review"

    return {
        "intent":      intent_label,
        "emotion":     emotion,
        "priority":    priority,
        "confidence":  calculate_confidence(query, intent),
        "decision":    DECISIONS.get(intent, DECISIONS["unknown"]),
        "action":      ACTIONS.get(intent, ACTIONS["unknown"]),
        "explanation": EXPLANATIONS.get(intent, EXPLANATIONS["unknown"]),
        "status":      resolve_status(intent, priority),
    }
