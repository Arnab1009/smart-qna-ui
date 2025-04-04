async function askQuestion() {
  const question = document.getElementById("questionInput").value;
  const topK = parseInt(document.getElementById("topKSelect").value);
  const model = document.getElementById("modelSelect").value;
  const answerBox = document.getElementById("answerBox");
  const answerText = document.getElementById("answerText");
  const sourceList = document.getElementById("sourceList");

  // Reset
  answerText.textContent = "Loading...";
  sourceList.innerHTML = "";
  answerBox.classList.remove("visually-hidden");

  try {
    const response = await fetch("https://smart-qna-307756948431.us-central1.run.app/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        k: topK,
        llm_model: model,
        embedding_model: "text-embedding-005"
      }),
    });

    const data = await response.json();
    answerText.textContent = data.answer;

    (data.sources || []).forEach((src, idx) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
    
      // Extract arXiv ID from the filename
      const match = src.match(/(\d{4}\.\d{5,})(v\d+)?\.pdf/);
      if (match) {
        const arxivId = match[1] + (match[2] || "");
        const arxivUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    
        li.innerHTML = `<a href="${arxivUrl}" target="_blank">${idx + 1}. ${src}</a>`;
      } else {
        // fallback to plain text if pattern doesn't match
        li.textContent = `${idx + 1}. ${src}`;
      }
    
      sourceList.appendChild(li);
    });

    answerBox.scrollIntoView({ behavior: "smooth" });

  } catch (error) {
    answerText.textContent = "Something went wrong. Check the console.";
    console.error("Error:", error);
  }
}

function resetForm() {
  document.getElementById("questionInput").value = "";
  document.getElementById("topKSelect").value = "3";
  document.getElementById("modelSelect").value = "gemini-2.5-pro-exp-03-25";
  document.getElementById("answerBox").classList.add("visually-hidden");
}