import os
import google.generativeai as genai

# === CONFIG ===
os.environ["GEMINI_API_KEY"] = "AIzaSyDwX2gx7IiRtCCwVBW149Xx5cDUpZ8kBFc"
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="models/gemini-2.0-flash",
    generation_config={
        "temperature": 0.3,
        "max_output_tokens": 256  # Risposte concise
    }
)

def fashion_response(user_query):
    prompt = f"""
Sei un assistente AI esperto di moda. Rispondi esclusivamente a domande riguardanti abbigliamento, stile, outfit, tendenze moda, consigli di look.

Domanda utente:
{user_query}

Risposta (in italiano, mass. 2-3 frasi, tono professionale e conciso):
"""
    response = model.generate_content(prompt)
    return response.text

# === ESEMPIO USO ===
# user_query = "Quali sono i colori di tendenza per la primavera?"
# print(fashion_response(user_query))
