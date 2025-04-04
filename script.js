async function askQuestion() {
    const question = document.getElementById("questionInput").value;
    const answerText = document.getElementById("answerText");
    const sourceList = document.getElementById("sourceList");
  
    // Clear previous
    answerText.textContent = "Loading...";
    sourceList.innerHTML = "";
  
    try {
      const response = await fetch("https://smart-qna-307756948431.us-central1.run.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          k: 5,
          llm_model: "gemini-2.5-pro-exp-03-25",
          embedding_model: "text-embedding-005"
        }),
      });
  
      const data = await response.json();
      answerText.textContent = data.answer;
  
      (data.sources || []).forEach((src, idx) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = `${idx + 1}. ${src}`;
        sourceList.appendChild(li);
      });
  
    } catch (error) {
      answerText.textContent = "Something went wrong. Check the console.";
      console.error("Error:", error);
    }
  }
  