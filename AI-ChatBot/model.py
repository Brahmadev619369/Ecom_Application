from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline


app = FastAPI()

model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)


pipe = pipeline("text-generation",model=model, tokenizer=tokenizer)

class ChatRequest(BaseModel):
    
    message: str
    userId: str | None = None


custom_response = {
    "who are you": "I am YourCart AI Chatbot, here to assist you with orders, payments, and more.",
    "why are you here": "I am designed to help you navigate YourCart. Ask me about orders, products, and more!",
    "what payment methods do you accept": "We accept credit/debit cards, PayPal, and UPI.",
    "return policy": "You can return items within 30 days. Visit our return policy page for details.",
    "delivery time": "Standard delivery takes 3-5 days. Express shipping is available."
}
    
@app.post("/chat")
async def chat(request:ChatRequest):
    user_message = request.message.lower()

    for key, value in custom_response.items():
        if key in user_message:
            return {"message":value}


    # // otherwise call lamma model 

    response = pipe(user_message, max_length = 150,do_sample =True,temperature=0.7)
    return {"message": response[0]["generated_text"]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8000)



