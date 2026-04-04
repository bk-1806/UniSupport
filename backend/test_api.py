import sys
import os

# Set up path so services module can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from services.ai_service import get_answer
    result = get_answer("I am sick and missed class")
    print("SUCCESS", result)
except Exception as e:
    import traceback
    traceback.print_exc()
