import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import "./App.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [code, setCode] = useState(`function sum(){
  return 1+1
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (err) {
      setReview("⚠️ Error fetching review. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <main>
        <motion.div
  className="left"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
  <div className="code-container">
    <div className="code">
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) =>
          prism.highlight(code, prism.languages.javascript, "javascript")
        }
        padding={10}
        style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: 16,
          color: "#fff",
          minHeight: "100%",
        }}
      />
    </div>
  </div>

  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="review"
    onClick={reviewCode}
  >
    {loading ? "Reviewing..." : "✨ Review"}
  </motion.div>
</motion.div>

        <motion.div
          className="right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>AI is reviewing your code...</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </motion.div>
      </main>
    </>
  );
}

export default App;
